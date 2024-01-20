import { App, TFolder } from "obsidian";

export async function createFolderIfNotExists(
	dirPath: string,
	app: App
): Promise<void> {
	const folder = app.vault.getAbstractFileByPath(dirPath);
	if (!(folder instanceof TFolder)) {
		try {
			await app.vault.createFolder(dirPath);
		} catch (error) {
			if (
				(error as Error).message !== "Folder already exists."
			) {
				throw error;
			}
		}
		return;
	}
}
