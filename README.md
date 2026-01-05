# env-dictionary

A TypeScript library for type-safe environment variable handling with runtime validation.

## Features

- **Type Safety**: Full TypeScript support with inferred types
- **Runtime Validation**: Validate environment variables against defined schemas
- **Multiple Type Support**: Built-in validators for string, number, boolean, object, array, and any types
- **Flexible API**: Choose between schema-based or descriptor-based approaches
- **Zero Dependencies**: Lightweight with no external runtime dependencies
- **Bun Optimized**: Built with Bun in mind, works with any TypeScript project

## Installation

Install the package:

```bash
bun install
```

## Quick Start

### Using Dictionary (Create a typed env)

```typescript
import { Dictionary } from 'env-dictionary';
import { t } from 'env-dictionary';

const env = new Dictionary([
  { API_KEY: 'secret', type: t.string() },
  { PORT: 3000, type: t.number() },
  { DEBUG: true, type: t.boolean() },
]);

console.log(env.env.API_KEY); // 'secret'
console.log(env.env.PORT); // 3000
console.log(env.env.DEBUG); // true
```

### Using DictionaryEnv (Type pre-existing envs)

```typescript
import { DictionaryEnv } from 'env-dictionary';

const typedEnv = new DictionaryEnv({ env: process.env })

console.log(typedEnv.env.PORT) // 8080
console.log(typedEnv.type.PORT) // Number
```

You can also provide a descriptor-based schema:

```typescript
import { DictionaryEnv } from 'env-dictionary';
import { t } from 'env-dictionary';

const typedEnv = new DictionaryEnv(
  { env: process.env },
  { schema: [
    { var: 'PORT', type: t.number() },
    { var: 'API_KEY', type: t.string() },
  ]}
)

console.log(typedEnv.env.PORT) // 8080
console.log(typedEnv.type.PORT) // Number
```

## API Reference

### t

The `t` object provides type validators for schema definitions.

#### Available Types

| Type | Validator | Example |
|------|-----------|---------|
| `string` | `t.string()` | `'hello'` |
| `number` | `t.number()` | `42` |
| `boolean` | `t.boolean()` | `true` |
| `object` | `t.object()` | `{ key: 'value' }` |
| `array` | `t.array()` | `[1, 2, 3]` |
| `any` | `t.any()` | Any value |

### Dictionary

A class that creates a typed environment object from an array of descriptors.

#### Constructor

```typescript
new Dictionary<TSchema>(schema: TSchema)
```

**Parameters:**

- `schema: TSchema[]` - Array of descriptors defining environment variables

**Properties:**

- `env: TEnv` - The typed environment object

#### Example

```typescript
const env = new Dictionary([
  { API_KEY: 'secret', type: t.string() },
  { PORT: 3000, type: t.number() },
  { DEBUG: true, type: t.boolean() },
  { CONFIG: { url: 'https://api.example.com' }, type: t.object() },
  { ITEMS: [1, 2, 3], type: t.array() },
]);
```

#### Descriptor Format

Each descriptor must have:
- A variable name (key)
- A value
- A `type` property with the validator

#### Behavior

- Throws an error if a descriptor is missing a variable name
- Throws an error if a descriptor is missing a type
- Throws an error if a value fails validation for its type
- Types are automatically inferred from the descriptors

### DictionaryEnv

A class that validates environment variables against a schema.

#### Constructor

```typescript
new DictionaryEnv<T>(options: DictionaryOptions, descriptorOptions?: { schema: Array<{ var: string; type: SchemaType }> })
```

**Parameters:**

- `options.env: Record<string, unknown>` - The environment variables to validate
- `options.schema?: Record<string, SchemaType>` - Optional schema for validation (key-based)
- `descriptorOptions?: { schema: Array<{ var: string; type: SchemaType }> }` - Optional descriptor-based schema

**Properties:**

- `env: T` - The validated and typed environment variables
- `type: { [K in keyof T]: TypeConstructor }` - Type constructors for each variable

#### Examples

**Key-based schema:**

