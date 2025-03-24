---
title: Getting Started
---

# Getting Started with Negation

This guide will help you get started with Negation in your project.

## Installation

Negation is available as an npm package. You can install it using npm or yarn:

```bash
npm install negation
# or
yarn add negation
```

:::note
Negation is currently in development (v0.0.1). The package will be published to npm soon.
:::

## Basic Usage

Here's a simple example of how to use Negation for validating a string:

```typescript
import { negation, notNull, notEmpty } from 'negation';

// Validate a string is not null and not empty
try {
  const validatedString = negation('hello', [notNull, notEmpty]);
  console.log('Validation passed:', validatedString);
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

## Validating Objects

Negation can also validate objects against a schema:

```typescript
import { negateObject, notNull, notEmpty, notNegative } from 'negation';

// Define a user type
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

// Create a user object
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  age: 30
};

// Validate against a schema
try {
  const validatedUser = negateObject(user, {
    id: [notNull, notNegative],
    name: [notNull, notEmpty],
    email: [notNull, notEmpty],
    age: [notNull, notNegative]
  });
  console.log('Validation passed:', validatedUser);
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

## Collecting All Errors

By default, Negation throws an error on the first validation failure. If you want to collect all errors instead, you can use the `collect` mode:

```typescript
import { negateObject, notNull, notEmpty, notNegative } from 'negation';

const user = {
  id: -1, // Invalid: negative
  name: '', // Invalid: empty
  email: null, // Invalid: null
  age: 30
};

// Collect all validation errors
const errors = negateObject(user, {
  id: [notNull, notNegative],
  name: [notNull, notEmpty],
  email: [notNull, notEmpty],
  age: [notNull, notNegative]
}, { mode: 'collect' });

if (errors.length > 0) {
  console.log('Validation failed with the following errors:');
  errors.forEach(error => {
    console.log(`- ${error.path.join('.')}: ${error.message}`);
  });
}
```

## Next Steps

Now that you understand the basics, check out:

- [Core Concepts](/guide/core-concepts) to learn more about Negation's philosophy
- [API Reference](/api/) for detailed documentation of all functions and constraints
- [Examples](/examples/) for real-world usage examples
