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

### Using Dictionary (Schema-based)

```typescript
import { Dictionary } from './lib/dictionary';
import { t } from './lib/t';

const config = new Dictionary({
  env: {
    API_KEY: 'secret',
    PORT: 3000,
    DEBUG: true,
  },
  schema: {
    API_KEY: t.string(),
    PORT: t.number(),
    DEBUG: t.boolean(),
  },
});

console.log(config.values.API_KEY); // 'secret'
console.log(config.values.PORT); // 3000
console.log(config.values.DEBUG); // true
```

### Using DictionaryEnv (Descriptor-based)

```typescript
import { DictionaryEnv } from './lib/dictionary';
import { t } from './lib/t';

const env = new DictionaryEnv([
  { API_KEY: 'secret', type: t.string() },
  { PORT: 3000, type: t.number() },
  { DEBUG: true, type: t.boolean() },
]);

console.log(env.env.API_KEY); // 'secret'
console.log(env.env.PORT); // 3000
console.log(env.env.DEBUG); // true
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

A class that validates environment variables against a schema.

#### Constructor

```typescript
new Dictionary<T>(options: DictionaryOptions)
```

**Parameters:**

- `options.env: Record<string, unknown>` - The environment variables to validate
- `options.schema?: Record<string, SchemaType>` - Optional schema for validation

**Properties:**

- `values: T` - The validated and typed environment variables

#### Example

```typescript
const dict = new Dictionary({
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

#### Behavior

- If no schema is provided, all environment variables are included as-is
- If a schema is provided, only keys defined in the schema are included
- Throws an error if a variable fails validation
- Values are automatically typed based on the schema

### DictionaryEnv

A class that creates a typed environment object from an array of descriptors.

#### Constructor

```typescript
new DictionaryEnv<TSchema>(schema: TSchema)
```

**Parameters:**

- `schema: TSchema[]` - Array of descriptors defining environment variables

**Properties:**

- `env: TEnv` - The typed environment object

#### Example

```typescript
const env = new DictionaryEnv([
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

## Usage Patterns

### Environment Variables

Commonly used for validating `.env` files:

```typescript
import { Dictionary } from './lib/dictionary';
import { t } from './lib/t';

const env = new Dictionary({
  env: process.env,
  schema: {
    DATABASE_URL: t.string(),
    PORT: t.number(),
    NODE_ENV: t.string(),
  },
});
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

const typedConfig = new Dictionary({
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
const dbConfig = new Dictionary({
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
import { Dictionary } from './lib/dictionary';
import { t } from './lib/t';

try {
  const dict = new Dictionary({
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

import { DictionaryEnv } from './lib/dictionary';

try {
  const env = new DictionaryEnv([
    { PORT: '3000', type: t.number() }, // Should be a number
  ]);
} catch (error) {
  console.error(error.message);
  // 'ENV value "PORT" is not valid for the provided type'
}
```

## Type Safety

Both classes provide full TypeScript type inference:

```typescript
const env = new DictionaryEnv([
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
