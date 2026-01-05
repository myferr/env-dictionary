import { describe, expect, test } from "bun:test";
import { t } from "../lib/t";
import { Dictionary } from "../lib/dictionary";

describe("Dictionary class", () => {
	test("creates dictionary without schema", () => {
		const dict = new Dictionary({
			env: {
				API_KEY: "secret",
				PORT: "3000",
			},
		});
		expect(dict.values.API_KEY).toBe("secret");
		expect(dict.values.PORT).toBe("3000");
	});

	test("creates dictionary with schema and valid values", () => {
		const dict = new Dictionary({
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
		expect(dict.values.API_KEY).toBe("secret");
		expect(dict.values.PORT).toBe(3000);
		expect(dict.values.DEBUG).toBe(true);
	});

	test("throws error for invalid environment variable", () => {
		expect(() => {
			new Dictionary({
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
		const dict = new Dictionary({
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
		expect(dict.values.API_KEY).toBe("secret");
		expect(dict.values.PORT).toBe(3000);
		expect("EXTRA" in dict.values).toBe(false);
	});

	test("works with object type", () => {
		const config = { url: "https://api.example.com" };
		const dict = new Dictionary({
			env: {
				CONFIG: config,
			},
			schema: {
				CONFIG: t.object(),
			},
		});
		expect(dict.values.CONFIG).toBe(config);
	});

	test("works with array type", () => {
		const list = [1, 2, 3];
		const dict = new Dictionary({
			env: {
				ITEMS: list,
			},
			schema: {
				ITEMS: t.array(),
			},
		});
		expect(dict.values.ITEMS).toBe(list);
	});

	test("works with any type", () => {
		const dict = new Dictionary({
			env: {
				MIXED: "anything",
			},
			schema: {
				MIXED: t.any(),
			},
		});
		expect(dict.values.MIXED).toBe("anything");
	});
});
