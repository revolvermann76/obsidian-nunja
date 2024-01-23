import { TFile, TFolder } from "obsidian";
/**
 * Gets all Markdown-files in a folder and its subfolders
 * @param folder - the folder to search in
 * @returns an Array of Markdown-files
 */
export function findMarkdownFiles(folder: TFolder): TFile[] {
	let templateFiles: TFile[] = [];
	for (let i = 0; i < folder.children.length; i++) { // run through all children of that folder
		if (
			folder.children[i] instanceof TFile &&
			(folder.children[i] as TFile).extension === "md" // if we have a markdown file
		) {
			templateFiles.push(folder.children[i] as TFile); // ... let's collect it
		} else if (folder.children[i] instanceof TFolder) { // if the child is a folder
			templateFiles = templateFiles.concat( 
				findMarkdownFiles(folder.children[i] as TFolder) // ... let's parse it recursive
			);
		}
	}
	return templateFiles; // look what we found ;)
}
