import { Notice, TFile, TFolder, parseYaml } from "obsidian";
import ObsidianNunjaPlugin from "src/main";
// import { findMarkdownFiles } from "src/other/findMarkdownFiles";
// import { regExJavascriptTemplate, regExYamlTemplate } from "src/other/regex";
import { TNote } from "src/types/TNote";
import { TSnippet, TTemplate } from "src/types/TSnippet";


// /** loads a single template */
// export function loadTemplate(baseName: string, content: string): TNote | TSnippet {

//     const matchesYaml = regExYamlTemplate.exec(content); // extract the yaml from the template
//     const matchesJavascript = regExJavascriptTemplate.exec(content); // extract the javascript from the template

//     let template: TTemplate = {
//         title: "",
//         fields: [],
//         type: "snippet",
//         javascript: ""
//     }; // a variable to safe the parsed yaml of the template

//     if (matchesYaml) { 
//         template = parseYaml(matchesYaml[1]); // extract yaml
//         content = content.replace(matchesYaml[0], ""); // remove the yaml block
//     }

//     if (matchesJavascript) {
//         template.javascript = matchesJavascript[1]; // extract the js
//         content = content.replace(matchesJavascript[0], ""); // remove the js block
//     }

//     template.title = template.title || baseName; // use filename if there is no title 
//     template.type = template.type || "snippet"; // if there is no type it's type 'snippet'
//     template.fields = template.fields || []; // make sure that we have a fields array
//     template.handlebarsTemplate = content.trim(); //the the rest of the content ist interpretet as handlebars template

//     return template as TNote | TSnippet;
// }

/**
 * 
 * @param plugin load templates from the template folder
 * @returns 
 */
export async function loadTemplates(plugin: ObsidianNunjaPlugin): Promise<{ notes: TNote[], snippets: TSnippet[] }> {

    // const templates: { // templates are divided into 'notes' and 'snippets'
    //     notes: TNote[], 
    //     snippets: TSnippet[] 
    // } = { 
    //     notes: [], 
    //     snippets: [] 
    // };

    // const folder = plugin.app.vault.getAbstractFileByPath( // get the templates folder
    //     plugin.settings.templatePath
    // );

    // let templateFiles: TFile[] = []; // a list of all markdownfiles that contain templates
    // if (folder instanceof TFolder) {
    //     templateFiles = findMarkdownFiles(folder); // get a list of all mardown files in this folder and its subfolders
    // }else {
    //     const err = "Unable to load templates from folder '" +
    // 			plugin.settings.templatePath + "'. May the path does not exist?";
    //     new Notice(
    // 		err, 
    //         30000
    // 	);
    //     throw new Error(err);
    // }

    // for (let i = 0; i < templateFiles.length; i++) { //iterate over all files
    //     const file = templateFiles[i];
    //     const content = await plugin.app.vault.read(file); // read a file
    //     try {
    // 		const parsed = loadTemplate(
    // 			file.basename,
    // 			content
    // 		); // loads a single template

    // 		if (parsed.alias) { // in case that we have aliases
    // 			if (typeof parsed.alias === "string") { // .. or more specific, a single alias as a string
    // 				parsed.alias = [parsed.alias]; // push the string into an array
    // 			}
    // 		} else { // in case we do not have
    // 			parsed.alias = []; // ... we have an empty list of aliases
    // 		}

    // 		if (parsed.type === "note") { // sort our templates by type
    // 			templates.notes.push(parsed);
    // 		} else if (parsed.type === "snippet") {
    // 			templates.snippets.push(parsed);
    // 		}
    // 	} catch (error) {
    //         // oh now ... something went wrong, probably we were unable to parse the yaml
    //         new Notice("Unable to parse '" + templateFiles[i].path + "'", 20000);
    //     }
    // }
    // if(plugin.settings.debug){
    //     console.debug(templates);
    // }
    // return templates;
    throw "not implemented"
}