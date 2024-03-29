import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import fs from "fs";
import path from "path";
import { readFile } from "fs/promises";

function createDirectoryIfNotExists(directoryPath) {
	if (!fs.existsSync(directoryPath)) {
		fs.mkdirSync(directoryPath, { recursive: true });
		console.log(`Directory ${directoryPath} created.`);
	}
}

const copyPlugin = () => ({
	name: "copy-plugin",
	setup(build) {
		build.onEnd(async () => {
			const pathIn = "./";
			const pathOut =
				"C:/Users/marc.jentsch/Development/GitHub/zettelkasten/.obsidian/plugins/obsidian-nunja/";
			//const pathOut = "/home/marc/zettelkasten/.obsidian/plugins/obsidian-nunja/";
			const files = [
				"manifest.json",
				"main.js",
				"styles.css"
			];

			createDirectoryIfNotExists(pathOut);
			for (let i = 0; i < files.length; i++) {
				try {

					console.log(path.join(pathIn, files[i]), path.join(pathOut, files[i]));
					fs.copyFileSync(path.join(pathIn, files[i]), path.join(pathOut, files[i]));
				} catch (e) {
					console.error("Failed to copy file:", e);
				}
			}
		});
	},
});

const MDImportPlugin = () => ({
	name: "MDImportPlugin",
	setup(build) {
		build.onLoad({ filter: /\.md$/ }, async (args) => {
			const f = await readFile(args.path);
			return { loader: "text", contents: f };
		});
	},
});

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins,
	],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
	plugins: [copyPlugin(), MDImportPlugin()],
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}






