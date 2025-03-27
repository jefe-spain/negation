/**
 * Negation Async Validation Example
 * 
 * This example demonstrates how to use the async validation features
 * of the Negation library for validating data that requires
 * asynchronous operations like database/API calls.
 */

import {
  negationAsync,
  negateObjectAsync,
  notEmpty,
  notNull,
  notLongerThan,
  notNegative,
  notDuplicate,
  NegationError
} from '../src';

// Define a User type for our example
interface User {
  username: string;
  email: string;
  age: number;
}

// Mock database functions - in a real app these would connect to a database
async function isUsernameTaken(username: string): Promise<boolean> {
  console.log(`Checking if username "${username}" is taken...`);
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  // Our "database" of taken usernames
  const takenUsernames = ['admin', 'root', 'system', 'superuser'];
  return takenUsernames.includes(username);
}

async function isEmailRegistered(email: string): Promise<boolean> {
  console.log(`Checking if email "${email}" is registered...`);
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 700));
  // Our "database" of registered emails
  const registeredEmails = ['admin@example.com', 'root@example.com', 'info@example.com'];
  return registeredEmails.includes(email);
}

// Example 1: Validate a single value with async constraint
async function validateUsername(username: string) {
  console.log('\n--- Example 1: Single Value Async Validation ---');
  try {
    await negationAsync(username, [
      notNull,
      notEmpty,
      notLongerThan(20),
      notDuplicate(isUsernameTaken)
    ]);
    console.log(`✅ Username "${username}" is valid!`);
  } catch (error) {
    if (error instanceof NegationError) {
      console.error(`❌ Username validation failed: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Example 2: Validate an object with mixed sync/async constraints using 'throw' mode
async function validateUserThrow(user: User) {
  console.log('\n--- Example 2: Object Validation with Throw Mode ---');
  
  // Define a validation schema with both sync and async constraints
  try {
    await negateObjectAsync(user, {
      username: [
        notEmpty,
        notLongerThan(20),
        notDuplicate(isUsernameTaken)
      ],
      email: [
        notEmpty,
        notDuplicate(isEmailRegistered)
      ],
      age: [notNegative]
    });
    console.log(`✅ User validated successfully:`, user);
  } catch (error) {
    if (error instanceof NegationError) {
      console.error(`❌ Validation failed at ${error.path.join('.')}: ${error.message}`);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Example 3: Validate an object with collect mode to gather all errors
async function validateUserCollect(user: User) {
  console.log('\n--- Example 3: Object Validation with Collect Mode ---');
  
  const result = await negateObjectAsync(user, {
    username: [
      notEmpty,
      notLongerThan(20),
      notDuplicate(isUsernameTaken)
    ],
    email: [
      notEmpty,
      notDuplicate(isEmailRegistered)
    ],
    age: [notNegative]
  }, { mode: 'collect' });
  
  // Check if validation succeeded (result is not an array of errors)
  if (!Array.isArray(result)) {
    console.log(`✅ User validated successfully:`, result);
  } else {
    console.error(`❌ Found ${result.length} validation errors:`);
    result.forEach((error, index) => {
      console.error(`  ${index + 1}. ${error.path.join('.')}: ${error.message}`);
    });
  }
}

// Run all examples
async function runExamples() {
  // Example 1: Valid and invalid usernames
  await validateUsername('newuser123');
  await validateUsername('admin');
  
  // Example 2: Valid and invalid users with throw mode
  await validateUserThrow({
    username: 'newuser123',
    email: 'new@example.com',
    age: 25
  });
  
  await validateUserThrow({
    username: 'admin',
    email: 'new@example.com',
    age: 25
  });
  
  // Example 3: User with multiple validation errors (collect mode)
  await validateUserCollect({
    username: 'root',
    email: 'admin@example.com',
    age: -5
  });
}

// Run all examples
runExamples().catch(console.error);
