/**
 * Negation - Validation library using negative space programming
 * Version 0.0.2
 * 
 * Features:
 * - Intuitive "negative space" validation approach
 * - Strongly typed with TypeScript
 * - Synchronous and asynchronous validation support
 * - Flexible error handling modes (throw or collect)
 * - Immutable results with readonly types
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

/**
 * Type representing a synchronous validation constraint.
 * Can be a function or an object with validate method and constraint name.
 */
export type Constraint<T> = ((value: T, path: readonly string[]) => void) | {
  validate: (value: T, path: readonly string[]) => void;
  constraint: string;
};

/**
 * Type representing an asynchronous validation constraint.
 * Similar to Constraint<T> but with Promise-based return values.
 */
export type AsyncConstraint<T> = ((value: T, path: readonly string[]) => Promise<void>) | {
  validate: (value: T, path: readonly string[]) => Promise<void>;
  constraint: string;
};

/**
 * Union type representing either a synchronous or asynchronous constraint.
 */
export type MixedConstraint<T> = Constraint<T> | AsyncConstraint<T>;

/**
 * Utility function to determine if a constraint is asynchronous.
 * @param constraint - The constraint to check
 * @returns True if the constraint is asynchronous, false otherwise
 */
function isAsyncConstraint<T>(constraint: MixedConstraint<T>): constraint is AsyncConstraint<T> {
  if (typeof constraint === 'function') {
    // Check the constructor name of the return value
    const returnValue = constraint({} as T, []);
    return returnValue instanceof Promise;
  } else {
    // Check if the validate method returns a Promise
    const returnValue = constraint.validate({} as T, []);
    return returnValue instanceof Promise;
  }
}

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

/**
 * Schema type for synchronous validation
 */
export type Schema<T> = {
  readonly [K in keyof T]?: readonly Constraint<T[K]>[];
};

/**
 * Schema type for validation that may include asynchronous constraints
 */
