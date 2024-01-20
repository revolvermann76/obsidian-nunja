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

type NoteMetadata = Pick<TFile, 'basename' | 'name' | 'path' | 'extension'>
	& Pick<CachedMetadata, 'frontmatter'>;

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
		const { frontmatter } = this.app.metadataCache.getFileCache(file) ?? {};
		return { basename, name, path, extension, frontmatter };
	}

	#blockHandler = debounce(
		async (source: string, container: HTMLElement, ctx: MarkdownPostProcessorContext) => {

			const rendered = nunjucks.renderString(`<h1>Hello, {{ name }}!</h1>`, { name: 'Nunjucks' });
			console.log(rendered)
			container.innerHTML = rendered;
		},
		250,
	)
}


