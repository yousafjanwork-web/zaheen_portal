/**
 * ZAHEEN MDCAT Module — API Configuration
 * ─────────────────────────────────────────────────────────────────
 * Two separate base URLs:
 *
 * MDCAT_DB_API   → Database APIs (quizzes, past papers, attempts,
 *                  focus sessions, recommendations, performance)
 *
 * MDCAT_AI_API   → AI APIs (chat, AI quiz generation)
 */
 
export const MDCAT_DB_API = "https://api.zaheen.com.pk/v2";
export const MDCAT_AI_API = "https://zai.zaheen.com.pk";
 
/** For database endpoints: quizzes, past papers, attempts, focus sessions, recommendations */
export const mdcatApi = (path: string) => `${MDCAT_DB_API}${path}`;
 
/** For AI endpoints: chat, AI quiz generation */
export const mdcatAiApi = (path: string) => `${MDCAT_AI_API}${path}`;
 