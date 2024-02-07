import { App, Modal, TFile } from "obsidian";
import ObsidianNunjaPlugin from "src/main";
import { TNote } from "src/types/TNote";
import { getCurrentDate } from "./getCurrentDate";
import { getCurrentTime } from "./getCurrentTime";
import { getCurrentTimestamp } from "./getCurrentTimestamp";
import { processFields } from "./processFields";
import { AsyncFunction } from "./AsyncFunction";
import * as nunjucks from "nunjucks";
import * as obsidian from "obsidian";
import { writeStringToFile } from "./writeStringToFile";

export class NoteHandler {
	private context: { [key: string]: unknown };
    private environment: nunjucks.Environment;

	constructor(
		private app: App,
		private plugin: ObsidianNunjaPlugin,
		private file: TFile,
		private noteTemplate: TNote
	) {
        this.environment = nunjucks.configure({});
        this.#handleNote();
    }
    
    async #handleNote(){
        this.#createContext();

        // wenn das Snippet fields hat, werden diese nun zur Anzeige gebracht und deren Werte in Erfahrung gebracht
        if (this.noteTemplate.fields && this.noteTemplate.fields.length) {
            const m = new Modal(this.app);
            m.open();
            Object.assign(
                this.context,
                await processFields.call(m, this.noteTemplate.fields)
            );
            m.close();
        }

        if(this.noteTemplate.javascript){
            await this.#runJS();
        }

        await this.#render();

    }

    async #render(){
		this.environment.addFilter(
			"js",
			function (js, callback) {
				const fn = new AsyncFunction(
					"context",
					"obsidian",
					"nunja",
					js
				);
				fn(this.context, obsidian, this.environment).then(
					(result: unknown) => {
						callback(null, result);
					}
				);
			},
			true
		);

		// das Template wird kompiliert
		this.environment.renderString(
			this.noteTemplate.template || "",
			this.context,
			(err, compiledString) => {
				if (err) {
					compiledString =
						"Unable to render template. " + err.message;
				}

				compiledString = compiledString || "";

                writeStringToFile(this.file.path, compiledString, this.app);
			}
		);
	}

    async #runJS() {
		// es wird eine Funktion gebaut, die das Javascript des Templates ausführt
		const contextCreatorFn = new AsyncFunction(
			"context",
			"nunja",
			"app",
			"plugin",
			"obsidian",
			this.noteTemplate.javascript || ""
		);

		// das Javascript wird zur Ausführung gebracht. Dabei können die Properties des Kontext direkt verändert werden ...
		const result = await contextCreatorFn(
			this.context,
			this.environment,
			this.app,
			this.plugin,
			obsidian
		);

		if (result) {
			// ... oder der veränderte Kontext wird einem Rückgabewert entnommen
			Object.assign(this.context, result);
		}

        return this.context;
	}

	#createContext(): { [key: string]: unknown } {
		this.context = {
			global,
			nunja: this.plugin,
			app: this.app,
			date: getCurrentDate,
			filename: this.file.name,
			path: this.file.path,
			title: () => this.file.basename,
			time: getCurrentTime,
			timestamp: getCurrentTimestamp,

			// ... additional record entries ??
		};

		return this.context;
	}
}