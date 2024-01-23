// @ts-nocheck 
// import daily from "./notes/Daily Note.md";
// import template from "./notes/Template Note.md";
import simpleNote from "./notes/simple note.md";

// // ---------------------

import callout from "./snippets/callout.md";
// import checkbox from "./snippets/Checkbox.md";
// import codeblock from "./snippets/Codeblock.md";
// import codeblockBash from "./snippets/Codeblock Bash.md";
// import codeblockCSS from "./snippets/Codeblock CSS.md";
// import codeblockDataviewJS from "./snippets/Codeblock DataviewJS.md";
// import codeblockHTML from "./snippets/Codeblock HTML.md";
// import codeblockJS from "./snippets/Codeblock JavaScript.md";
// import codeblockPython from "./snippets/Codeblock Python.md";
// import codeblockRunJS from "./snippets/Codeblock RunJS.md";
// import codeblockTS from "./snippets/Codeblock TypeScript.md";
// import htmlCenter from "./snippets/HTML Center.md";
// import htmlIFrame from "./snippets/HTML IFrame.md";
// import htmlPagebreak from "./snippets/HTML PageBreak.md";
// import dataviewReference from "./snippets/List reference notes.md";
import mermaid from "./snippets/mermaid.md";
// import table from "./snippets/Table.md";
// import task from "./snippets/Task.md";
// import phone from "./snippets/Telephone.md";



export const examples: { [key: string]: { [key: string]: string } } = {
	notes: {
		// "daily note": daily,
		"simple note": simpleNote,
		// "template note": template,
	},
	snippets: {
		callout: callout,
		// codeblock: codeblock,
		// checkbox: checkbox,
		// "Codeblock Bash": codeblockBash,
		// "Codeblock Javascript": codeblockJS,
		// "Codeblock Python": codeblockPython,
		// "Codeblock RunJS": codeblockRunJS,
		// "Codeblock CSS": codeblockCSS,
		// "Codeblock DataviewJS": codeblockDataviewJS,
		// "Codeblock HTML": codeblockHTML,
		// "Codeblock TypeScript": codeblockTS,
		// "HTML Center": htmlCenter,
		// "HTML IFrame": htmlIFrame,
		// "HTML Pagebreak": htmlPagebreak,
		// "Dataview Referencing Notes": dataviewReference,
		"mermaid": mermaid,
		// Table: table,
		// Task: task,
		// Phone: phone
	},
};
