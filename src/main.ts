import { Component, Editor, MarkdownPostProcessorContext, MarkdownRenderer, MarkdownView, Plugin, TFile } from "obsidian";
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
import { loadTemplates } from "./other/loadTemplates";
import { SnippetModal } from "./modals/SnippetModal";
import { noteRecord } from "./other/noteRecord";
import { NewPageModal } from "./modals/NewPageModal";
import { NoteHandler } from "./other/NoteHandler";
import { getNormalizedFolderPath } from "./other/getNormalizedFolderPath";

const CODEFENCE_NAME = "nunja";

const DEFAULT_SETTINGS: TPluginSettings = {
	templatePath: "templates",
	defaultOutputPath: "notes",
	defaultOpenBehavior: true,
	debug: false
};

export default class ObsidianNunjaPlugin extends Plugin {
	settings: TPluginSettings;
	templates: { notes: TNote[], snippets: TSnippet[] };
	async onload() {
		await this.#loadSettings(); // get the stored settings

		this.addSettingTab(new SettingTab(this.app, this)); // This adds a settings tab so the user can configure various aspects of the plugin

		this.app.workspace.onLayoutReady(async () => {
			// wait for the layout to be ready before loading the templates, because
			// we need some Obsidian data-caches to be filled first
			this.templates = await loadTemplates(this);

			this.registerEvent(
				this.app.vault.on("create", (f: TFile) => {
					console.log(f);
					for(let i = 0; i < this.templates.notes.length; i++){
						const noteTemplate : TNote = this.templates.notes[i];
						if (
							getNormalizedFolderPath(f) === noteTemplate.monitor
						) {
							new NoteHandler(this.app, this, f, noteTemplate);
							break;
						}
					}
				})
			);
		});

		this.registerMarkdownCodeBlockProcessor(
			CODEFENCE_NAME,
			async (source, el, ctx) => this.#blockHandler(source, el, ctx)
		);

		// add the command "Reload templates" that can be triggered anywhere
		// It can be useful to call it, after you changed some templates
		this.addCommand({
			id: "reload-templates",
			name: "Reload templates",
			callback: async () => {
				this.templates = await loadTemplates(this);
				new Notification("Templates reloaded");
			},
		});

		// This adds the "Insert snippet" editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "insert-snippet",
			name: "Insert snippet",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				new SnippetModal(this.app, this, editor, view).open();
			},
		});

		// add the command "New note from template" that can be triggered anywhere
		this.addCommand({
			id: "new-note",
			name: "New note from template",
			callback: () => {
				new NewPageModal(this.app, this).open();
			},
		});


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

	

	#blockHandler = async (source: string, container: HTMLElement, ctx: MarkdownPostProcessorContext) => {

			const environment = nunjucks.configure({});
			const file: TFile = this.app.workspace.getActiveFile() as TFile;

			const context = {
				... noteRecord(file),
				... {
					global,
					nunja: this,
					app: this.app,
					date: getCurrentDate,
					title: () => {
						const nRecord = noteRecord(file)
						const title =
							nRecord.metadata.frontmatter?.title ||
							nRecord.basename;
						const h1s = (nRecord.metadata.headings || []).filter((h) => h.level === 1);
						return h1s.length ? h1s[0].heading : title;
					},
					time: getCurrentTime,
					timestamp: getCurrentTimestamp,
					tags: () => {
						const nRecord = noteRecord(file);
						return [
							...(nRecord.metadata.tags || []).map((t) => t.tag.substring(1)),
							...(nRecord.metadata.frontmatter || { tags: [] }).tags
						]
					},
					links: () => {
						const nRecord = noteRecord(file)
						return [
							...(nRecord.metadata.links || []),
							...(nRecord.metadata.frontmatterLinks || [])
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


			environment.addGlobal('context', () => context);
			environment.renderString(source, context, (err, compiledString) => {
				if (err) {
					compiledString = "Unable to render template. " + err.message
				}

				MarkdownRenderer.render(
					this.app,
					compiledString || "",
					container,
					ctx.sourcePath,
					this.app.workspace.getActiveViewOfType(MarkdownView) as Component
				)
			});
		}
}

