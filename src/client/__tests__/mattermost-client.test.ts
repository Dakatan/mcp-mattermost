import { MattermostConfig } from '../../config/config';
import { MattermostClient } from '../mattermost-client';

jest.mock('@mattermost/client', () => ({
  Client4: jest.fn().mockImplementation(() => ({
    setUrl: jest.fn(),
    setToken: jest.fn(),
    getTeam: jest.fn().mockResolvedValue({ id: 'test-team-id', name: 'test-team-name' }),
    getTeamByName: jest.fn().mockResolvedValue({ id: 'test-team-id', name: 'test-team-name' }),
    getMe: jest.fn().mockResolvedValue({ id: 'test-user-id' }),
    getUser: jest.fn().mockResolvedValue({ id: 'test-user-id', username: 'test-user' }),
    searchUsers: jest.fn().mockResolvedValue([{ id: 'test-user-id', username: 'test-user' }]),
    searchAllChannels: jest
      .fn()
      .mockResolvedValue([{ id: 'test-channel-id', name: 'test-channel' }]),
    getChannel: jest.fn().mockResolvedValue({ id: 'test-channel-id', name: 'test-channel' }),
    getChannelByName: jest.fn().mockResolvedValue({ id: 'test-channel-id', name: 'test-channel' }),
    searchPostsWithParams: jest.fn().mockResolvedValue({
      posts: {
        'test-post-id': {
          id: 'test-post-id',
          message: 'test-post',
          create_at: 123456789,
          update_at: 123456789,
          edit_at: 0,
          delete_at: 0,
        },
      },
      order: ['test-post-id'],
    }),
    getPost: jest.fn().mockResolvedValue({
      id: 'test-post-id',
      message: 'test-post',
      create_at: 123456789,
      update_at: 123456789,
      edit_at: 0,
      delete_at: 0,
    }),
    getPostsUnread: jest.fn().mockResolvedValue({
      posts: {
        'test-post-id': {
          id: 'test-post-id',
          message: 'test-post',
          create_at: 123456789,
          update_at: 123456789,
          edit_at: 0,
          delete_at: 0,
        },
      },
      order: ['test-post-id'],
    }),
    createPost: jest.fn().mockResolvedValue({
      id: 'new-post-id',
      message: 'new-post',
      create_at: 123456789,
      update_at: 123456789,
      edit_at: 0,
      delete_at: 0,
    }),
    getPaginatedPostThread: jest.fn().mockResolvedValue({
      posts: {
        'test-post-id': {
          id: 'test-post-id',
          message: 'test-post',
          create_at: 123456789,
          update_at: 123456789,
          edit_at: 0,
          delete_at: 0,
        },
      },
      order: ['test-post-id'],
    }),
    addReaction: jest.fn().mockResolvedValue({}),
    removeReaction: jest.fn().mockResolvedValue({}),
    getReactionsForPost: jest
      .fn()
      .mockResolvedValue([{ user_id: 'test-user-id', emoji_name: 'test-emoji' }]),
    pinPost: jest.fn().mockResolvedValue({}),
    unpinPost: jest.fn().mockResolvedValue({}),
    getPinnedPosts: jest.fn().mockResolvedValue({
      posts: {
        'test-post-id': {
          id: 'test-post-id',
          message: 'test-post',
          create_at: 123456789,
          update_at: 123456789,
          edit_at: 0,
          delete_at: 0,
        },
      },
      order: ['test-post-id'],
    }),
  })),
}));

