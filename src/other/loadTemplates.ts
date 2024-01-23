import { Notice, TFile, TFolder, parseYaml } from "obsidian";
import ObsidianNunjaPlugin from "src/main";
// import { findMarkdownFiles } from "src/other/findMarkdownFiles";
// import { regExJavascriptTemplate, regExYamlTemplate } from "src/other/regex";
import { TNote } from "src/types/TNote";
import { TSnippet, TTemplate } from "src/types/TSnippet";
import { findMarkdownFiles } from "./findMarkdownFiles";
import { regExYamlTemplate } from "./regex";


/** loads a single template */
 export function loadTemplate(baseName: string, content: string): TTemplate{
		const template: TTemplate =  parseYaml(content); // extract yaml
        template.title = template.title || baseName; // use filename if there is no title
        template.type = template.type || "snippet"; // if there is no type it's type 'snippet'
        template.fields = template.fields || []; // make sure that we have a fields array
        template.alias = !template.alias
			? []
			: typeof template.alias === "string" 
                ? [template.alias] 
                : template.alias;
		return template;
 }

/**
 * 
 * @param plugin load templates from the template folder
 * @returns 
 */
export async function loadTemplates(plugin: ObsidianNunjaPlugin): Promise<{ notes: TNote[], snippets: TSnippet[] }> {

    const templates: { // templates are divided into 'notes' and 'snippets'
        notes: TNote[], 
        snippets: TSnippet[] 
    } = { 
        notes: [], 
        snippets: [] 
    };

    const folder = plugin.app.vault.getAbstractFileByPath( // get the templates folder
        plugin.settings.templatePath
    );

    let templateFiles: TFile[] = []; // a list of all markdownfiles that contain templates
    if (folder instanceof TFolder) {
        templateFiles = findMarkdownFiles(folder); // get a list of all mardown files in this folder and its subfolders
    } else {
        const err = "Unable to load templates from folder '" + plugin.settings.templatePath + "'. May the path does not exist?";
        new Notice(err, 30000);
        throw new Error(err);
    }

    for (let i = 0; i < templateFiles.length; i++) { //iterate over all files
        const file = templateFiles[i];
        const content = await plugin.app.vault.read(file); // read a file
        regExYamlTemplate.lastIndex = 0;
        
        let match : RegExpExecArray | null;
        
        let idx = 0;
       

            while((match = regExYamlTemplate.exec(content))!== null){
                 try {
                    const parsed = loadTemplate(
                        file.basename + (idx++ === 0 ? "" : "_" + idx),
                        match[1]
                    ); // loads a single template
                    if (parsed) {
                        if (parsed.type === "note") {
                            // sort our templates by type
                            templates.notes.push(parsed as TNote);
                        } else if (parsed.type === "snippet") {
                            templates.snippets.push(parsed as TSnippet);
                        }
                    }
                } catch (error) {
                    // oh now ... something went wrong, probably we were unable to parse the yaml
                    new Notice(
                        "Unable to parse '" + templateFiles[i].path + "' " + (error as Error).message,
                        20000
                    );
                }
            }
            

		
    }
    if(plugin.settings.debug){
        console.debug(templates);
    }
    return templates;
    throw "not implemented"
}