import { CachedMetadata } from "obsidian";
export type TNoteMetadata = {
	basename: string;
	name: string;
	path: string;
	extension: string;
	metadata: CachedMetadata;
};