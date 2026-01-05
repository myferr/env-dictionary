/** biome-ignore-all lint/suspicious/noExplicitAny: . */
import type {
	DictionaryEnvDescriptor,
	DictionaryOptions,
	SchemaType,
} from "./types";

export class Dictionary<
	TSchema extends DictionaryEnvDescriptor<string, any>[],
> {
	public readonly env: {
		[K in TSchema[number] as K extends { type: SchemaType }
			? keyof K & string
			: never]: K extends { type: infer S }
			? S extends { validate: (input: unknown) => input is infer U }
				? U
				: never
			: never;
	};

	constructor(schema: TSchema) {
		const result: any = {};
		for (const desc of schema) {
			const key = Object.keys(desc).find((k) => k !== "type");
			if (!key) throw new Error("Descriptor must have a variable name");
			const val = (desc as any)[key];
			const type = (desc as any).type;
			if (!type || typeof type.validate !== "function")
				throw new Error("Descriptor must have a type");
			if (!type.validate(val)) {
				throw new Error(
					`ENV value "${key}" is not valid for the provided type`,
				);
			}
			result[key] = val;
		}
		this.env = result;
	}
}

export class DictionaryEnv<
	T extends Record<string, any> = Record<string, any>,
> {
	public readonly env: T;
	public readonly type: {
		[K in keyof T]: T[K] extends string
			? typeof String
			: T[K] extends number
				? typeof Number
				: T[K] extends boolean
					? typeof Boolean
					: T[K] extends object
						? typeof Object
						: typeof Array;
	};
	constructor(
		options: DictionaryOptions,
		descriptorOptions?: { schema: Array<{ var: string; type: SchemaType }> },
	) {
		const { env, schema } = options;

		const typeMap: any = {
			string: String,
			number: Number,
			boolean: Boolean,
			object: Object,
			array: Array,
			any: Object,
		};

		let typedEnv: any = {};
		let resultTypeMap: any = {};

		if (descriptorOptions?.schema) {
			const { schema: descriptors } = descriptorOptions;
			for (const desc of descriptors) {
				const key = desc.var;
				const s = desc.type;
				const value = env[key];
				if (s?.validate(value)) {
					// Convert string numbers to actual numbers
					if (s.type === "number" && typeof value === "string") {
						typedEnv[key] = Number(value);
					} else {
						typedEnv[key] = value;
					}
					resultTypeMap[key] = typeMap[s.type];
				} else if (s) {
					throw new Error(`Invalid environment variable "${key}".`);
				}
			}
		} else if (schema) {
			for (const key in schema) {
				const s = schema[key];
				const value = env[key];
				if (s?.validate(value)) {
					// Convert string numbers to actual numbers
					if (s.type === "number" && typeof value === "string") {
						typedEnv[key] = Number(value);
					} else {
						typedEnv[key] = value;
					}
					resultTypeMap[key] = typeMap[s.type];
				} else if (s) {
					throw new Error(`Invalid environment variable "${key}".`);
				}
			}
		} else {
			typedEnv = env;
			for (const key in env) {
				const value = env[key];
				if (typeof value === "string") resultTypeMap[key] = String;
				else if (typeof value === "number") resultTypeMap[key] = Number;
				else if (typeof value === "boolean") resultTypeMap[key] = Boolean;
				else if (Array.isArray(value)) resultTypeMap[key] = Array;
				else if (typeof value === "object" && value !== null)
					resultTypeMap[key] = Object;
				else resultTypeMap[key] = typeof value;
			}
		}

		this.env = typedEnv;
		this.type = resultTypeMap;
	}
}
