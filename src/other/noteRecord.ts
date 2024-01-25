import { TFile } from "obsidian";
import { TNoteMetadata } from "src/types/TNoteMetadata";

export function noteRecord(file: TFile): TNoteMetadata {
    const { basename, name, path, extension } = file;
    const metadata = this.app.metadataCache.getFileCache(file) ?? {};
    return { basename, name, path, extension, metadata };
}