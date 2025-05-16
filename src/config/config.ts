import { z } from 'zod';

/**
 * Configuration schema for Mattermost MCP server
 * @typedef {Object} MattermostConfigSchema
 * @property {string} url - Mattermost instance URL
 * @property {string} token - Mattermost personal access token
 * @property {string} teamId - Mattermost team ID (from MCP_MATTERMOST_TEAM_ID env var)
 */
const configSchema = z.object({
  url: z.string().url('Invalid Mattermost URL (from MCP_MATTERMOST_URL env var)'),
  token: z.string().min(1, 'Mattermost token is required (from MCP_MATTERMOST_TOKEN env var)'),
  teamId: z.string().min(1, 'Mattermost team ID is required (from MCP_MATTERMOST_TEAM_ID env var)'),
});

export type MattermostConfig = z.infer<typeof configSchema>;

/**
 * Load configuration from environment variables
 * @returns Validated configuration object
 */
export function loadConfig(): MattermostConfig {
  const config = {
    url: process.env.MCP_MATTERMOST_URL || '',
    token: process.env.MCP_MATTERMOST_TOKEN || '',
    teamId: process.env.MCP_MATTERMOST_TEAM_ID || '',
  };

  return configSchema.parse(config);
}

