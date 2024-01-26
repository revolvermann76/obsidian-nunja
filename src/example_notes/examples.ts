//@ts-nocheck 
import address from "./notes/address.md";
import application from "./notes/application.md";
import band from "./notes/band.md";
import book from "./notes/book.md";
import codeSnippet from "./notes/code snippet.md";
import dailyNote from "./notes/daily note.md";
import meeting from "./notes/meeting.md";
import movie from "./notes/movie.md";
import musicAlbum from "./notes/music album.md";
import person from "./notes/person.md";
import place from "./notes/place.md";
import poem from "./notes/poem.md";
import projectRoot from "./notes/project root.md";
import recipe from "./notes/recipe.md";
import simpleNote from "./notes/simple note.md";
import song from "./notes/song.md";
import template from "./notes/template.md";
import tvSeries from "./notes/tv series.md";

// // ---------------------

import callout from "./snippets/callout.md";
import checkbox from "./snippets/checkbox.md";
import codefence from "./snippets/codefence.md";
import html from "./snippets/html.md";
import mermaid from "./snippets/mermaid.md";
import table from "./snippets/table.md";
import phone from "./snippets/phone.md";
import dataview from "./snippets/dataview.md";

export const examples: { [key: string]: { [key: string]: string } } = {
	notes: {
		address,
		application,
		band,
		book,
		"code snippet": codeSnippet,
		"daily note": dailyNote,
		meeting,
		movie,
		"music album": musicAlbum,
		person,
		place,
		poem,
		"project root": projectRoot,
		recipe,
		"simple note": simpleNote,
		song,
		"template note": template,
		"tv series": tvSeries
	},
	snippets: {
		callout,
		checkbox,
		codefence,
		dataview,
		html,
		mermaid,
		phone,
		table,
	},
};
