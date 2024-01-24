// Importing necessary classes from the "obsidian" module
import { App, AbstractInputSuggest } from "obsidian";

// Custom class MultiSuggest extending AbstractInputSuggest with string as the generic type
export class MultiSuggest extends AbstractInputSuggest<string> {
	// Set to store content items
	content: Set<string>;

	// Private class properties prefixed with #
	#minimalInputLength = 1;
	#enabled = true;

	// Constructor for the MultiSuggest class
	constructor(
		// Parameters include an HTMLInputElement, a callback function, the Obsidian App instance, and an optional content Set
		private inputEl: HTMLInputElement,
		private onSelectCb: (value: string, list: boolean) => void,
		app: App,
		content = new Set<string>([])
	) {
		// Call the constructor of the parent class (AbstractInputSuggest)
		super(app, inputEl);

		// Initialize class properties
		this.content = content;
		this.limit = 10;

		// Event listener for keydown events on the input element
		this.inputEl.addEventListener("keydown", (ev: KeyboardEvent) => {
			// Check if the pressed key is "Enter"
			if (ev.key === "Enter") {
				// Prevent the default Enter key behavior
				ev.preventDefault();

				// Call the onSelectCb callback with the input value and list flag set to false
				this.onSelectCb(this.inputEl.value, false);
			}
		});
	}

	// Setter for the minimalInputLength property
	set minimalInputLength(len: number) {
		// Ensure that minimalInputLength is a non-negative integer
		this.#minimalInputLength = Math.floor(Math.abs(len));
	}

	// Method to set the content of the suggester
	setContent(content: Set<string>) {
		this.content = content;
	}

	// Method to get suggestions based on the input string
	getSuggestions(inputStr: string): string[] {
		// Check if the input length is less than minimalInputLength or the suggester is not enabled
		if (inputStr.length < this.#minimalInputLength || !this.#enabled) {
			return [];
		}

		// Convert input string and content items to lowercase for case-insensitive comparison
		const lowerCaseInputStr = inputStr.toLocaleLowerCase();
		return [...this.content].filter((content) =>
			content.toLocaleLowerCase().includes(lowerCaseInputStr)
		);
	}

	// Method to enable the suggester
	enable() {
		this.#enabled = true;
	}

	// Method to disable the suggester
	disable() {
		this.#enabled = false;
	}

	// Method to render a suggestion in the UI
	renderSuggestion(content: string, el: HTMLElement): void {
		// Set the text content of the suggestion element
		el.textContent = content;
	}

	// Method to handle the selection of a suggestion
	selectSuggestion(content: string, evt: MouseEvent | KeyboardEvent): void {
		// Clear the input value
		this.inputEl.value = "";

		// Call the onSelectCb callback with the selected content and list flag set to true
		this.onSelectCb(content, true);

		// Blur the input element and close the suggestion list
		this.inputEl.blur();
		this.close();
	}
}