```typescript
const typedEnv = new DictionaryEnv({
  env: {
    API_KEY: 'secret',
    PORT: 3000,
    DEBUG: true,
    CONFIG: { url: 'https://api.example.com' },
    ITEMS: [1, 2, 3],
  },
  schema: {
    API_KEY: t.string(),
    PORT: t.number(),
    DEBUG: t.boolean(),
    CONFIG: t.object(),
    ITEMS: t.array(),
  },
});
```

**Descriptor-based schema:**

```typescript
const typedEnv = new DictionaryEnv(
  { env: process.env },
  { schema: [
    { var: 'PORT', type: t.number() },
    { var: 'API_KEY', type: t.string() },
  ]}
);
```

#### Behavior

- If no schema is provided, all environment variables are included as-is with inferred types
- If a schema is provided (key-based or descriptor-based), only keys defined in the schema are included
- Throws an error if a variable fails validation
- Values are automatically typed based on the schema

## Usage Patterns

### Environment Variables

Use `Dictionary` to create a new typed environment:

```typescript
import { Dictionary } from 'env-dictionary';
import { t } from 'env-dictionary';

const env = new Dictionary([
  { DATABASE_URL: 'postgresql://localhost', type: t.string() },
  { PORT: 5432, type: t.number() },
  { NODE_ENV: 'development', type: t.string() },
]);
```

Use `DictionaryEnv` to type a pre-existing environment (key-based schema):

```typescript
import { DictionaryEnv } from 'env-dictionary';
import { t } from 'env-dictionary';

const typedEnv = new DictionaryEnv({
  env: process.env,
  schema: {
    DATABASE_URL: t.string(),
    PORT: t.number(),
    NODE_ENV: t.string(),
  },
});
```

Use `DictionaryEnv` with descriptor-based schema:

```typescript
import { DictionaryEnv } from 'env-dictionary';
import { t } from 'env-dictionary';

const typedEnv = new DictionaryEnv(
  { env: process.env },
  { schema: [
    { var: 'DATABASE_URL', type: t.string() },
    { var: 'PORT', type: t.number() },
    { var: 'NODE_ENV', type: t.string() },
  ]}
);
```

### Configuration Object

Can be used with any configuration object:

```typescript
const config = {
  server: {
    host: 'localhost',
    port: 8080,
  },
  features: {
    auth: true,
    logging: false,
  },
};

const typedConfig = new DictionaryEnv({
  env: config,
  schema: {
    server: t.object(),
    features: t.object(),
  },
});
```

### Nested Configuration

For complex nested objects, use the `object` type:

```typescript
const dbConfig = new DictionaryEnv({
  env: {
    database: {
      host: 'localhost',
      port: 5432,
      ssl: true,
    },
  },
  schema: {
    database: t.object(),
  },
});
```

## Error Handling

Both `Dictionary` and `DictionaryEnv` throw errors when validation fails:

```typescript
import { Dictionary } from 'env-dictionary';
import { t } from 'env-dictionary';

try {
  const env = new Dictionary([
    { PORT: '3000', type: t.number() }, // Should be a number
  ]);
} catch (error) {
  console.error(error.message);
  // 'ENV value "PORT" is not valid for the provided type'
}

import { DictionaryEnv } from 'env-dictionary';
import { t } from 'env-dictionary';

try {
  const typedEnv = new DictionaryEnv({
    env: {
      PORT: '3000', // Should be a number
    },
    schema: {
      PORT: t.number(),
    },
  });
} catch (error) {
  console.error(error.message);
  // 'Invalid environment variable "PORT".'
}
```

## Type Safety

Both classes provide full TypeScript type inference:

```typescript
import { Dictionary } from 'env-dictionary';
import { t } from 'env-dictionary';

const env = new Dictionary([
  { API_KEY: 'secret', type: t.string() },
  { PORT: 3000, type: t.number() },
  { DEBUG: true, type: t.boolean() },
]);

// TypeScript knows these types:
env.env.API_KEY; // string
env.env.PORT; // number
env.env.DEBUG; // boolean
env.env.UNKNOWN; // TypeScript error
```

## Development

### Install Dependencies

```bash
bun install
```

### Build

```bash
bun run build
```

### Run Tests

```bash
bun test
```

## License

MIT

## Contributing

Contributions are welcome! Please ensure all tests pass before submitting a pull request.
