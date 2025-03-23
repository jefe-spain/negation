/**
 * Negation - Validation library using negative space programming
 * Version 0.0.1
 */

// Type definitions with const type parameters (TS 5.0+)
export type ValidationMode = 'throw' | 'collect';

export interface ValidationOptions {
  mode?: ValidationMode;
}

// NegationError class using the satisfies operator for better type checking
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

// Constraint type definition with better typing
export type Constraint<T> = ((value: T, path: readonly string[]) => void) | {
  validate: (value: T, path: readonly string[]) => void;
  constraint: string;
};

// Core constraints as objects with satisfies operator for type safety
export const notNull = {
  validate: <T>(value: T | null | undefined, path: readonly string[]): void => {
    if (value === null || value === undefined) {
      throw new NegationError(path, `Value must not be null or undefined`, 'notNull');
    }
  },
  constraint: 'notNull'
} satisfies Constraint<unknown>;

export const notEmpty = {
  validate: (value: string, path: readonly string[]): void => {
    if (value.trim() === '') {
      throw new NegationError(path, `String must not be empty`, 'notEmpty');
    }
  },
  constraint: 'notEmpty'
} satisfies Constraint<string>;

export const notNegative = {
  validate: (value: number, path: readonly string[]): void => {
    if (value < 0) {
      throw new NegationError(path, `Number must not be negative`, 'notNegative');
    }
  },
  constraint: 'notNegative'
} satisfies Constraint<number>;

// Additional string constraints
export function notLongerThan(maxLength: number): Constraint<string> {
  return {
    validate: (value: string, path: readonly string[]): void => {
      if (value.length > maxLength) {
        throw new NegationError(
          path,
          `String must not be longer than ${maxLength} characters`,
          'notLongerThan'
        );
      }
    },
    constraint: 'notLongerThan'
  };
}

export function notShorterThan(minLength: number): Constraint<string> {
  return {
    validate: (value: string, path: readonly string[]): void => {
      if (value.length < minLength) {
        throw new NegationError(
          path,
          `String must not be shorter than ${minLength} characters`,
          'notShorterThan'
        );
      }
    },
    constraint: 'notShorterThan'
  };
}

// Additional number constraints
export function notGreaterThan(max: number): Constraint<number> {
  return {
    validate: (value: number, path: readonly string[]): void => {
      if (value > max) {
        throw new NegationError(
          path,
          `Number must not be greater than ${max}`,
          'notGreaterThan'
        );
      }
    },
    constraint: 'notGreaterThan'
  };
}

export function notLessThan(min: number): Constraint<number> {
  return {
    validate: (value: number, path: readonly string[]): void => {
      if (value < min) {
        throw new NegationError(
          path,
          `Number must not be less than ${min}`,
          'notLessThan'
        );
      }
    },
    constraint: 'notLessThan'
  };
}

// Schema type with improved typing
export type Schema<T> = {
  readonly [K in keyof T]?: readonly Constraint<T[K]>[];
};

// Main validation functions with readonly arrays for better immutability
export function negation<T>(
  value: T, 
  constraints: readonly Constraint<T>[], 
  options: Readonly<ValidationOptions> = {}
): T | readonly NegationError[] {
  const mode = options.mode || 'throw';
  const errors: NegationError[] = [];
  
  for (const constraint of constraints) {
    try {
      if (typeof constraint === 'function') {
        constraint(value, []);
      } else {
        constraint.validate(value, []);
      }
    } catch (error) {
      if (error instanceof NegationError) {
        if (mode === 'throw') {
          throw error;
        } else {
          errors.push(error);
        }
      } else {
        // Re-throw unexpected errors
        throw error;
      }
    }
  }
  
  return mode === 'collect' ? Object.freeze(errors) : value;
}

export function negateObject<T extends Record<string, any>>(
  obj: T,
  schema: Readonly<Schema<T>>,
  options: Readonly<ValidationOptions> = {}
): T | readonly NegationError[] {
  const mode = options.mode || 'throw';
  const errors: NegationError[] = [];
  
  for (const key in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, key)) {
      const constraints = schema[key] || [];
      const value = obj[key];
      
      for (const constraint of constraints) {
        try {
          if (typeof constraint === 'function') {
            constraint(value, [key]);
          } else {
            constraint.validate(value, [key]);
          }
        } catch (error) {
          if (error instanceof NegationError) {
            if (mode === 'throw') {
              throw error;
            } else {
              errors.push(error);
            }
          } else {
            // Re-throw unexpected errors
            throw error;
          }
        }
      }
    }
  }
  
  return mode === 'collect' ? Object.freeze(errors) : obj;
} 