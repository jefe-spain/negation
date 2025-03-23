import { 
  negation, 
  negateObject, 
  notNull, 
  notEmpty, 
  notNegative, 
  notLongerThan,
  notShorterThan,
  notGreaterThan,
  notLessThan,
  NegationError 
} from '../src';

// Example 1: Validating a single value
console.log('Example 1: Validating a single value');
try {
  const validName = negation('John Doe', [notNull(), notEmpty()]);
  console.log('Valid name:', validName);
  
  // This will throw an error
  const invalidName = negation('', [notNull(), notEmpty()]);
  console.log('This should not be printed');
} catch (error) {
  if (error instanceof NegationError) {
    console.log(`Validation error: ${error.message}`);
    console.log(`Path: ${JSON.stringify(error.path)}`);
    console.log(`Constraint: ${error.constraint}`);
  }
}

// Example 2: Collecting errors instead of throwing
console.log('\nExample 2: Collecting errors');
const nameErrors = negation('', [notNull(), notEmpty()], { mode: 'collect' }) as NegationError[];
if (nameErrors.length > 0) {
  console.log(`Found ${nameErrors.length} errors:`);
  nameErrors.forEach(err => console.log(`- ${err.message}`));
}

// Example 3: Validating an object
console.log('\nExample 3: Validating an object');
type User = {
  id: number;
  name: string;
  email: string;
  age: number;
};

const validUser: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  age: 30
};

const invalidUser: User = {
  id: -1,  // Negative, will fail
  name: '', // Empty, will fail
  email: 'john@example.com',
  age: 30
};

try {
  const validated = negateObject(validUser, {
    id: [notNull(), notNegative()],
    name: [notNull(), notEmpty()],
    email: [notNull(), notEmpty()],
    age: [notNull(), notNegative()]
  });
  console.log('Valid user:', validated);
  
  // This will throw an error
  const invalid = negateObject(invalidUser, {
    id: [notNull(), notNegative()],
    name: [notNull(), notEmpty()],
    email: [notNull(), notEmpty()],
    age: [notNull(), notNegative()]
  });
  console.log('This should not be printed');
} catch (error) {
  if (error instanceof NegationError) {
    console.log(`Object validation error: ${error.message}`);
    console.log(`Path: ${JSON.stringify(error.path)}`);
    console.log(`Constraint: ${error.constraint}`);
  }
}

// Example 4: Collecting all object validation errors
console.log('\nExample 4: Collecting all object validation errors');
const userErrors = negateObject(invalidUser, {
  id: [notNull(), notNegative()],
  name: [notNull(), notEmpty()],
  email: [notNull(), notEmpty()],
  age: [notNull(), notNegative()]
}, { mode: 'collect' }) as NegationError[];

if (userErrors.length > 0) {
  console.log(`Found ${userErrors.length} errors in user object:`);
  userErrors.forEach(err => {
    console.log(`- Field: ${err.path.join('.')}, Error: ${err.message}, Constraint: ${err.constraint}`);
  });
}

// Example 5: Using the new constraint functions
console.log('\nExample 5: Using the new constraint functions');

// String length constraints
try {
  console.log('Testing string length constraints:');
  negation('hello', [notLongerThan(10)]);
  console.log('- "hello" is not longer than 10 characters ✓');
  
  negation('hello', [notShorterThan(3)]);
  console.log('- "hello" is not shorter than 3 characters ✓');
  
  negation('hello', [notLongerThan(4)]);
  console.log('This should not be printed');
} catch (error) {
  if (error instanceof NegationError) {
    console.log(`- Error: ${error.message} ✗`);
  }
}

// Number range constraints
try {
  console.log('\nTesting number range constraints:');
  negation(42, [notGreaterThan(100)]);
  console.log('- 42 is not greater than 100 ✓');
  
  negation(42, [notLessThan(10)]);
  console.log('- 42 is not less than 10 ✓');
  
  negation(42, [notGreaterThan(40)]);
  console.log('This should not be printed');
} catch (error) {
  if (error instanceof NegationError) {
    console.log(`- Error: ${error.message} ✗`);
  }
} 