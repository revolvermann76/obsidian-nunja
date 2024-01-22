import { CachedMetadata, Component, MarkdownPostProcessorContext, MarkdownRenderer, MarkdownView, Plugin, TFile, debounce } from "obsidian";
import * as obsidian from "obsidian";
import { TPluginSettings } from "./types/TPluginSettings";
import { TNote } from "./types/TNote";
import { TSnippet } from "./types/TSnippet";
import { SettingTab } from "./SettingTab";
import * as nunjucks from 'nunjucks';
import { getCurrentDate } from "./other/getCurrentDate";
import { getCurrentTime } from "./other/getCurrentTime";
import { getCurrentTimestamp } from "./other/getCurrentTimestamp";
import { AsyncFunction } from "./other/AsyncFunction";

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

	test() {
		const str = "Hello nunja."
		console.log(str);
		return str;
	}

	#noteRecord(file: TFile): NoteMetadata {
		const { basename, name, path, extension } = file;
		const metadata = this.app.metadataCache.getFileCache(file) ?? {};
		metadata.links = metadata.links || [];
		metadata.frontmatterLinks = metadata.frontmatterLinks || [];
		metadata.headings = metadata.headings || [];
		metadata.frontmatter = metadata.frontmatter || {};
		metadata.tags = metadata.tags || [];
		metadata.frontmatter.tags = metadata.frontmatter.tags || [];
		return { basename, name, path, extension, metadata };
	}

	#blockHandler = debounce(
		async (source: string, container: HTMLElement, ctx: MarkdownPostProcessorContext) => {

			const environment = nunjucks.configure({});
			const file: TFile = this.app.workspace.getActiveFile() as TFile;

			const context = {
				...this.#noteRecord(file),
				... {
					global,
					nunja: this,
					app: this.app,
					date: getCurrentDate,
					title: () => {
						const noteRecord = this.#noteRecord(file)
						let title = noteRecord.metadata.frontmatter!["title"] || noteRecord.basename;
						const h1s = noteRecord.metadata.headings!.filter((h) => h.level === 1);
						return h1s.length ? h1s[0].heading : title;
					},
					time: getCurrentTime,
					timestamp: getCurrentTimestamp,
					tags: () => {
						const noteRecord = this.#noteRecord(file);
						return [
							...noteRecord.metadata.tags!.map((t) => t.tag.substring(1)),
							...noteRecord.metadata.frontmatter!.tags
						]
					},
					links: () => {
						const noteRecord = this.#noteRecord(file)
						return [
							...noteRecord.metadata.links!,
							...noteRecord.metadata.frontmatterLinks!
						]
					}
					// ... additional record entries ??
				}
			};

			environment.addFilter(
				"js",
				function (js, callback) {
					const fn = new AsyncFunction("context", "obsidian", "nunja", js);
					fn(context, obsidian, environment).then((result: unknown) => {
						callback(null, result)
					})
				},
				true
			);

			//const noteRecord = this.#noteRecord(file)
			// environment.addGlobal('title', () => {
			// 	const noteRecord = this.#noteRecord(file)
			// 	let title = noteRecord.metadata.frontmatter!["title"] || noteRecord.basename;
			// 	const h1s = noteRecord.metadata.headings!.filter((h) => h.level === 1);
			// 	return h1s.length ? h1s[0].heading : title;
			// });
			// environment.addGlobal('tags', () => {
			// 	const noteRecord = this.#noteRecord(file);
			// 	return [
			// 		...noteRecord.metadata.tags!.map((t) => t.tag.substring(1)),
			// 		...noteRecord.metadata.frontmatter!.tags
			// 	]
			// });
			// environment.addGlobal('links', () => {
			// 	const noteRecord = this.#noteRecord(file)
			// 	return [
			// 		...noteRecord.metadata.links!,
			// 		...noteRecord.metadata.frontmatterLinks!
			// 	]
			// });
			//environment.addGlobal('app', () => this.app);
			environment.addGlobal('context', () => context);
			//environment.addGlobal("date", getCurrentDate);
			//environment.addGlobal("time", getCurrentTime);
			//environment.addGlobal("timestamp", getCurrentTimestamp);


			environment.renderString(source, context, (err, rendered) => {
				if (err) {
					rendered = "Unable to render template. " + err.message
				}

				MarkdownRenderer.render(
					this.app,
					rendered || "",
					container,
					ctx.sourcePath,
					this.app.workspace.getActiveViewOfType(MarkdownView) as Component
				)
				//container.innerHTML = rendered || "";
			});
		},
		250,
	)
}


