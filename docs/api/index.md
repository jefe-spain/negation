---
title: API Reference
---

# API Reference

This section provides detailed documentation for all the functions, types, and constraints provided by Negation.

## Overview

Negation provides four main validation functions:

- [`negation`](/api/core-functions#negation): For validating single values
- [`negateObject`](/api/core-functions#negateobject): For validating objects against a schema
- [`negationAsync`](/api/core-functions#negationasync): For validating single values with async constraints
- [`negateObjectAsync`](/api/core-functions#negateobjectasync): For validating objects with async constraints

It also provides a set of built-in constraints:

### Basic Constraints
- [`notNull`](/api/constraints#notnull): Ensures value is not null or undefined
- [`notEmpty`](/api/constraints#notempty): Ensures string is not empty
- [`notNegative`](/api/constraints#notnegative): Ensures number is not negative

### Parameterized Constraints
- [`notLongerThan`](/api/constraints#notlongerthan): Ensures string doesn't exceed maximum length
- [`notShorterThan`](/api/constraints#notshorterthan): Ensures string isn't shorter than minimum length
- [`notGreaterThan`](/api/constraints#notgreaterthan): Ensures number doesn't exceed maximum value
- [`notLessThan`](/api/constraints#notlessthan): Ensures number isn't less than minimum value

### Asynchronous Constraints
- [`notDuplicate`](/api/constraints#notduplicate): Ensures value isn't a duplicate (using async function)

## Type Definitions

Negation provides TypeScript type definitions for all its functions and constraints. See the [Types](/api/types) section for details.

## Error Handling

Negation uses the [`NegationError`](/api/types#negationerror) class for validation errors, which includes:

- `path`: The path to the invalid value (empty array for single values)
- `message`: Human-readable error message
- `constraint`: The constraint that failed

## Next Steps

- Check out the [Core Functions](/api/core-functions) for detailed documentation of the main validation functions
- See the [Constraints](/api/constraints) section for documentation of all built-in constraints
- Visit the [Types](/api/types) section for TypeScript type definitions
