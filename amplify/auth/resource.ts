import { defineAuth } from '@aws-amplify/backend';

/**
 * Authentication configuration
 * Supports student/instructor roles for Chinchilla Academy
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ['students', 'instructors', 'admins'],
  userAttributes: {
    preferredUsername: {
      mutable: true,
      required: false,
    },
    'custom:role': {
      dataType: 'String',
      mutable: true,
      minLen: 1,
      maxLen: 256,
    },
  },
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    requireUppercase: true,
  },
});