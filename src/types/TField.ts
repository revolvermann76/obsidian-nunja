export type TField = {
	title: string;
	type: "text" | "area" | "choice" | "boolean";
	preset: unknown;
	key: string;
};

type TRangeEntry = string;

type TRange = TRangeEntry[];

export type TTextField = TField & {
	type: "text";
	preset?: string;
	default?: string;
	items?: TRange;
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
	items: TRange;
};

export type TBooleanField = TField & {
	type: "boolean";
	preset?: boolean;
};
