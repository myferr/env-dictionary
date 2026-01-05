import { describe, expect, test } from "bun:test";
import { t } from "env-dictionary";
import { DictionaryEnv } from "env-dictionary";

describe("DictionaryEnv class", () => {
	test("creates dictionary without schema", () => {
		const dict = new DictionaryEnv({
			env: {
				API_KEY: "secret",
				PORT: "3000",
			},
		});
		expect(dict.env.API_KEY).toBe("secret");
		expect(dict.env.PORT).toBe("3000");
	});

	test("creates dictionary with schema and valid values", () => {
		const dict = new DictionaryEnv({
			env: {
				API_KEY: "secret",
				PORT: 3000,
				DEBUG: true,
			},
			schema: {
				API_KEY: t.string(),
				PORT: t.number(),
				DEBUG: t.boolean(),
			},
		});
		expect(dict.env.API_KEY).toBe("secret");
		expect(dict.env.PORT).toBe(3000);
		expect(dict.env.DEBUG).toBe(true);
	});

	test("throws error for invalid environment variable", () => {
		expect(() => {
			new DictionaryEnv({
				env: {
					PORT: "3000",
				},
				schema: {
					PORT: t.number(),
				},
			});
		}).toThrow('Invalid environment variable "PORT".');
	});

	test("only includes keys defined in schema", () => {
		const dict = new DictionaryEnv({
			env: {
				API_KEY: "secret",
				PORT: 3000,
				EXTRA: "ignored",
			},
			schema: {
				API_KEY: t.string(),
				PORT: t.number(),
			},
		});
		expect(dict.env.API_KEY).toBe("secret");
		expect(dict.env.PORT).toBe(3000);
		expect("EXTRA" in dict.env).toBe(false);
	});

	test("works with object type", () => {
		const config = { url: "https://api.example.com" };
		const dict = new DictionaryEnv({
			env: {
				CONFIG: config,
			},
			schema: {
				CONFIG: t.object(),
			},
		});
		expect(dict.env.CONFIG).toBe(config);
	});

	test("works with array type", () => {
		const list = [1, 2, 3];
		const dict = new DictionaryEnv({
			env: {
				ITEMS: list,
			},
			schema: {
				ITEMS: t.array(),
			},
		});
		expect(dict.env.ITEMS).toBe(list);
	});

	test("works with any type", () => {
		const dict = new DictionaryEnv({
			env: {
				MIXED: "anything",
			},
			schema: {
				MIXED: t.any(),
			},
		});
		expect(dict.env.MIXED).toBe("anything");
	});

	test("provides type property", () => {
		const dict = new DictionaryEnv({
			env: {
				API_KEY: "secret",
				PORT: 3000,
				DEBUG: true,
			},
			schema: {
				API_KEY: t.string(),
				PORT: t.number(),
				DEBUG: t.boolean(),
			},
		});
		expect(dict.type.API_KEY).toBe(String);
		expect(dict.type.PORT).toBe(Number);
		expect(dict.type.DEBUG).toBe(Boolean);
	});

	test("accepts descriptor-based schema", () => {
		const dict = new DictionaryEnv(
			{
				env: {
					API_KEY: "secret",
					PORT: 3000,
					DEBUG: true,
				},
			},
			{
				schema: [
					{ var: "API_KEY", type: t.string() },
					{ var: "PORT", type: t.number() },
					{ var: "DEBUG", type: t.boolean() },
				],
			},
		);
		expect(dict.env.API_KEY).toBe("secret");
		expect(dict.env.PORT).toBe(3000);
		expect(dict.env.DEBUG).toBe(true);
		expect(dict.type.API_KEY).toBe(String);
		expect(dict.type.PORT).toBe(Number);
		expect(dict.type.DEBUG).toBe(Boolean);
	});

	test("throws error with descriptor-based schema for invalid value", () => {
		expect(() => {
			new DictionaryEnv(
				{
					env: {
						PORT: "3000",
					},
				},
				{
					schema: [{ var: "PORT", type: t.number() }],
				},
			);
		}).toThrow('Invalid environment variable "PORT".');
	});
});
