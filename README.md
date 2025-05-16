# MCP Mattermost Server

This is an MCP (Model Context Protocol) server for Mattermost, written in TypeScript. It provides various tools for interacting with the Mattermost API.

## Installation

To run this tool, you need to set the following environment variables:

```json
{
  ...
  "mcp-mattermost": {
    "command": "npx",
    "args": [
      "@dakatan/mcp-mattermost"
    ],
    "env": {
      "MCP_MATTERMOST_URL": "https://mattermost.x.y",
      "MCP_MATTERMOST_TOKEN": "",
      "MCP_MATTERMOST_TEAM_ID": "",
    }
  },
  ...
}
```

## Configuration

To run this tool, you need to set the following environment variables:

| Variable Name            | Description                                             | Required |
| ------------------------ | ------------------------------------------------------- | -------- |
| `MCP_MATTERMOST_URL`     | The URL of your Mattermost instance                     | Yes      |
| `MCP_MATTERMOST_TOKEN`   | Your Mattermost personal access token                   | Yes      |
| `MCP_MATTERMOST_TEAM_ID` | The ID of the Mattermost team you want to interact with | Yes      |

## Tools Provided

The MCP server provides the following tools:

- User management: `mattermost_get_users`, `mattermost_search_users`
- Channel management: `mattermost_search_channels`, `mattermost_get_channels`, `mattermost_get_my_channels`
- Post management: `mattermost_search_posts`, `mattermost_get_posts`, `mattermost_create_post`, `mattermost_get_posts_thread`, `mattermost_pin_post`, `mattermost_unpin_post`, `mattermost_get_pinned_posts`
- Reaction management: `mattermost_add_reaction`, `mattermost_remove_reaction`, `mattermost_get_reactions`