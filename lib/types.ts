import type { t } from "./t";

type SchemaType = ReturnType<
	| typeof t.string
	| typeof t.number
	| typeof t.boolean
	| typeof t.object
	| typeof t.array
	| typeof t.any
>;

type DictionaryOptions = {
	env: Record<string, unknown>;
	schema?: Record<string, SchemaType>;
};

type DictionaryEnvDescriptor<T extends string, V> = { [K in T]: V } & {
	type: SchemaType;
};

export type { SchemaType, DictionaryOptions, DictionaryEnvDescriptor };
