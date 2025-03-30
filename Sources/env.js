/**
 * Input raw data about your API Key file (.p8)  
 */
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
/**
 * Input Appstore connect `key_id`  
 */
export const KEY_ID = process.env.KEY_ID;
/**
 * Input Appstore connect `issuer_id`  
 */
export const ISSUER_ID = process.env.ISSUER_ID;
/**
 * Input your bundle_identifier of application you can input multiple bundle_id with comma and no whitespace  
 */
export const BUNDLE_ID = process.env.BUNDLE_ID;
/**
 * The Slack webhook URL to use for sending notifications.
 */
export const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;
/**
 * The Discord webhook URL to use for sending notifications.
 */
export const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
/**
 * The GitHub token to use for authentication.
 */
export const GH_TOKEN = process.env.GH_TOKEN;
/**
 * The ID of the Gist to use for the application.
 */
export const GIST_ID = process.env.GIST_ID;
/**
 * The language to use if the `LANGUAGE` environment variable is not set.
 * @kind "en" | "ko" | "ja"
 */
export const LANGUAGE = process.env.LANGUAGE ?? 'ko';
