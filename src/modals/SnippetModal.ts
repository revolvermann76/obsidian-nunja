import { App, Editor, MarkdownView, Modal, TFile } from 'obsidian';
import ObsidianNunjaPlugin from 'src/main';
import { MultiSuggest } from 'src/other/MultiSuggest';
import { TSnippet } from 'src/types/TSnippet';
import { getCurrentTimestamp } from 'src/other/getCurrentTimestamp';
import { getCurrentTime } from 'src/other/getCurrentTime';
import { getCurrentDate } from 'src/other/getCurrentDate';
import { AsyncFunction } from 'src/other/AsyncFunction';
import { processFields } from 'src/other/processFields';
import * as nunjucks from 'nunjucks';
import { noteRecord } from 'src/other/noteRecord';
import * as obsidian from "obsidian";

const cursorPosition = "Cvrs0rP05iti0n";

export class SnippetModal extends Modal {
	#snippetInput: HTMLInputElement;


	/* Im Constructor geht es darum, zu erfassen, welches der Snippets gewähltwird */
	constructor(app: App, private plugin: ObsidianNunjaPlugin, private editor: Editor, private view: MarkdownView) {
		super(app);

		this.titleEl.innerHTML = "Snippet"; // setzen der Überschrift des Dialogs

		// es wird ein Eingabeelement erstellt
		this.#snippetInput = document.createElement("input");
		this.#snippetInput.addClass("snippet-input");
		this.#snippetInput.setAttribute("placeholder", "Pick your snippet ...");

		// das Eingabeelement wird um ein Multisuggest erweitert, damit die vorhandenen Snippets vorgeschlagen werden
		const ms = new MultiSuggest(
			this.#snippetInput,
			this.#onSelectSnippet.bind(this), // wird ein Eintrag ausgewählt erfolgt eine Übergabe an die onSelectSnippet() Methode
			this.app
		);
		ms.minimalInputLength = 0;
		ms.limit = 100;

		// das Multisuggest bekommt die Titel der Snippets und Aliase als Auswahlelemente
		const templateNames: string[] = [];
		plugin.templates.snippets.forEach((t) => {
			templateNames.push(t.title);
			(t.alias as string[]).forEach((a) => {
				templateNames.push(a);
			})
		})
		ms.setContent(
			new Set(
				templateNames
					.sort((a: string, b: string) => a > b ? 1 : a === b ? 0 : -1)
			)
		);

		// das Eingabeelement wird in die Oberfläche engehängt
		this.contentEl.appendChild(this.#snippetInput);
	}

	/* lädt das ausgewählte Snippet und ermittelt ggf. die Inhalte der Fields */
	async #onSelectSnippet(snippetName: string, list: boolean) {
		if (!list) { // Wenn die Auswahl nicht aus dem Autosuggest heraus erfolgte, tue nichts
			return;
		}
		const environment = nunjucks.configure({}); // eine neue Instanz 
		const file: TFile = this.view.file as TFile;
		this.titleEl.innerHTML = snippetName; // die Überschrift des Dialogs wird auf den Namen des Snippets gesetzt
		this.#snippetInput.style.display = "none"; // das Eingabeelement wird nicht mehr benötigt und ausgeblendet
		const snippet = this.plugin.templates.snippets // das gewählte Snippet wird anhand von Titel oder Alias gefunden
			.filter((s: TSnippet) => {
				if (s.title === snippetName) {
					return true;
				}
				const aliases = (s.alias as string[]);
				for (let i = 0; i < aliases.length; i++) {
					if (aliases[i] === snippetName) {
						return true;
					}
				}
				return false;
			})[0];

		// alle Teile des Snippets, die zum Kompilieren des Templates nötig sind, werden zusammengetragen
		const templateString = snippet.template || "";
		const js = snippet.javascript || "";
		const selectedText = this.editor.getSelection() || ""; // eventuell hatte der Benutzer zuvor Text selektiert

		const context: { [key: string]: unknown } = {
			...noteRecord(file),
			...{
				selection: selectedText,
				global,
				nunja: this.plugin,
				app: this.app,
				date: getCurrentDate,

				filename: file.name,
				path: file.path,
				title: () => {
					const nRecord = noteRecord(file);
					const title =
						nRecord.metadata.frontmatter?.title || nRecord.basename;
					const h1s = (nRecord.metadata.headings || []).filter(
						(h) => h.level === 1
					);
					return h1s.length ? h1s[0].heading : title;
				},
				time: getCurrentTime,
				timestamp: getCurrentTimestamp,
				tags: () => {
					const nRecord = noteRecord(file);
					return [
						...(nRecord.metadata.tags || []).map((t) =>
							t.tag.substring(1)
						),
						...(nRecord.metadata.frontmatter || { tags: [] }).tags,
					];
				},
				links: () => {
					const nRecord = noteRecord(file);
					return [
						...(nRecord.metadata.links || []),
						...(nRecord.metadata.frontmatterLinks || []),
					];
				},
				// ... additional record entries ??
			},
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
				fn(context, obsidian, environment).then(
					(result: unknown) => {
						callback(null, result);
					}
				);
			},
			true
		);

		environment.addGlobal("context", () => context);

		// wenn das Snippet fields hat, werden diese nun zur Anzeige gebracht und deren Werte in Erfahrung gebracht
		if (snippet.fields && snippet.fields.length) {
			const result = await processFields.call(this, snippet.fields)
			Object.assign(context, result);
		}

		this.close(); // der Dialog wird nun nicht mehr benötigt

		// es wird eine Funktion gebaut, die das Javascript des Templates ausführt
		const contextCreatorFn = new AsyncFunction(
			"context",
			"handlebars",
			"app",
			"plugin",
			"editor",
			"view",
			js
		);

		// das Javascript wird zur Ausführung gebracht. Dabei können die Properties des Kontext direkt verändert werden ...
		const result = await contextCreatorFn(context, environment, this.app, this.plugin, this.editor, this.view);
		if (result) {
			// ... oder der veränderte Kontext wird einem Rückgabewert entnommen
			Object.assign(context, result);
		}

		// es wird ein Platzhalter für die Cursorposition geschaffen
		context["cursor"] = cursorPosition;

		if (this.plugin.settings.debug) { console.debug(context) }

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

				// der kompilierte String wird an der (ersten) Cursorposition aufgesplittet
				const cursorParts = compiledString.split(cursorPosition);
				const before = cursorParts[0];
				cursorParts.shift();
				const after = cursorParts.join();

				// der Teil vor dem Cursor wird im Editor eingefügt
				this.editor.replaceSelection(before);

				// die neue Cursorposition wird gespeichert
				const pos = this.editor.getCursor();

				// der Teil hinter dem Cursor wird im Editor eingefügt
				this.editor.replaceSelection(after);

				// der Cursor wird an die gewünschte Position gesetzt
				this.editor.setCursor(pos);
			}
		);
	}

	onClose() {
		this.contentEl.empty();
	}
}
