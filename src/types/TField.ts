export type TField = {
	title: string;
	type: "text" | "area" | "choice" | "boolean";
	preset: unknown;
	key: string;
};



export type TTextField = TField & {
	type: "text";
	preset?: string;
	default?: string;
	items?: { [key: string]: string };
};

export type TAreaField = TField & {
	type: "area";
	preset?: string;
	default?: string;
	cols?: number;
	rows?: number;
};

export type TChoiceField = TField & {
	type: "choice";
	preset?: string;
	items: { [key: string]: string };
};

export type TBooleanField = TField & {
	type: "boolean";
	preset?: boolean;
};
