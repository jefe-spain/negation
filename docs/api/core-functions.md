---
title: Core Functions
---

# Core Functions

Negation provides two main validation functions: `negation` for validating single values and `negateObject` for validating objects against a schema. Additionally, Negation provides two async validation functions: `negationAsync` for validating single values against asynchronous constraints and `negateObjectAsync` for validating objects against a schema of asynchronous constraints.

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

## negationAsync

The `negationAsync` function validates a single value against a list of constraints that can include asynchronous constraints.

### Signature

```typescript
async function negationAsync<T>(
  value: T, 
  constraints: readonly MixedConstraint<T>[], 
  options: Readonly<ValidationOptions> = {}
): Promise<T | readonly NegationError[]>;
```

### Parameters

- `value`: The value to validate
- `constraints`: An array of synchronous and/or asynchronous constraints
- `options`: Optional validation options
  - `mode`: Validation mode, either `'throw'` (default) or `'collect'`

### Return Value

- In `'throw'` mode: Returns a Promise that resolves to the validated value if all constraints pass, otherwise rejects with a `NegationError`
- In `'collect'` mode: Returns a Promise that resolves to an empty array if all constraints pass, otherwise resolves to an array of `NegationError` objects

### Example

```typescript
import { negationAsync, notEmpty, notDuplicate } from 'negation';

// Mock database lookup
async function isUsernameTaken(username: string): Promise<boolean> {
  // In a real app, this would check a database
  await new Promise(resolve => setTimeout(resolve, 100));
  return ['admin', 'root', 'system'].includes(username);
}

// Async validation with throw mode
async function validateUsername(username: string) {
  try {
    const validUsername = await negationAsync(username, [
      notEmpty, 
      notDuplicate(isUsernameTaken)
    ]);
    console.log('Username is valid:', validUsername);
  } catch (error) {
    console.error('Username validation failed:', error.message);
  }
}

// Async validation with collect mode
async function validateUsernameCollect(username: string) {
  const errors = await negationAsync(username, [
    notEmpty,
    notDuplicate(isUsernameTaken)
  ], { mode: 'collect' });
  
  if (!Array.isArray(errors)) {
    console.log('Username is valid:', username);
  } else {
    console.log('Username validation failed:');
    errors.forEach(error => console.log(`- ${error.message}`));
  }
}
```

## negateObjectAsync

The `negateObjectAsync` function validates an object against a schema of constraints that can include asynchronous constraints.

### Signature

```typescript
async function negateObjectAsync<T extends Record<string, any>>(
  obj: T,
  schema: Readonly<AsyncSchema<T>>,
  options: Readonly<ValidationOptions> = {}
): Promise<T | readonly NegationError[]>;
```

### Parameters

- `obj`: The object to validate
- `schema`: A schema defining constraints for each property (can include async constraints)
- `options`: Optional validation options
  - `mode`: Validation mode, either `'throw'` (default) or `'collect'`

### Return Value

- In `'throw'` mode: Returns a Promise that resolves to the validated object if all constraints pass, otherwise rejects with a `NegationError`
- In `'collect'` mode: Returns a Promise that resolves to an empty array if all constraints pass, otherwise resolves to an array of `NegationError` objects

### Example

```typescript
import { negateObjectAsync, notEmpty, notNegative, notDuplicate } from 'negation';

// Mock database lookup functions
async function isUsernameTaken(username: string): Promise<boolean> {
  // In a real app, this would check a database
  await new Promise(resolve => setTimeout(resolve, 100));
  return ['admin', 'root', 'system'].includes(username);
}

async function isEmailTaken(email: string): Promise<boolean> {
  // In a real app, this would check a database
  await new Promise(resolve => setTimeout(resolve, 100));
  return ['admin@example.com', 'root@example.com'].includes(email);
}

// Define a user type
type User = {
  username: string;
  email: string;
  age: number;
};

// Create a user object
const user = {
  username: 'newuser',
  email: 'new@example.com',
  age: 25
};

// Async validation with throw mode
async function validateUser(user: User) {
  try {
    const validatedUser = await negateObjectAsync(user, {
      username: [notEmpty, notDuplicate(isUsernameTaken)],
      email: [notEmpty, notDuplicate(isEmailTaken)],
      age: [notNegative]
    });
    console.log('User is valid:', validatedUser);
  } catch (error) {
    console.error('User validation failed:', error.message);
  }
}

// Async validation with collect mode
async function validateUserCollect(user: User) {
  const result = await negateObjectAsync(user, {
    username: [notEmpty, notDuplicate(isUsernameTaken)],
    email: [notEmpty, notDuplicate(isEmailTaken)],
    age: [notNegative]
  }, { mode: 'collect' });
  
  if (!Array.isArray(result)) {
    console.log('User is valid:', result);
  } else {
    console.log('User validation failed:');
    result.forEach(error => {
      console.log(`- ${error.path.join('.')}: ${error.message}`);
    });
  }
}
