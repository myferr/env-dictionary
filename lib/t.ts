/** biome-ignore-all lint/suspicious/noExplicitAny: . */
type SchemaType = "string" | "number" | "boolean" | "object" | "array" | "any";

interface Schema<T, S extends SchemaType> {
	type: S;
	validate: (input: unknown) => input is T;
}

const stringSchema: Schema<string, "string"> = {
	type: "string",
	validate: (input): input is string => typeof input === "string",
};

const numberSchema: Schema<number, "number"> = {
	type: "number",
	validate: (input): input is number => {
		if (typeof input === "number") return true;
		if (typeof input === "string") {
			const parsed = Number(input);
			return !isNaN(parsed) && isFinite(parsed) && input.trim() !== "";
		}
		return false;
	},
};

const booleanSchema: Schema<boolean, "boolean"> = {
	type: "boolean",
	validate: (input): input is boolean => typeof input === "boolean",
};

const objectSchema: Schema<object, "object"> = {
	type: "object",
	validate: (input): input is object =>
		typeof input === "object" && input !== null && !Array.isArray(input),
};

const arraySchema: Schema<any[], "array"> = {
	type: "array",
	validate: (input): input is any[] => Array.isArray(input),
};

const anySchema: Schema<any, "any"> = {
	type: "any",
	validate: (_input): _input is any => true,
};

export const t = {
	string: () => stringSchema,
	number: () => numberSchema,
	boolean: () => booleanSchema,
	object: () => objectSchema,
	array: () => arraySchema,
	any: () => anySchema,
};