export type AsyncSchema<T> = {
  readonly [K in keyof T]?: readonly MixedConstraint<T[K]>[];
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

/**
 * Performs asynchronous validation on a single value against one or more constraints.
 * Supports both synchronous and asynchronous constraints.
 * 
 * @param value - The value to validate
 * @param constraints - Array of constraints to validate against (can be sync or async)
 * @param options - Validation options (mode: 'throw' or 'collect')
 * @returns A Promise resolving to the validated value or array of errors
 * 
 * @example
 * // Validate email asynchronously
 * const result = await negationAsync(email, [
 *   notEmpty,
 *   notMatchingPattern(/^[^@]+@[^@]+\.[^@]+$/),
 *   notDuplicate(checkEmailExists)
 * ]);
 */
export async function negationAsync<T>(
  value: T, 
  constraints: readonly MixedConstraint<T>[], 
  options: Readonly<ValidationOptions> = {}
): Promise<T | readonly NegationError[]> {
  const mode = options.mode || 'throw';
  const errors: NegationError[] = [];
  
  for (const constraint of constraints) {
    try {
      if (typeof constraint === 'function') {
        const result = constraint(value, []);
        if (result instanceof Promise) {
          await result;
        }
      } else {
        const result = constraint.validate(value, []);
        if (result instanceof Promise) {
          await result;
        }
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

/**
 * Performs asynchronous validation on an object against a schema.
 * Supports both synchronous and asynchronous constraints.
 * 
 * @param obj - The object to validate
 * @param schema - Validation schema with mixed sync/async constraints
 * @param options - Validation options (mode: 'throw' or 'collect')
 * @returns A Promise resolving to the validated object or array of errors
 * 
 * @example
 * // Validate user with async checks
 * const userSchema: AsyncSchema<User> = {
 *   username: [notEmpty, notDuplicate(isUsernameTaken)],
 *   email: [notEmpty, notDuplicate(isEmailTaken)]
 * };
 * 
 * try {
 *   const validatedUser = await negateObjectAsync(user, userSchema);
 *   // User is valid
 * } catch (error) {
 *   // Handle validation error
 * }
 */
export async function negateObjectAsync<T extends Record<string, any>>(
  obj: T,
  schema: Readonly<AsyncSchema<T>>,
  options: Readonly<ValidationOptions> = {}
): Promise<T | readonly NegationError[]> {
  const mode = options.mode || 'throw';
  const errors: NegationError[] = [];
  
  const validationPromises: Promise<void>[] = [];
  
  for (const key in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, key)) {
      const constraints = schema[key] || [];
      const value = obj[key];
      
      for (const constraint of constraints) {
        const validatePromise = (async () => {
          try {
            if (typeof constraint === 'function') {
              const result = constraint(value, [key]);
              if (result instanceof Promise) {
                await result;
              }
            } else {
              const result = constraint.validate(value, [key]);
              if (result instanceof Promise) {
                await result;
              }
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
        })();
        
        validationPromises.push(validatePromise);
        
        // If we're in throw mode, we should stop at the first error
        if (mode === 'throw') {
          try {
            await validatePromise;
          } catch (error) {
            throw error;
          }
        }
      }
    }
  }
  
  // If we're in collect mode, wait for all validation promises to complete
  if (mode === 'collect') {
    await Promise.all(validationPromises);
  }
  
  return mode === 'collect' ? Object.freeze(errors) : obj;
}

/**
 * Creates an async constraint that checks if a value is a duplicate.
 * 
 * @param checkDuplicate - Function that checks if value exists/is duplicate
 * @returns An AsyncConstraint that validates against duplicates
 * 
 * @example
 * // Check if username already exists in database
 * async function isUsernameTaken(username: string): Promise<boolean> {
 *   const user = await db.users.findOne({ username });
 *   return !!user;
 * }
 * 
 * const usernameConstraints = [
 *   notEmpty,
 *   notLongerThan(20),
 *   notDuplicate(isUsernameTaken)
 * ];
 */
export function notDuplicate<T>(
  checkDuplicate: (value: T) => Promise<boolean>
): AsyncConstraint<T> {
  return {
    validate: async (value: T, path: readonly string[]): Promise<void> => {
      if (await checkDuplicate(value)) {
        throw new NegationError(
          path,
          `Value must not be a duplicate`,
          'notDuplicate'
        );
      }
    },
    constraint: 'notDuplicate'
  };
}

// EXAMPLES

/**
 * Example: Asynchronous User Validation
 * 
 * This example demonstrates how to use async validation with Negation.
 * It validates a user object with both synchronous and asynchronous constraints.
 */

/*
interface User {
  username: string;
  email: string;
  age: number;
}

// Mock database lookup functions
async function isUsernameTaken(username: string): Promise<boolean> {
  // Simulate API call to check if username exists
  await new Promise(resolve => setTimeout(resolve, 100));
  return ['admin', 'root', 'system'].includes(username);
}

async function isEmailTaken(email: string): Promise<boolean> {
  // Simulate API call to check if email exists
  await new Promise(resolve => setTimeout(resolve, 100));
  return ['admin@example.com', 'root@example.com'].includes(email);
}

// Define a schema with both sync and async constraints
const userSchema: AsyncSchema<User> = {
  username: [
    notEmpty,
    notShorterThan(3),
    notLongerThan(20),
    notDuplicate(isUsernameTaken)
  ],
  email: [
    notEmpty,
    // Custom function-style constraint
    (email: string, path: string[]) => {
      if (!email.includes('@')) {
        throw new NegationError(path, 'Email must contain @', 'validEmail');
      }
    },
    notDuplicate(isEmailTaken)
  ],
  age: [notNegative, notGreaterThan(120)]
};

// Usage with throw mode
async function validateUserThrow(user: User) {
  try {
    // This will throw on first error
    const validUser = await negateObjectAsync(user, userSchema);
    console.log('User is valid:', validUser);
    return validUser;
  } catch (error) {
    console.error('Validation failed:', error.message);
    throw error;
  }
}

// Usage with collect mode
async function validateUserCollect(user: User) {
  const result = await negateObjectAsync(user, userSchema, { mode: 'collect' });
  
  if (!Array.isArray(result)) {
    console.log('User is valid:', result);
    return result;
  } else {
    console.error('Validation errors:', result.map(e => e.message).join(', '));
    return result;
  }
}

// Example usage:
const user: User = {
  username: 'johndoe',
  email: 'john@example.com',
  age: 30
};

// validateUserThrow(user).catch(e => console.error(e));
// validateUserCollect(user).then(result => console.log(result));
*/