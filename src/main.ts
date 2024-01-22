import { CachedMetadata,  MarkdownPostProcessorContext,   Notice,   Plugin, TFile, debounce } from "obsidian";

import { TPluginSettings } from "./types/TPluginSettings";
import { TNote } from "./types/TNote";
import { TSnippet } from "./types/TSnippet";
import { SettingTab } from "./SettingTab";
import * as nunjucks from 'nunjucks';
import { getCurrentDate } from "./other/getCurrentDate";
import { getCurrentTime } from "./other/getCurrentTime";
import { getCurrentTimestamp } from "./other/getCurrentTimestamp";

const CODEFENCE_NAME = "nunja";

const DEFAULT_SETTINGS: TPluginSettings = {
	templatePath: "templates",
	defaultOutputPath: "notes",
	defaultOpenBehavior: true,
	debug: false
};

// type t2 = Pick<TFile, 'basename' | 'name' | 'path' | 'extension'>
// 	& Pick<CachedMetadata, 'frontmatter'>;

type NoteMetadata = {
	basename: string;
	name: string;
	path: string;
	extension: string;
	metadata: CachedMetadata;
	[key: string]: unknown;
}

export default class ObsidianNunjaPlugin extends Plugin {
	settings: TPluginSettings;
	templates: { notes: TNote[], snippets: TSnippet[] };
	async onload() {
		await this.#loadSettings(); // get the stored settings

		this.addSettingTab(new SettingTab(this.app, this)); // This adds a settings tab so the user can configure various aspects of the plugin

		// this.app.workspace.onLayoutReady(async () => {
		// 	// wait for the layout to be ready before loading the templates, because
		// 	// we need some Obsidian data-caches to be filled first
		// 	this.templates = await loadTemplates(this);
		// });

		this.registerMarkdownCodeBlockProcessor(
			CODEFENCE_NAME,
			async (source, el, ctx) => this.#blockHandler(source, el, ctx)
		)


	}

	/** load settings, wenn the Plugin gets loaded */
	async #loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}


	/** save the settings */
	async saveSettings() {
		await this.saveData(this.settings);
	}

	#noteRecord(file: TFile): NoteMetadata {
		const { basename, name, path, extension } = file;
		const metadata = this.app.metadataCache.getFileCache(file) ?? {};
		metadata.links = metadata.links || [];
		metadata.frontmatterLinks = metadata.frontmatterLinks || [];
		metadata.headings = metadata.headings || [];
		metadata.frontmatter = metadata.frontmatter || {};
		const links = [... metadata.links, ...metadata.frontmatterLinks];
		let title = metadata.frontmatter["title"] || basename;
		const h1s = metadata.headings.filter((h)=>h.level === 1);
		if(h1s.length){
			title = h1s[0].heading;
		}
		return { basename, name, path, extension, title, links, metadata};
	}

	#blockHandler = debounce(
		async (source: string, container: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			const environment = nunjucks.configure({});
			const file: TFile = this.app.workspace.getActiveFile() as TFile;

			const context = { 
				...this.#noteRecord(file), 
				... { 
					date : getCurrentDate,
					time : getCurrentTime,
					timestamp : getCurrentTimestamp,
					metadata: () => this.#noteRecord(file),
					app: () => this.app,
					nunja: () => this,
					global: ()=> global
				}
			};

			environment.addGlobal('context', ()=>{
				return context;
			})
			const rendered = environment.renderString(source, context);
			console.log(context)
			container.innerHTML = rendered;
		},
		250,
	)
}


