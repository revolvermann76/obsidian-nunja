import { TField } from "./TField";

export type TTemplate = {
	type: "snippet" | "note";
	title: string;
	alias?: string | string[];
	fields: TField[];
	javascript?: string;
	template?: string;
}

export type TSnippet = TTemplate & {
	type: "snippet";
};
