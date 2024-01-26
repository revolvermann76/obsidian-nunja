import { App, Editor, MarkdownView, Modal, Setting, TFile } from "obsidian";
import path from "path";
import { examples } from "src/example_notes/examples";
import ObsidianNunjaPlugin from "src/main";
import { MultiSuggest } from "src/other/MultiSuggest";
import { cleanStringForLinuxFilename } from "src/other/cleanStringForLinuxFilename";
import { getCurrentTimestamp } from "src/other/getCurrentTimestamp";
import { loadTemplate } from "src/other/loadTemplates";
import { normalizePath } from "src/other/normalizePath";
import { TNote } from "src/types/TNote";
import * as nunjucks from "nunjucks";
import { getCurrentDate } from "src/other/getCurrentDate";
import { getCurrentTime } from "src/other/getCurrentTime";
import { processFields } from "src/other/processFields";
import { AsyncFunction } from "src/other/AsyncFunction";
import * as obsidian from "obsidian";
import { findPosition } from "src/other/findPosition";
import { writeStringToFile } from "src/other/writeStringToFile";
import { regExYamlTemplate } from "src/other/regex";

const cursorPosition = "Cvrs0rP05iti0n";

export class NewPageModal extends Modal {
	#filenameInput: HTMLInputElement;
	constructor(app: App, private plugin: ObsidianNunjaPlugin) {
		super(app);

		// collect all template names an aliases for a MultiSuggest
		const templateNames: string[] = [];
		const timeStamp = getCurrentTimestamp();
		let title = "";

		plugin.templates.notes.forEach((t) => {
			templateNames.push(t.title);
			(t.alias as string[]).forEach((a) => {
				templateNames.push(a);
			});
		});

		this.titleEl.innerHTML = "Create a new note"; // a header for our dialog

		// we want to know the title of the new file
		new Setting(this.contentEl).setName("Note title").addText((text) => {
			text.setPlaceholder(timeStamp);
			text.inputEl.style.width = "100%";
			text.inputEl.addEventListener("keydown", (ke: KeyboardEvent) => {
				if (ke.key === "Enter") {
					// whenn the user hits return
					ke.preventDefault();
					this.#onSelect(
						// we create a simple note ..
						title || timeStamp, // with the given title or a timestamp if we dont have a title
						"Simple Note"
					);
				}
			});
			text.onChange((value: string) => {
				title = value; // lets save the title, maybe we'll need it later ;)
			});
		});

