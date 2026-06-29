import { queryCrimeData } from './crimeQueryEngine';

/**
 * Stateful Mock Crime Intelligence API Service - Phase 4.
 * Simulates database search query latency (800ms)
 * and delegates search logic to the Smart Crime Query Engine.
 */
export const sendMessage = async (message, context = {}, language = 'en') => {
  // Simulate database search latency (800ms) to display loader
  await new Promise((resolve) => setTimeout(resolve, 800));

  return queryCrimeData(message, context, language);
};
