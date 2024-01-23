import { TTemplate } from "./TSnippet";

export type TNote = TTemplate & {
	type: "note";
	destination?: string; // path where the note will be created
	open?: boolean | "tab"; // open the note after creation (default is true)
};
