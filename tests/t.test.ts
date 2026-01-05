import { describe, expect, test } from "bun:test";
import { t } from "env-dictionary";

describe("t validators", () => {
	test("string validator", () => {
		const schema = t.string();
		expect(schema.type).toBe("string");
		expect(schema.validate("hello")).toBe(true);
		expect(schema.validate(123)).toBe(false);
		expect(schema.validate(null)).toBe(false);
		expect(schema.validate(undefined)).toBe(false);
	});

	test("number validator", () => {
		const schema = t.number();
		expect(schema.type).toBe("number");
		expect(schema.validate(123)).toBe(true);
		expect(schema.validate(0)).toBe(true);
		expect(schema.validate(-123)).toBe(true);
		expect(schema.validate("123")).toBe(false);
		expect(schema.validate(null)).toBe(false);
	});

	test("boolean validator", () => {
		const schema = t.boolean();
		expect(schema.type).toBe("boolean");
		expect(schema.validate(true)).toBe(true);
		expect(schema.validate(false)).toBe(true);
		expect(schema.validate(1)).toBe(false);
		expect(schema.validate("true")).toBe(false);
	});

	test("object validator", () => {
		const schema = t.object();
		expect(schema.type).toBe("object");
		expect(schema.validate({})).toBe(true);
		expect(schema.validate({ a: 1 })).toBe(true);
		expect(schema.validate([])).toBe(false);
		expect(schema.validate(null)).toBe(false);
		expect(schema.validate("string")).toBe(false);
	});

	test("array validator", () => {
		const schema = t.array();
		expect(schema.type).toBe("array");
		expect(schema.validate([])).toBe(true);
		expect(schema.validate([1, 2, 3])).toBe(true);
		expect(schema.validate({})).toBe(false);
		expect(schema.validate("string")).toBe(false);
	});

	test("any validator", () => {
		const schema = t.any();
		expect(schema.type).toBe("any");
		expect(schema.validate(null)).toBe(true);
		expect(schema.validate(undefined)).toBe(true);
		expect(schema.validate(123)).toBe(true);
		expect(schema.validate("string")).toBe(true);
		expect(schema.validate({})).toBe(true);
		expect(schema.validate([])).toBe(true);
	});
});
