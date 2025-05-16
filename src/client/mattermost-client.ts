import { Client4, DEFAULT_LIMIT_AFTER } from '@mattermost/client';
import { Channel } from '@mattermost/types/channels';
import { Post, PostList } from '@mattermost/types/posts';
import { Reaction } from '@mattermost/types/reactions';
import { UserProfile } from '@mattermost/types/users';

import { MattermostConfig } from '../config/config';

/**
 * Wrapper for the Mattermost Client4 API client
 * Provides typed methods for interacting with the Mattermost API
 */
export class MattermostClient {
  private readonly client: Client4;
  private teamId: string;

  /**
   * Create a new Mattermost client
   * @param config Mattermost configuration
   */
  constructor(config: MattermostConfig) {
    this.client = new Client4();
    this.client.setUrl(config.url);
    this.client.setToken(config.token);
    this.teamId = config.teamId;
  }

  async init() {
    const team = await this.client.getTeam(this.teamId);
    if (!team) {
      throw new Error(`Team with ID '${this.teamId}' not found or not accessible`);
    }
  }

  /**
   * Get the current user
   */
  async getMe() {
    return this.convertUserProfile(await this.client.getMe());
  }

  /**
   * Get a user by ID
   */
  async getUser({ userId }: { userId: string }) {
    return this.convertUserProfile(await this.client.getUser(userId));
  }

  /**
   * Get a user by username
   */
  async getUserByUsername({ username }: { username: string }) {
    return this.convertUserProfile(await this.client.getUserByUsername(username));
  }

  /**
   * Search users by term
   */
  async searchUsers({ term }: { term: string }) {
    const response = await this.client.searchUsers(term, { team_id: this.teamId });
    return response.map(this.convertUserProfile);
  }

  /**
   * Search channels by term
   */
  async searchChannels({
    term,
    page = 0,
    perPage = 100,
  }: {
    term: string;
    page?: number;
    perPage?: number;
  }) {
    if (!this.teamId) {
      throw new Error('Team ID not set');
    }
    return this.client.searchAllChannels(term, {
      team_ids: [this.teamId],
      page,
      per_page: perPage,
    });
  }

  /**
   * Get a channel by ID
   */
  async getChannel({ channelId }: { channelId: string }) {
    return this.convertChannel(await this.client.getChannel(channelId));
  }

  /**
   * Get a channel by name
   */
  async getChannelByName({ name }: { name: string }) {
    if (!this.teamId) {
      throw new Error('Team ID not set');
    }
    return this.convertChannel(await this.client.getChannelByName(this.teamId, name));
  }

  /**
   * Search posts by term
   */
  async searchPosts({
    terms,
    page = 0,
    perPage = 100,
  }: {
    terms: string;
    page?: number;
    perPage?: number;
  }) {
    if (!this.teamId) {
      throw new Error('Team ID not set');
    }
    return this.convertPostList(
      await this.client.searchPostsWithParams(this.teamId, {
        terms,
        page,
        per_page: perPage,
      }),
    );
  }

  /**
   * Get a post by ID
   */
  async getPost({ postId }: { postId: string }) {
    return this.convertPost(await this.client.getPost(postId));
  }

  /**
   * Get unread posts in a channel
   */
  async getPostsUnread({ channelId }: { channelId: string }) {
    const me = await this.client.getMe();
    return this.convertPostList(
      await this.client.getPostsUnread(channelId, me.id, DEFAULT_LIMIT_AFTER, 0, true),
    );
  }

  /**
   * Create a new post
   */
  async createPost({
    channelId,
    message,
    rootId,
  }: {
    channelId: string;
    message: string;
    rootId?: string;
  }) {
    return this.convertPost(
      await this.client.createPost({ channel_id: channelId, message, root_id: rootId }),
    );
  }

  /**
   * Get posts in a thread
   */
  async getPostsThread({
    rootId,
    fromPost,
    perPage,
  }: {
    rootId: string;
    fromPost?: string;
    perPage?: number;
  }) {
    return this.convertPostList(
      await this.client.getPaginatedPostThread(rootId, {
        direction: 'up',
        fromPost,
        perPage,
      }),
    );
  }

  /**
   * Add a reaction to a post
   */
  async addReaction({ postId, emojiName }: { postId: string; emojiName: string }) {
    const me = await this.client.getMe();
    return this.convertReaction(await this.client.addReaction(me.id, postId, emojiName));
  }

  /**
   * Remove a reaction from a post
   */
  async removeReaction({ postId, emojiName }: { postId: string; emojiName: string }) {
    const me = await this.client.getMe();
    return this.client.removeReaction(me.id, postId, emojiName);
  }

  /**
   * Get reactions for a post
   */
  async getReactionsForPost({ postId }: { postId: string }) {
    const response = await this.client.getReactionsForPost(postId);
    return response.map(this.convertReaction);
  }

  /**
   * Pin a post to a channel
   */
  async pinPost({ postId }: { postId: string }) {
    return this.client.pinPost(postId);
  }

  /**
   * Unpin a post from a channel
   */
  async unpinPost({ postId }: { postId: string }) {
    return this.client.unpinPost(postId);
  }

  /**
   * Get pinned posts in a channel
   */
  async getPinnedPosts({ channelId }: { channelId: string }) {
    return this.convertPostList(await this.client.getPinnedPosts(channelId));
  }

  /**
   * Get channels for the current user
   */
  async getMyChannels() {
    if (!this.teamId) {
      throw new Error('Team ID not set');
    }
    const channels = await this.client.getMyChannels(this.teamId);
    return channels.filter(channel => ['O', 'P'].includes(channel.type)).map(this.convertChannel);
  }

  private convertPost(post: Post) {
    return {
      ...post,
      create_at: new Date(post.create_at),
      update_at: new Date(post.update_at),
      edit_at: post.edit_at !== 0 ? new Date(post.edit_at) : '',
      delete_at: post.delete_at !== 0 ? new Date(post.delete_at) : '',
    };
  }

  private convertPostList(postList: PostList) {
    return {
      ...postList,
      posts: postList.order.reduce(
        (acc, postId) => ({
          ...acc,
          [postId]: {
            ...postList.posts[postId],
            ...this.convertPost(postList.posts[postId]),
          },
        }),
        {},
      ),
    };
  }

  private convertReaction(reaction: Reaction) {
    return {
      ...reaction,
      create_at: new Date(reaction.create_at),
    };
  }

  private convertChannel(channel: Channel) {
    return {
      ...channel,
      create_at: new Date(channel.create_at),
      update_at: new Date(channel.update_at),
      delete_at: channel.delete_at !== 0 ? new Date(channel.delete_at) : '',
    };
  }

  private convertUserProfile(user: UserProfile) {
    return {
      ...user,
      create_at: new Date(user.create_at),
      update_at: new Date(user.update_at),
      delete_at: user.delete_at !== 0 ? new Date(user.delete_at) : '',
    };
  }
}

