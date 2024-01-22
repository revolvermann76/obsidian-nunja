import { CachedMetadata, Editor, MarkdownPostProcessorContext, MarkdownRenderer, MarkdownView, Plugin, TFile, debounce } from "obsidian";

import { TPluginSettings } from "./types/TPluginSettings";
import { TNote } from "./types/TNote";
import { TSnippet } from "./types/TSnippet";
import { SettingTab } from "./SettingTab";
import * as nunjucks from 'nunjucks';

const CODEFENCE_NAME = "nunja";

const DEFAULT_SETTINGS: TPluginSettings = {
	templatePath: "templates",
	defaultOutputPath: "notes",
	defaultOpenBehavior: true,
	debug: false
};

type t2 = Pick<TFile, 'basename' | 'name' | 'path' | 'extension'>
	& Pick<CachedMetadata, 'frontmatter'>;

type NoteMetadata = {
	basename: string;
	name: string;
	path: string;
	extension: string;
	metadata: CachedMetadata
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
		return { basename, name, path, extension, metadata };
	}

	#blockHandler = debounce(
		async (source: string, container: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			const environment = nunjucks.configure({});
			const file: TFile = this.app.workspace.getActiveFile() as TFile;

			const context = { ...this.#noteRecord(file), ... { engine: 'Nunjucks' } };

			environment.addGlobal('getContext', function () {
				return context;
			})
			const rendered = environment.renderString(source, context);
			console.log(rendered)
			container.innerHTML = rendered;
		},
		250,
	)
}


