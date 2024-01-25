// @ts-nocheck 
// import daily from "./notes/Daily Note.md";
// import template from "./notes/Template Note.md";
import simpleNote from "./notes/simple note.md";

// // ---------------------

import callout from "./snippets/callout.md";
import checkbox from "./snippets/checkbox.md";
import codefence from "./snippets/codefence.md";
import html from "./snippets/html.md";
import mermaid from "./snippets/mermaid.md";
import table from "./snippets/table.md";
import phone from "./snippets/phone.md";

export const examples: { [key: string]: { [key: string]: string } } = {
	notes: {
		// "daily note": daily,
		"simple note": simpleNote,
		// "template note": template,
	},
	snippets: {
		callout,
		codefence,
		checkbox,
		html,
		mermaid,
		table,
		phone
	},
};