		// we want to know, which template should be used
		new Setting(this.contentEl).setName("Template").addText((text) => {
			text.setPlaceholder("Simple Note");
			text.inputEl.style.width = "100%";

			// the input element gets extended with a MultiSuggest, to suggest the note templates, that we have
			const ms = new MultiSuggest(
				text.inputEl,
				(selected, list) => {
					if (!list && !templateNames.contains(selected)) {
						selected = "Simple Note"; // lets say its a simple note if we are unable the find a matching tempate
					}
					this.#onSelect(title || timeStamp, selected); // lets get into the next phase
				},
				this.app,
				new Set(templateNames) // feed the MultiSuggest with some names
			);
			ms.minimalInputLength = 0;
			ms.limit = 100;
		});
	}

	onClose() {
		this.contentEl.empty();
	}

	async #onSelect(title: string, noteTemplateTitle: string) {
		this.contentEl.empty();
		this.titleEl.innerHTML = noteTemplateTitle;
		const filename = cleanStringForLinuxFilename(title) + ".md";

		let noteTemplate = this.plugin.templates.notes // die gewählte Note wird anhand von Template-Titel oder Alias gefunden
			.filter((note: TNote) => {
				if (note.title === noteTemplateTitle) {
					return true;
				}
				const aliases = note.alias as string[];
				for (let i = 0; i < aliases.length; i++) {
					if (aliases[i] === noteTemplateTitle) {
						return true;
					}
				}
				return false;
			})[0];

		const simpleNote = this.plugin.templates.notes // die gewählte Note wird anhand von Template-Titel oder Alias gefunden
			.filter((note: TNote) => {
				if (note.title === "simple note") {
					return true;
				}
				return false;
			})[0];

        regExYamlTemplate.lastIndex = 0;
        const matches = regExYamlTemplate.exec(examples.notes["simple note"]);
		const simpleNoteExample = loadTemplate(
			"simple note",
			matches ? matches[1] : ""
		) as TNote;

		noteTemplate = noteTemplate || simpleNote || simpleNoteExample;

        if (this.plugin.settings.debug) {
            console.debug(noteTemplateTitle, noteTemplate);
        }

		const folderPath = normalizePath(
			noteTemplate.destination
				? noteTemplate.destination
				: this.plugin.settings.defaultOutputPath
		);
		const filePath = normalizePath(path.join(folderPath, filename));

		// alle Teile des Snippets, die zum Kompilieren des Templates nötig sind, werden zusammengetragen
		const templateString = noteTemplate.template || "";
		const js = noteTemplate.javascript || "";
		const environment = nunjucks.configure({});
		let selectedText = "";
		try {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			const editor = view?.editor as Editor;
			selectedText = editor.getSelection() || ""; // eventuell hatte der Benutzer zuvor Text selektiert
		} catch (error) {
			//
		}

		// building the context
		const context: { [key: string]: unknown } = {
			selection: selectedText,
			global,
			nunja: this.plugin,
			app: this.app,
			date: getCurrentDate,

			filename: filename,
			path: filePath,
			title: () => title,
			time: getCurrentTime,
			timestamp: getCurrentTimestamp,

			// ... additional record entries ??
		};

		environment.addFilter(
			"js",
			function (js, callback) {
				const fn = new AsyncFunction(
					"context",
					"obsidian",
					"nunja",
					js
				);
				fn(context, obsidian, environment).then((result: unknown) => {
					callback(null, result);
				});
			},
			true
		);

		// wenn das Snippet fields hat, werden diese nun zur Anzeige gebracht und deren Werte in Erfahrung gebracht
		if (noteTemplate.fields && noteTemplate.fields.length) {
			Object.assign(
				context,
				await processFields.call(this, noteTemplate.fields)
			);
		}

		this.close(); // der Dialog wird nun nicht mehr benötigt

		// es wird eine Funktion gebaut, die das Javascript des Templates ausführt
		const contextCreatorFn = new AsyncFunction(
			"context",
			"nunja",
			"app",
			"plugin",
			"obsidian",
			js
		);

		// das Javascript wird zur Ausführung gebracht. Dabei können die Properties des Kontext direkt verändert werden ...
		const result = await contextCreatorFn(
			context,
			environment,
			this.app,
			this.plugin,
			obsidian
		);
		if (result) {
			// ... oder der veränderte Kontext wird einem Rückgabewert entnommen
			Object.assign(context, result);
		}

		// es wird ein Platzhalter für die Cursorposition geschaffen
		context["cursor"] = cursorPosition;

		if (this.plugin.settings.debug) {
			console.debug(context);
		}

		// das Template wird kompiliert
		environment.renderString(
			templateString,
			context,
			(err, compiledString) => {
				if (err) {
					compiledString =
						"Unable to render template. " + err.message;
				}

				compiledString = compiledString || "";

                const open =
					noteTemplate.open ||
					this.plugin.settings.defaultOpenBehavior;
                const pos = findPosition(
                    compiledString,
                    cursorPosition
                );
                compiledString = compiledString.replaceAll(
                    cursorPosition,
                    ""
                );
                writeStringToFile(
                    context.path as string,
                    compiledString,
                    this.app
                ).then(()=>{

                    if (open) {
                        console.log("open", open);
                        const tFile = this.app.vault.getAbstractFileByPath(
                            context.path as string
                        ) as TFile;
                        const leaf =
                            open === "tab"
                                ? this.app.workspace.getLeaf(true)
                                : this.app.workspace.getMostRecentLeaf() ||
                                    this.app.workspace.getLeaf(true);
                        leaf.openFile(tFile).then(()=>{
                            const view =
                                this.app.workspace.getActiveViewOfType(
                                    MarkdownView
                                );
                            const editor = view?.editor as Editor;
                            if (pos) {
                                editor.setCursor(pos);
                            }
                            editor.focus();
                        });
                    }
                })
			}
		);
	}
}