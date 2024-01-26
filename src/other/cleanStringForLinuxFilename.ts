import { getCurrentTimestamp } from "./getCurrentTimestamp";

// Bereinigt einen String, damit es ein gültiger Dateiname ist
export function cleanStringForLinuxFilename(inputString: string): string {
    // Erlaubte Zeichen in einem Linux-Dateinamen, einschließlich Leerzeichen
    const numbers = "0123456789";
    const diacritic = "äöüÄÖÜßéèêàáíóúçñëîôûâêûășțźżćńłřůěščřžýÁÉÍÓÚÀÈÌÒÙÇÑËÎÔÛĂȘȚŹŻĆŃŁŘŮĚŠČŘŽÝ";
    const cyrillic = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    const western = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const signs = "\\(\\)\\[\\]{}_\\.\\- "
    const allowedChars = western + numbers + diacritic + cyrillic + signs;
    const cleanedString = inputString
        .replace(new RegExp(`[^${allowedChars}]`, 'g'), '_') // Ersetze unerlaubte Zeichen durch Unterstrich
        .replace(/^_+|_+$/g, ''); // Entferne führende und nachfolgende Unterstriche
    return cleanedString || getCurrentTimestamp();
}
