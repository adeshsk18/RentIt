import dotenv from 'dotenv';
import { checkUpiAndPin } from '../lib/utils.js';

dotenv.config();

// Test UPI combinations
const upiId = "rentit@okaxis";
const pin = "777777777777";  // All 7s, sum = 84

console.log('Testing UPI validation:');
console.log('UPI ID:', upiId);
console.log('PIN:', pin);

// Verify each validation rule
console.log('\nValidation Rules Check:');
console.log('1. UPI ID contains @:', upiId.includes('@'));
console.log('2. UPI ID length >= 8:', upiId.length >= 8);
console.log('3. PIN is 12 digits:', pin.length === 12);
console.log('4. All digits > 5:', pin.split('').every(d => parseInt(d) > 5));
console.log('5. All digits are odd:', pin.split('').every(d => parseInt(d) % 2 === 1));

const sum = pin.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
console.log('6. Sum of digits:', sum);

console.log('\nFinal validation result:', checkUpiAndPin(upiId, pin)); 