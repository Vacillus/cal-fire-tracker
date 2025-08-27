import { defineFunction } from '@aws-amplify/backend';

export const mutationLogger = defineFunction({
  name: 'mutation-logger',
  entry: './handler.ts',
  runtime: 20,
  timeoutSeconds: 60,
  memoryMB: 256,
  environment: {
    FORENSIC_MODE: 'ENABLED',
  },
});