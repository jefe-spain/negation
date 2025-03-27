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
Negation is currently in development (v0.0.2). The package will be published to npm soon.
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

## Asynchronous Validation

Negation supports asynchronous validation for operations requiring database lookups, API calls, or other async processes:

```typescript
import { negationAsync, negateObjectAsync, notEmpty, notDuplicate } from 'negation';

// Function that simulates checking if a username exists in a database
async function isUsernameTaken(username: string): Promise<boolean> {
  // In a real app, this would query a database
  await new Promise(resolve => setTimeout(resolve, 100));
  return ['admin', 'root', 'system'].includes(username);
}

// Validate a username asynchronously
async function validateUsername(username: string) {
  try {
    const validatedUsername = await negationAsync(username, [
      notEmpty,
      notDuplicate(isUsernameTaken)
    ]);
    console.log('Username is valid:', validatedUsername);
  } catch (error) {
    console.error('Username validation failed:', error.message);
  }
}

// Validating an entire user object with async constraints
async function validateUser(user) {
  try {
    const validatedUser = await negateObjectAsync(user, {
      username: [notEmpty, notDuplicate(isUsernameTaken)],
      email: [notEmpty],
      age: [notNegative]
    });
    console.log('User is valid:', validatedUser);
  } catch (error) {
    console.error('User validation failed:', error.message);
  }
}

// You can also collect all errors in async validation
async function validateUserCollect(user) {
  const result = await negateObjectAsync(user, {
    username: [notEmpty, notDuplicate(isUsernameTaken)],
    email: [notEmpty],
    age: [notNegative]
  }, { mode: 'collect' });
  
  if (!Array.isArray(result)) {
    console.log('User is valid:', result);
  } else {
    console.log('Validation failed with the following errors:');
    result.forEach(error => {
      console.log(`- ${error.path.join('.')}: ${error.message}`);
    });
  }
}
```

## Next Steps

Now that you understand the basics, check out:

- [Core Concepts](/guide/core-concepts) to learn more about Negation's philosophy
- [API Reference](/api/) for detailed documentation of all functions and constraints
- [Examples](/examples/) for real-world usage examples
