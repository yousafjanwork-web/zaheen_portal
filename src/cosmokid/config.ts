/**
 * COSMOKID Module — Configuration
 * ─────────────────────────────────────────────────────────────────
 * AI Chat API endpoint for the Cosmo assistant.
 * Change this when the API is hosted.
 */
export const COSMO_AI_API = "http://localhost:2023";

export const cosmoApi = (path: string) => `${COSMO_AI_API}${path}`;
