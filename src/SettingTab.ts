import {
	App,
	PluginSettingTab,
	Setting,
	Notice,
	normalizePath,
} from "obsidian";
import ObsidianNunjaPlugin from "./main";
import path from "path";
import { writeStringToFile } from "./other/writeStringToFile";
import { createFolderIfNotExists } from "./other/createFolderIfNotExists";
import { examples } from "./example_notes/examples";
import { loadTemplates } from "./other/loadTemplates";

export class SettingTab extends PluginSettingTab {
	plugin: ObsidianNunjaPlugin;

	constructor(app: App, plugin: ObsidianNunjaPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		new Setting(containerEl)
			.setName("Default output path")
			.setDesc(
				"the path, where a new note will be saved if it is not defined in the template"
			)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.defaultOutputPath)
					.onChange(async (value) => {
						this.plugin.settings.defaultOutputPath = normalizePath(
							value || ""
						);
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl)
			.setName("Templates path")
			.setDesc("the path, where the template files are stored")
			.addText((text) =>
				text
					.setPlaceholder("templates")
					.setValue(this.plugin.settings.templatePath)
					.onChange(async (value) => {
						this.plugin.settings.templatePath = normalizePath(
							value || "templates"
						);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("A new note opens")
			.setDesc(
				"choose whether to not open a new note, to open it in the same tab or in a new tab"
			)
			.addDropdown((dropdown) => {
				dropdown
					.addOption("true", "in the same tab")
					.addOption("tab", "in a different tab")
					.addOption("false", "not")
					.setValue(this.plugin.settings.defaultOpenBehavior + "")
					.onChange(async (value: string) => {
						this.plugin.settings.defaultOpenBehavior =
							value === "true"
								? true
								: value === "false"
									? false
									: "tab";
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Sample templates")
			.setDesc("generate some sample templates")
			.addButton((button) =>
				button.setButtonText("Generate").onClick(async () => {
					await createFolderIfNotExists(
						this.plugin.settings.templatePath,
						this.app
					);
					const subFolders = Object.keys(examples);
					for (let i = 0; i < subFolders.length; i++) {
						const subFolderFullPath = path.join(
							this.plugin.settings.templatePath,
							subFolders[i]
						);
						await createFolderIfNotExists(
							subFolderFullPath,
							this.app
						);

						const fileNames = Object.keys(examples[subFolders[i]]);

						for (let j = 0; j < fileNames.length; j++) {
							await writeStringToFile(
								path.join(subFolderFullPath, fileNames[j]) +
								".md",
								examples[subFolders[i]][fileNames[j]],
								this.app
							);
						}
					}

					new Notice(
						"Sample templates generated under '" +
						this.plugin.settings.templatePath +
						"'"
					);

				})
			);
	}

	hide(): void {
		createFolderIfNotExists(this.plugin.settings.templatePath, this.app);
		loadTemplates(this.plugin).then((templates) => {
			this.plugin.templates = templates
			if (this.plugin.settings.debug) {
				console.debug("Templates reloaded");
			}
		})
	}
}
