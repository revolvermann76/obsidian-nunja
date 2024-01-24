import { regExH1 } from "./regex";

// find the first header in a note
export function findH1(content: string): string {
    const matches = regExH1.exec(content);
    if (matches) {
        return matches[1];
    }
    return "";
}