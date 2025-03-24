---
title: Core Concepts
---

# Core Concepts

Negation is built around the concept of "negative space programming" for validation. This page explains the key concepts and philosophy behind the library.

## Negative Space Programming

In traditional validation libraries, you define what data should be:
- "This must be a string"
- "This must be a number greater than 0"
- "This must match this pattern"

Negation flips this paradigm by focusing on what data should *not* be:
- "This must not be null"
- "This must not be empty"
- "This must not be negative"

This approach often leads to more intuitive and readable validation rules that better match how we think about validation in natural language.

## Why Negative Validation?

There are several advantages to the negative validation approach:

1. **More Intuitive**: Constraints like "must not be empty" are often more intuitive than "must be a non-empty string"
2. **Better Edge Case Handling**: By explicitly defining what must not occur, you're less likely to miss edge cases
3. **More Concise**: Negative constraints often lead to more concise code
4. **Better Error Messages**: Error messages like "String must not be empty" are often more helpful than "String must be valid"

## Constraints

In Negation, validation rules are defined as constraints - functions that check if a value violates a specific rule. If the rule is violated, the constraint throws a `NegationError`.

Constraints come in two forms:

1. **Direct Constraints**: Simple constraints like `notNull` and `notEmpty` that can be used directly
2. **Parameterized Constraints**: Functions that return constraints, like `notLongerThan(10)` and `notLessThan(5)`

## Validation Modes

Negation supports two validation modes:

1. **Throw Mode (default)**: Throws a `NegationError` on the first validation failure
2. **Collect Mode**: Collects all validation errors and returns them as an array

## Path Tracking

When validating objects, Negation tracks the path to each invalid field. This makes it easy to identify which field failed validation and why.

For example, if a user's email is invalid, the error will include the path `['email']` to help you identify the problematic field.

## Type Safety

Negation is built with TypeScript and provides complete type safety. Constraints are typed to ensure they're only used with compatible value types (e.g., `notEmpty` can only be used with strings).