describe('MattermostClient', () => {
  describe('team name configuration', () => {
    const config: MattermostConfig = {
      url: 'https://example.com',
      token: 'test-token',
      teamName: 'test-team-name',
    };

    const client = new MattermostClient(config);
    beforeEach(async () => {
      await client.init();
    });

    it('should create a client with valid config', () => {
      expect(client).toBeInstanceOf(MattermostClient);
    });

    it('should get the current user', async () => {
      const result = await client.getMe();
      expect(result).toEqual({
        id: 'test-user-id',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });

    it('should get a user by ID', async () => {
      const result = await client.getUser({ userId: 'test-user-id' });
      expect(result).toEqual({
        id: 'test-user-id',
        username: 'test-user',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });

    it('should search users', async () => {
      const result = await client.searchUsers({ term: 'test' });
      expect(result).toEqual([
        {
          id: 'test-user-id',
          username: 'test-user',
          create_at: expect.any(Date),
          update_at: expect.any(Date),
          delete_at: expect.any(Date),
        },
      ]);
    });

    it('should search channels', async () => {
      const result = await client.searchChannels({ term: 'test' });
      expect(result).toEqual([{ id: 'test-channel-id', name: 'test-channel' }]);
    });

    it('should get a channel by ID', async () => {
      const result = await client.getChannel({ channelId: 'test-channel-id' });
      expect(result).toEqual({
        id: 'test-channel-id',
        name: 'test-channel',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });

    it('should get a channel by name', async () => {
      const result = await client.getChannelByName({ name: 'test-channel' });
      expect(result).toEqual({
        id: 'test-channel-id',
        name: 'test-channel',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });

    it('should search posts', async () => {
      const result = await client.searchPosts({ terms: 'test' });
      expect(result).toEqual({
        order: ['test-post-id'],
        posts: {
          'test-post-id': {
            id: 'test-post-id',
            message: 'test-post',
            create_at: new Date(123456789),
            update_at: new Date(123456789),
            edit_at: '',
            delete_at: '',
          },
        },
      });
    });

    it('should get a post by ID', async () => {
      const result = await client.getPost({ postId: 'test-post-id' });
      expect(result).toEqual({
        id: 'test-post-id',
        message: 'test-post',
        create_at: new Date(123456789),
        update_at: new Date(123456789),
        edit_at: '',
        delete_at: '',
      });
    });

    it('should create a new post', async () => {
      const result = await client.createPost({ channelId: 'test-channel-id', message: 'new-post' });
      expect(result).toEqual({
        id: 'new-post-id',
        message: 'new-post',
        create_at: new Date(123456789),
        update_at: new Date(123456789),
        edit_at: '',
        delete_at: '',
      });
    });

    it('should get unread posts in a channel', async () => {
      const result = await client.getPostsUnread({ channelId: 'test-channel-id' });
      expect(result).toEqual({
        order: ['test-post-id'],
        posts: {
          'test-post-id': {
            id: 'test-post-id',
            message: 'test-post',
            create_at: new Date(123456789),
            update_at: new Date(123456789),
            edit_at: '',
            delete_at: '',
          },
        },
      });
    });

    it('should get posts in a thread', async () => {
      const result = await client.getPostsThread({ rootId: 'test-post-id' });
      expect(result).toEqual({
        order: ['test-post-id'],
        posts: {
          'test-post-id': {
            id: 'test-post-id',
            message: 'test-post',
            create_at: new Date(123456789),
            update_at: new Date(123456789),
            edit_at: '',
            delete_at: '',
          },
        },
      });
    });

    it('should add a reaction to a post', async () => {
      const result = await client.addReaction({ postId: 'test-post-id', emojiName: 'test-emoji' });
      expect(result).toEqual({
        create_at: expect.any(Date),
      });
    });

    it('should remove a reaction from a post', async () => {
      const result = await client.removeReaction({
        postId: 'test-post-id',
        emojiName: 'test-emoji',
      });
      expect(result).toEqual({});
    });

    it('should pin a post', async () => {
      const result = await client.pinPost({ postId: 'test-post-id' });
      expect(result).toEqual({});
    });

    it('should unpin a post', async () => {
      const result = await client.unpinPost({ postId: 'test-post-id' });
      expect(result).toEqual({});
    });

    it('should get pinned posts in a channel', async () => {
      const result = await client.getPinnedPosts({ channelId: 'test-channel-id' });
      expect(result).toEqual({
        order: ['test-post-id'],
        posts: {
          'test-post-id': {
            id: 'test-post-id',
            message: 'test-post',
            create_at: new Date(123456789),
            update_at: new Date(123456789),
            edit_at: '',
            delete_at: '',
          },
        },
      });
    });
  });

  describe('team ID configuration', () => {
    const config: MattermostConfig = {
      url: 'https://example.com',
      token: 'test-token',
      teamId: 'test-team-id',
    };

    const client = new MattermostClient(config);
    beforeEach(async () => {
      await client.init();
    });

    it('should create a client with valid config', () => {
      expect(client).toBeInstanceOf(MattermostClient);
    });

    it('should get the current user', async () => {
      const result = await client.getMe();
      expect(result).toEqual({
        id: 'test-user-id',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });
  });

  // Common tests using team name configuration
  describe('common functionality', () => {
    const config: MattermostConfig = {
      url: 'https://example.com',
      token: 'test-token',
      teamName: 'test-team-name',
    };

    const client = new MattermostClient(config);
    beforeEach(async () => {
      await client.init();
    });

    it('should get the current user', async () => {
      const result = await client.getMe();
      expect(result).toEqual({
        id: 'test-user-id',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });

    it('should get a user by ID', async () => {
      const result = await client.getUser({ userId: 'test-user-id' });
      expect(result).toEqual({
        id: 'test-user-id',
        username: 'test-user',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });

    it('should search users', async () => {
      const result = await client.searchUsers({ term: 'test' });
      expect(result).toEqual([
        {
          id: 'test-user-id',
          username: 'test-user',
          create_at: expect.any(Date),
          update_at: expect.any(Date),
          delete_at: expect.any(Date),
        },
      ]);
    });

    it('should search channels', async () => {
      const result = await client.searchChannels({ term: 'test' });
      expect(result).toEqual([{ id: 'test-channel-id', name: 'test-channel' }]);
    });

    it('should get a channel by ID', async () => {
      const result = await client.getChannel({ channelId: 'test-channel-id' });
      expect(result).toEqual({
        id: 'test-channel-id',
        name: 'test-channel',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });

    it('should get a channel by name', async () => {
      const result = await client.getChannelByName({ name: 'test-channel' });
      expect(result).toEqual({
        id: 'test-channel-id',
        name: 'test-channel',
        create_at: expect.any(Date),
        update_at: expect.any(Date),
        delete_at: expect.any(Date),
      });
    });

    it('should search posts', async () => {
      const result = await client.searchPosts({ terms: 'test' });
      expect(result).toEqual({
        order: ['test-post-id'],
        posts: {
          'test-post-id': {
            id: 'test-post-id',
            message: 'test-post',
            create_at: new Date(123456789),
            update_at: new Date(123456789),
            edit_at: '',
            delete_at: '',
          },
        },
      });
    });

    it('should get a post by ID', async () => {
      const result = await client.getPost({ postId: 'test-post-id' });
      expect(result).toEqual({
        id: 'test-post-id',
        message: 'test-post',
        create_at: new Date(123456789),
        update_at: new Date(123456789),
        edit_at: '',
        delete_at: '',
      });
    });

    it('should create a new post', async () => {
      const result = await client.createPost({ channelId: 'test-channel-id', message: 'new-post' });
      expect(result).toEqual({
        id: 'new-post-id',
        message: 'new-post',
        create_at: new Date(123456789),
        update_at: new Date(123456789),
        edit_at: '',
        delete_at: '',
      });
    });

    it('should get unread posts in a channel', async () => {
      const result = await client.getPostsUnread({ channelId: 'test-channel-id' });
      expect(result).toEqual({
        order: ['test-post-id'],
        posts: {
          'test-post-id': {
            id: 'test-post-id',
            message: 'test-post',
            create_at: new Date(123456789),
            update_at: new Date(123456789),
            edit_at: '',
            delete_at: '',
          },
        },
      });
    });

    it('should get posts in a thread', async () => {
      const result = await client.getPostsThread({ rootId: 'test-post-id' });
      expect(result).toEqual({
        order: ['test-post-id'],
        posts: {
          'test-post-id': {
            id: 'test-post-id',
            message: 'test-post',
            create_at: new Date(123456789),
            update_at: new Date(123456789),
            edit_at: '',
            delete_at: '',
          },
        },
      });
    });

    it('should add a reaction to a post', async () => {
      const result = await client.addReaction({ postId: 'test-post-id', emojiName: 'test-emoji' });
      expect(result).toEqual({
        create_at: expect.any(Date),
      });
    });

    it('should remove a reaction from a post', async () => {
      const result = await client.removeReaction({
        postId: 'test-post-id',
        emojiName: 'test-emoji',
      });
      expect(result).toEqual({});
    });

    it('should pin a post', async () => {
      const result = await client.pinPost({ postId: 'test-post-id' });
      expect(result).toEqual({});
    });

    it('should unpin a post', async () => {
      const result = await client.unpinPost({ postId: 'test-post-id' });
      expect(result).toEqual({});
    });

    it('should get pinned posts in a channel', async () => {
      const result = await client.getPinnedPosts({ channelId: 'test-channel-id' });
      expect(result).toEqual({
        order: ['test-post-id'],
        posts: {
          'test-post-id': {
            id: 'test-post-id',
            message: 'test-post',
            create_at: new Date(123456789),
            update_at: new Date(123456789),
            edit_at: '',
            delete_at: '',
          },
        },
      });
    });
  });
});
