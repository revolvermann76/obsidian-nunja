// https://regex101.com/

// to find a "yaml handily" block
export const regExYamlTemplate =
	/```[\s^\n]*yaml[\s^\n]*nunja-template[\s^\n]*\n([\s\S]*?)\n```\n/mg;

// to find a "javascript handily" block
export const regExJavascriptTemplate =
	/```[\s^\n]*javascript[\s^\n]*handily[\s^\n]*\n([\s\S]*?)\n```\n/m;

// to find the first H1 in a document
export const regExH1 = /^# ([\s\S]*?)\n/m;