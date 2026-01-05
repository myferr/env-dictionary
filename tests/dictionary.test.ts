import { describe, expect, test } from "bun:test";
import { t } from "env-dictionary";
import { Dictionary } from "env-dictionary";

describe("Dictionary class", () => {
	test("creates typed environment with valid values", () => {
		const env = new Dictionary([
			{ API_KEY: "secret", type: t.string() },
			{ PORT: 3000, type: t.number() },
			{ DEBUG: true, type: t.boolean() },
		]);

		expect(env.env.API_KEY).toBe("secret");
		expect(env.env.PORT).toBe(3000);
		expect(env.env.DEBUG).toBe(true);
	});

	test("throws error for descriptor without variable name", () => {
		expect(() => {
			new Dictionary([{ type: t.string() }]);
		}).toThrow("Descriptor must have a variable name");
	});

	test("throws error for descriptor without type", () => {
		expect(() => {
			new Dictionary([{ API_KEY: "secret" }] as any[]);
		}).toThrow("Descriptor must have a type");
	});

	test("throws error for invalid ENV value", () => {
		expect(() => {
			new Dictionary([{ PORT: "3000", type: t.number() }]);
		}).toThrow('ENV value "PORT" is not valid for the provided type');
	});

	test("works with object type", () => {
		const config = { url: "https://api.example.com" };
		const env = new Dictionary([{ CONFIG: config, type: t.object() }]);

		expect(env.env.CONFIG).toBe(config);
	});

	test("works with array type", () => {
		const list = [1, 2, 3];
		const env = new Dictionary([{ ITEMS: list, type: t.array() }]);

		expect(env.env.ITEMS).toBe(list);
	});

	test("works with any type", () => {
		const env = new Dictionary([{ MIXED: "anything", type: t.any() }]);

		expect(env.env.MIXED).toBe("anything");
	});

	test("handles multiple descriptors correctly", () => {
		const env = new Dictionary([
			{ HOST: "localhost", type: t.string() },
			{ PORT: 8080, type: t.number() },
			{ ENABLED: false, type: t.boolean() },
			{ OPTIONS: { a: 1 }, type: t.object() },
			{ TAGS: ["tag1", "tag2"], type: t.array() },
		]);

		expect(env.env.HOST).toBe("localhost");
		expect(env.env.PORT).toBe(8080);
		expect(env.env.ENABLED).toBe(false);
		expect(env.env.OPTIONS).toEqual({ a: 1 });
		expect(env.env.TAGS).toEqual(["tag1", "tag2"]);
	});

	test("type inference works correctly", () => {
		const env = new Dictionary([
			{ NAME: "test", type: t.string() },
			{ COUNT: 42, type: t.number() },
		]);

		expect(env.env.NAME).toBe("test");
		expect(env.env.COUNT).toBe(42);
	});
});
