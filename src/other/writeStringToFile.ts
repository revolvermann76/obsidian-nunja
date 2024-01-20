import { App, TFile } from "obsidian";
import { normalizePath } from "./normalizePath";

export async function writeStringToFile(filePath: string, content: string, app: App) {
	const file = app.vault.getAbstractFileByPath(normalizePath(filePath));
	if (!file) {
		await app.vault.create(normalizePath(filePath), content, {});
		return;
	} else {
		if (file instanceof TFile) {
			await app.vault.modify(file as TFile, content);
			return;
		} else {
			throw new Error("Unable to write " + filePath);
		}
	}
}
