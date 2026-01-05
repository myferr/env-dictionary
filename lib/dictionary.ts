/** biome-ignore-all lint/suspicious/noExplicitAny: . */
import type { DictionaryEnvDescriptor, DictionaryOptions, SchemaType } from "./types";

export class Dictionary<T extends Record<string, any> = Record<string, any>> {
	public readonly values: T;
	constructor(options: DictionaryOptions) {
		const { env, schema } = options;

		let typedEnv: any = {};
		if (schema) {
			for (const key in schema) {
				const s = schema[key];
				const value = env[key];
				if (s?.validate(value)) {
					typedEnv[key] = value;
				} else if (s) {
					throw new Error(`Invalid environment variable "${key}".`);
				}
			}
		} else {
			typedEnv = env;
		}

		this.values = typedEnv;
	}
}

export class DictionaryEnv<
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
