---
title: Introduction
---

# Introduction to Negation

Negation is a lightweight TypeScript validation library that takes a unique approach to validation through "negative space programming." Instead of defining what data should be, Negation focuses on what data should *not* be.

## Why Negation?

Traditional validation libraries focus on positive assertions: "this must be a string," "this must be a number," etc. While this approach works, it often leads to verbose code and can miss edge cases.

Negation flips this paradigm by focusing on constraints - what data must *not* be:
- A value must not be null
- A string must not be empty
- A number must not be negative

This approach often leads to more intuitive validation rules that better match how we think about validation in natural language.

## Key Features

- **Intuitive API**: Define validation rules in terms of what data should not be
- **Type Safety**: Built with TypeScript for complete type safety
- **Lightweight**: Minimal bundle size with no dependencies
- **Flexible Error Handling**: Choose between throwing on first error or collecting all errors
- **Path Tracking**: Errors include paths to invalid fields for clear debugging
- **Composable Rules**: Easily combine multiple constraints

## When to Use Negation

Negation is ideal for:

- Form validation in web applications
- API request/response validation
- Data validation in TypeScript/JavaScript applications
- Anywhere you need lightweight, type-safe validation

Ready to get started? Check out the [Getting Started](/guide/getting-started) guide.
