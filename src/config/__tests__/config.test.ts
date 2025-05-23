import { loadConfig } from '../config';

describe('loadConfig', () => {
  beforeEach(() => {
    // Clear all environment variables before each test
    delete process.env.MCP_MATTERMOST_URL;
    delete process.env.MCP_MATTERMOST_TOKEN;
    delete process.env.MCP_MATTERMOST_TEAM_NAME;
    delete process.env.MCP_MATTERMOST_TEAM_ID;
  });

  it('should load config with team name', () => {
    process.env.MCP_MATTERMOST_URL = 'https://example.com';
    process.env.MCP_MATTERMOST_TOKEN = 'test-token';
    process.env.MCP_MATTERMOST_TEAM_NAME = 'test-team-name';

    const config = loadConfig();
    expect(config).toEqual({
      url: 'https://example.com',
      token: 'test-token',
      teamName: 'test-team-name',
      teamId: undefined,
    });
  });

  it('should load config with team ID', () => {
    process.env.MCP_MATTERMOST_URL = 'https://example.com';
    process.env.MCP_MATTERMOST_TOKEN = 'test-token';
    process.env.MCP_MATTERMOST_TEAM_ID = 'test-team-id';

    const config = loadConfig();
    expect(config).toEqual({
      url: 'https://example.com',
      token: 'test-token',
      teamName: undefined,
      teamId: 'test-team-id',
    });
  });

  it('should load config with both team name and team ID', () => {
    process.env.MCP_MATTERMOST_URL = 'https://example.com';
    process.env.MCP_MATTERMOST_TOKEN = 'test-token';
    process.env.MCP_MATTERMOST_TEAM_NAME = 'test-team-name';
    process.env.MCP_MATTERMOST_TEAM_ID = 'test-team-id';

    const config = loadConfig();
    expect(config).toEqual({
      url: 'https://example.com',
      token: 'test-token',
      teamName: 'test-team-name',
      teamId: 'test-team-id',
    });
  });

  it('should throw an error when neither team name nor team ID is provided', () => {
    process.env.MCP_MATTERMOST_URL = 'https://example.com';
    process.env.MCP_MATTERMOST_TOKEN = 'test-token';

    expect(() => loadConfig()).toThrow(
      'Either team name (MCP_MATTERMOST_TEAM_NAME) or team ID (MCP_MATTERMOST_TEAM_ID) must be provided',
    );
  });

  it('should throw an error for invalid URL', () => {
    process.env.MCP_MATTERMOST_URL = 'invalid-url';
    process.env.MCP_MATTERMOST_TOKEN = 'test-token';
    process.env.MCP_MATTERMOST_TEAM_NAME = 'test-team-name';

    expect(() => loadConfig()).toThrow();
  });

  it('should throw an error for missing token', () => {
    process.env.MCP_MATTERMOST_URL = 'https://example.com';
    process.env.MCP_MATTERMOST_TOKEN = '';
    process.env.MCP_MATTERMOST_TEAM_NAME = 'test-team-name';

    expect(() => loadConfig()).toThrow();
  });
});
