import { z } from 'zod';

/**
 * Configuration schema for Mattermost MCP server
 * @typedef {Object} MattermostConfigSchema
 * @property {string} url - Mattermost instance URL
 * @property {string} token - Mattermost personal access token
 * @property {string} [teamName] - Mattermost team name (from MCP_MATTERMOST_TEAM_NAME env var)
 * @property {string} [teamId] - Mattermost team ID (from MCP_MATTERMOST_TEAM_ID env var)
 */
const configSchema = z
  .object({
    url: z.string().url('Invalid Mattermost URL (from MCP_MATTERMOST_URL env var)'),
    token: z.string().min(1, 'Mattermost token is required (from MCP_MATTERMOST_TOKEN env var)'),
    teamName: z.string().optional(),
    teamId: z.string().optional(),
  })
  .refine(data => data.teamName || data.teamId, {
    message:
      'Either team name (MCP_MATTERMOST_TEAM_NAME) or team ID (MCP_MATTERMOST_TEAM_ID) must be provided',
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
    teamName: process.env.MCP_MATTERMOST_TEAM_NAME || undefined,
    teamId: process.env.MCP_MATTERMOST_TEAM_ID || undefined,
  };

  return configSchema.parse(config);
}
