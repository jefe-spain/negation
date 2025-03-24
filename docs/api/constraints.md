---
title: Constraints
---

# Constraints

Negation provides a set of built-in constraints for common validation scenarios. These constraints are divided into two categories:

1. **Basic Constraints**: Simple constraints that can be used directly
2. **Parameterized Constraints**: Functions that return constraints with specific parameters

## Basic Constraints

### notNull

Ensures a value is not null or undefined.

```typescript
import { negation, notNull } from 'negation';

const value = 'hello';
const validatedValue = negation(value, [notNull]);
```

If the value is null or undefined, a `NegationError` will be thrown with the message "Value must not be null or undefined".

### notEmpty

Ensures a string is not empty (after trimming whitespace).

```typescript
import { negation, notEmpty } from 'negation';

const value = 'hello';
const validatedValue = negation(value, [notEmpty]);
```

If the string is empty, a `NegationError` will be thrown with the message "String must not be empty".

### notNegative

Ensures a number is not negative (less than 0).

```typescript
import { negation, notNegative } from 'negation';

const value = 42;
const validatedValue = negation(value, [notNegative]);
```

If the number is negative, a `NegationError` will be thrown with the message "Number must not be negative".

## Parameterized Constraints

### notLongerThan

Creates a constraint that ensures a string doesn't exceed a maximum length.

```typescript
import { negation, notLongerThan } from 'negation';

const value = 'hello';
const validatedValue = negation(value, [notLongerThan(10)]);
```

If the string is longer than the specified maximum length, a `NegationError` will be thrown with the message "String must not be longer than [maxLength] characters".

### notShorterThan

Creates a constraint that ensures a string isn't shorter than a minimum length.

```typescript
import { negation, notShorterThan } from 'negation';

const value = 'hello';
const validatedValue = negation(value, [notShorterThan(3)]);
```

If the string is shorter than the specified minimum length, a `NegationError` will be thrown with the message "String must not be shorter than [minLength] characters".

### notGreaterThan

Creates a constraint that ensures a number doesn't exceed a maximum value.

```typescript
import { negation, notGreaterThan } from 'negation';

const value = 42;
const validatedValue = negation(value, [notGreaterThan(100)]);
```

If the number is greater than the specified maximum value, a `NegationError` will be thrown with the message "Number must not be greater than [max]".

### notLessThan

Creates a constraint that ensures a number isn't less than a minimum value.

```typescript
import { negation, notLessThan } from 'negation';

const value = 42;
const validatedValue = negation(value, [notLessThan(10)]);
```

If the number is less than the specified minimum value, a `NegationError` will be thrown with the message "Number must not be less than [min]".

## Combining Constraints

Constraints can be combined to create more complex validation rules:

```typescript
import { negation, notNull, notEmpty, notLongerThan } from 'negation';

const value = 'hello';
const validatedValue = negation(value, [
  notNull,
  notEmpty,
  notLongerThan(10)
]);
```

This will validate that the value is not null, not empty, and not longer than 10 characters.
