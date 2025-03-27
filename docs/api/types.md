---
title: Types
---

# Types

Negation provides TypeScript type definitions for all its functions and constraints. This page documents the main types used in the library.

## ValidationMode

Defines the validation mode:

```typescript
export type ValidationMode = 'throw' | 'collect';
```

- `'throw'`: Throws a `NegationError` on the first validation failure (default)
- `'collect'`: Collects all validation errors and returns them as an array

## ValidationOptions

Options for validation functions:

```typescript
export interface ValidationOptions {
  mode?: ValidationMode;
}
```

## NegationError

Error class for validation errors:

```typescript
export class NegationError extends Error {
  constructor(
    public readonly path: readonly string[],
    message: string,
    public readonly constraint: string
  ) {
    super(message);
    this.name = 'NegationError';
  }
}
```

Properties:
- `path`: The path to the invalid value (empty array for single values)
- `message`: Human-readable error message
- `constraint`: The constraint that failed

## Constraint

Type definition for constraints:

```typescript
export type Constraint<T> = ((value: T, path: readonly string[]) => void) | {
  validate: (value: T, path: readonly string[]) => void;
  constraint: string;
};
```

A constraint can be either:
- A function that takes a value and a path and throws a `NegationError` if the value is invalid
- An object with a `validate` method and a `constraint` string

## AsyncConstraint

Type definition for asynchronous constraints:

```typescript
export type AsyncConstraint<T> = ((value: T, path: readonly string[]) => Promise<void>) | {
  validate: (value: T, path: readonly string[]) => Promise<void>;
  constraint: string;
};
```

Similar to `Constraint<T>` but:
- Functions return a Promise
- The `validate` method returns a Promise

## MixedConstraint

Union type representing either a synchronous or asynchronous constraint:

```typescript
export type MixedConstraint<T> = Constraint<T> | AsyncConstraint<T>;
```

## Schema

Type definition for synchronous validation schemas:

```typescript
export type Schema<T> = {
  readonly [K in keyof T]?: readonly Constraint<T[K]>[];
};
```

A schema is an object where each key corresponds to a property in the object being validated, and the value is an array of constraints for that property.

## AsyncSchema

Type definition for schemas that can include asynchronous constraints:

```typescript
export type AsyncSchema<T> = {
  readonly [K in keyof T]?: readonly MixedConstraint<T[K]>[];
};
```

Similar to `Schema<T>` but allows both synchronous and asynchronous constraints.
