---
title: Core Functions
---

# Core Functions

Negation provides two main validation functions: `negation` for validating single values and `negateObject` for validating objects against a schema.

## negation

The `negation` function validates a single value against a list of constraints.

### Signature

```typescript
function negation<T>(
  value: T, 
  constraints: readonly Constraint<T>[], 
  options: Readonly<ValidationOptions> = {}
): T | readonly NegationError[];
```

### Parameters

- `value`: The value to validate
- `constraints`: An array of constraints to validate against
- `options`: Optional validation options
  - `mode`: Validation mode, either `'throw'` (default) or `'collect'`

### Return Value

- In `'throw'` mode: Returns the validated value if all constraints pass, otherwise throws a `NegationError`
- In `'collect'` mode: Returns an empty array if all constraints pass, otherwise returns an array of `NegationError` objects

### Example

```typescript
import { negation, notNull, notEmpty } from 'negation';

// Throw mode (default)
try {
  const validatedString = negation('hello', [notNull, notEmpty]);
  console.log('Validation passed:', validatedString);
} catch (error) {
  console.error('Validation failed:', error.message);
}

// Collect mode
const errors = negation('', [notNull, notEmpty], { mode: 'collect' });
if (errors.length > 0) {
  console.log('Validation failed with the following errors:');
  errors.forEach(error => {
    console.log(`- ${error.message}`);
  });
}
```

## negateObject

The `negateObject` function validates an object against a schema of constraints.

### Signature

```typescript
function negateObject<T extends Record<string, any>>(
  obj: T,
  schema: Readonly<Schema<T>>,
  options: Readonly<ValidationOptions> = {}
): T | readonly NegationError[];
```

### Parameters

- `obj`: The object to validate
- `schema`: A schema defining constraints for each property
- `options`: Optional validation options
  - `mode`: Validation mode, either `'throw'` (default) or `'collect'`

### Return Value

- In `'throw'` mode: Returns the validated object if all constraints pass, otherwise throws a `NegationError`
- In `'collect'` mode: Returns an empty array if all constraints pass, otherwise returns an array of `NegationError` objects

### Example

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

// Throw mode (default)
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

// Collect mode
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
