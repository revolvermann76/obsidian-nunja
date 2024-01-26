import { EditorPosition } from "obsidian";

/**
 * find a searchstring in a string an return its position as EditorPosition
 * @param haystack 
 * @param needle 
 * @returns 
 */
export function findPosition(
	haystack: string,
	needle: string
): EditorPosition | null {
	const splitted = haystack.split("\n"); // split the lines
	for (let i = 0; i < splitted.length; i++) { // run through the lines
		const index = splitted[i].indexOf(needle); // look for needle in the line
		if (index !== -1) { // we found it
			return { // return the EditorPosition
				line: i,
				ch: index,
			};
		}
	}
	return null; // we found nothing
}