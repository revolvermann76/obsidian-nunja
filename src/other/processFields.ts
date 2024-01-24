import { Modal, Setting } from "obsidian";
import { TAreaField, TBooleanField, TChoiceField, TField, TTextField } from "src/types/TField";
import { MultiSuggest } from "./MultiSuggest";

// TODO kommentieren
export function processFields(this: Modal, fields: TField[]): Promise<{ [key: string]: unknown }> {
    const result: { [key: string]: unknown } = {};
    return new Promise((resolve, _reject) => {

        for (let i = 0; i < fields.length; i++) {
            const current = fields[i];
            let s;
            if (current.type === "text") {
                const textField = current as TTextField;
                s = new Setting(this.contentEl)
                    .setName(textField.title)
                    .addText((text) => {
                        if (textField.default) {
                            text.setPlaceholder(textField.default);
                            result[textField.key] = textField.default;
                        }
                        if (textField.preset) {
                            text.setValue(textField.preset)
                            result[textField.key] = textField.preset;
                        }
                        if (textField.items) {
                            const keys = Object.keys(textField.items);
                            const ms = new MultiSuggest(
                                text.inputEl,
                                (selected, list) => {
                                    if (list && textField.items && textField.items[selected]) {

                                        text.setValue(textField.items[selected]);
                                        result[textField.key] = textField.items[selected];
                                        ms.disable();
                                        window.setTimeout(() => {
                                            text.inputEl.focus();
                                        }, 10)
                                    }
                                },
                                this.app,
                                new Set(keys)
                            );
                            ms.limit = 100;
                            ms.minimalInputLength = 1;
                            text.inputEl.addEventListener("keydown", (ev: KeyboardEvent) => {
                                if (ev.key !== "Enter") {
                                    ms.enable();
                                }
                            });

                        }

                        text.onChange((e) => {
                            result[textField.key] = text.getValue() || textField.default || "";
                        });

                        text.inputEl.addEventListener("keydown", (ev: KeyboardEvent) => {
                            if (ev.key === "Enter") {
                                resolve(result);
                                ev.preventDefault();
                                this.close();
                            }
                        });
                    })

            } else if (current.type === "area") {
                const areaField = current as TAreaField;
                s = new Setting(this.contentEl)
                    .setName(areaField.title)
                    .addTextArea((area) => {
                        if (areaField.default) {
                            area.setPlaceholder(areaField.default);
                            result[areaField.key] = areaField.default;
                        }
                        if (areaField.preset) {
                            area.setValue(areaField.preset);
                            result[areaField.key] = areaField.preset;
                        }
                        area.onChange((e) => {
                            result[areaField.key] = area.getValue() || areaField.default || "";
                        });
                        area.inputEl.addEventListener("keydown", (ev: KeyboardEvent) => {
                            if (ev.key === "Enter" && !ev.shiftKey) {
                                resolve(result);
                                ev.preventDefault();
                                this.close();
                            }
                        });
                    });
            } else if (current.type === 'boolean') {
                const boolField = current as TBooleanField;
                s = new Setting(this.contentEl)
                    .setName(boolField.title)
                    .addToggle((bool) => {
                        if (typeof boolField.preset === "boolean") {
                            bool.setValue(boolField.preset);
                            result[boolField.key] = boolField.preset;
                        }
                        bool.onChange(() => {
                            result[boolField.key] = bool.getValue();
                        })
                        bool.toggleEl.addEventListener("keydown", (ev: KeyboardEvent) => {
                            if (ev.key === "Enter") {
                                resolve(result);
                                ev.preventDefault();
                                this.close();
                            }
                        })
                    });
            } else if (current.type === 'choice') {
                const choiceField = current as TChoiceField;
                s = new Setting(this.contentEl)
                    .setName(choiceField.title)
                    .addDropdown((dropdown) => {
                        const options: { [key: string]: string } = {};
                        const items = choiceField.items || ["No items configured in template"];
                        dropdown.addOptions(items)
                        if (choiceField.preset && options[choiceField.preset]) {
                            dropdown.setValue(choiceField.preset);
                            result[choiceField.key] = choiceField.preset;
                        }
                    });
            }
            if (i === 0) {
                (s?.controlEl.find("input, select") as HTMLInputElement).focus()
            }
        }

        new Setting(this.contentEl)
            .addButton((button) => {
                button.setButtonText("Create").onClick(() => {
                    resolve(result)
                    this.close();
                })
            });

    })
}