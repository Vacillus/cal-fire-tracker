import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { calFireScraper } from './function/cal-fire-scraper/resource';
import { mutationLogger } from './function/mutation-logger/resource';

/**
 * CAL FIRE Tracker Backend
 * Chinchilla AI Academy - First Amplify App
 */
defineBackend({
  auth,
  data,
  calFireScraper,
  mutationLogger,
});