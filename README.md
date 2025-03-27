# Negation 🚫

A lightweight TypeScript validation library using negative space programming, where validation rules define what data should *not* be.

## Core Concepts

Negation takes a different approach to validation by focusing on what data should *not* be rather than what it should be. This "negative space" programming creates more intuitive validation rules:

- **Direct Constraints**: Basic constraints like `notNull` and `notEmpty` can be used directly without function calls
- **Composable Rules**: Easily combine multiple constraints
- **Negative Logic**: Define boundaries by exclusion - what values must not do or be
- **Path Tracking**: Errors include paths to invalid fields for clear debugging
- **Collection Mode**: Choose between throwing on first error or collecting all errors

This approach often leads to more readable code and better matches how we think about validation rules in natural language. Unlike positive validation approaches that can lead to false positives by only checking what's expected, negative validation helps catch edge cases by explicitly defining what must not occur. For example, validating "input must be a string" might pass for an empty string, while "input must not be empty" clearly prevents this issue.

## Installation _0.0.1 Coming soon_

```bash
🔜 Coming soon 🔜
```

## Usage

### Validating Single Values

```typescript
import { negation, notNull, notEmpty, notNegative } from 'negation';

// Validate a string is not null and not empty
const validatedString = negation('hello', [notNull, notEmpty]);

// Validate a number is not negative
const validatedNumber = negation(42, [notNull, notNegative]);

// Collect errors instead of throwing
const errors = negation('', [notNull, notEmpty], { mode: 'collect' });
if (errors.length > 0) {
  console.log('Validation failed:', errors);
}
```

### Validating Objects

```typescript
import { negateObject, notNull, notEmpty, notNegative } from 'negation';

// Define a user type
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

// Create a validation schema for User
const user = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  age: 30
};

// Validate against a schema
const validatedUser = negateObject(user, {
  id: [notNull, notNegative],
  name: [notNull, notEmpty],
  email: [notNull, notEmpty],
  age: [notNull, notNegative]
});

// Collect all validation errors
const errors = negateObject(user, {
  id: [notNull, notNegative],
  name: [notNull, notEmpty],
  email: [notNull, notEmpty],
  age: [notNull, notNegative]
}, { mode: 'collect' });
```

### Asynchronous Validation

Negation supports asynchronous validation for operations requiring database lookups, API calls, or other async processes:

```typescript
import { negationAsync, negateObjectAsync, notEmpty, notDuplicate } from 'negation';

// Mock database lookup function
async function isUsernameTaken(username: string): Promise<boolean> {
  // In a real app, this would query a database or API
  await new Promise(resolve => setTimeout(resolve, 100));
  return ['admin', 'root', 'system'].includes(username);
}

// Validate a single value with async constraint
async function validateUsername(username: string) {
  try {
    // Checks both sync and async constraints
    await negationAsync(username, [
      notEmpty,
      notDuplicate(isUsernameTaken)
    ]);
    console.log('Username is valid!');
  } catch (error) {
    console.error('Invalid username:', error.message);
  }
}

// Validate an object with mixed constraints
async function validateUser(user: User) {
  const userSchema = {
    username: [notEmpty, notDuplicate(isUsernameTaken)],
    age: [notNegative]
  };
  
  // Collect all errors
  const result = await negateObjectAsync(user, userSchema, { mode: 'collect' });
  
  // Check if validation succeeded (result is not an array of errors)
  if (!Array.isArray(result)) {
    console.log('User is valid:', result);
    return result;
  } else {
    console.error('Validation errors:', result.map(e => e.message).join(', '));
    return result;
  }
}
```

## API

### Core Functions

- `negation<T>(value: T, constraints: Constraint<T>[], options?: { mode: 'throw' | 'collect' })`
- `negateObject<T>(obj: T, schema: Schema<T>, options?: { mode: 'throw' | 'collect' })`
- `negationAsync<T>(value: T, constraints: MixedConstraint<T>[], options?)`
- `negateObjectAsync<T>(obj: T, schema: AsyncSchema<T>, options?)`

### Built-in Constraints

#### Basic Constraints (Direct usage)
- `notNull`: Ensures value is not null or undefined
- `notEmpty`: Ensures string is not empty
- `notNegative`: Ensures number is not negative

#### Parameterized Constraints (Function calls)
- `notLongerThan(maxLength)`: Ensures string doesn't exceed maximum length
- `notShorterThan(minLength)`: Ensures string isn't shorter than minimum length
- `notGreaterThan(max)`: Ensures number doesn't exceed maximum value
- `notLessThan(min)`: Ensures number isn't less than minimum value

#### Asynchronous Constraints
- `notDuplicate(checkFn)`: Ensures value isn't a duplicate using async function

### Types

- `Constraint<T>`: Synchronous validation constraint
- `AsyncConstraint<T>`: Asynchronous validation constraint
- `MixedConstraint<T>`: Either sync or async constraint
- `Schema<T>`: Object schema with sync constraints
- `AsyncSchema<T>`: Object schema with mixed sync/async constraints

### Errors

The library uses the `NegationError` class for validation errors, which includes:

- `path`: The path to the invalid value (empty array for single values)
- `message`: Human-readable error message
- `constraint`: The constraint that failed

## Creator

Created by Jesus Fernandez.

## Getting Help

If you need help or have questions about using Negation, please open an issue on GitHub.

## Contribute

Contributions are welcome! Here's how you can contribute:
- Fork the repository
- Create a feature branch
- Submit a pull request
- Report bugs or suggest features via GitHub issues

## License

MIT 