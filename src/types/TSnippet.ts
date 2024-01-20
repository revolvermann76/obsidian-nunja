import { TField } from "./TField";

export type TTemplate = {
	type: "snippet" | "note";
	title: string;
	alias?: string | string[];
	fields: TField[];
	javascript?: string;
	templateString?: string;
}

export type TSnippet = TTemplate & {
	type: "snippet";
};
