import { defineFunction, secret } from '@aws-amplify/backend';

export const calFireScraper = defineFunction({
  name: 'cal-fire-scraper',
  entry: './handler.ts',
  runtime: 20,
  timeoutSeconds: 300,
  memoryMB: 512,
  environment: {
    CAL_FIRE_API_URL: 'https://www.fire.ca.gov/umbraco/api/IncidentApi/List',
    MUTATION_MODE: 'SYSTEM_SCRAPE',
  },
  schedule: 'rate(30 minutes)', // Run every 30 minutes
});