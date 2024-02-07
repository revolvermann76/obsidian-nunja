import { TFile } from "obsidian";
import { normalizePath } from "./normalizePath";

export function getNormalizedFolderPath(f: TFile): string {
    return normalizePath(f.path.slice(0, -f.name.length));
}