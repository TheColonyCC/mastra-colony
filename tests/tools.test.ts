/**
 * Unit tests for Mastra Colony tools.
 */

import { describe, expect, it, vi } from "vitest";
import {
  colonyTools,
  colonyReadOnlyTools,
  colonySearch,
  colonyGetPosts,
  colonyGetPost,
  colonyGetComments,
  colonyCreatePost,
  colonyCreateComment,
  colonySendMessage,
  colonyGetUser,
  colonyDirectory,
  colonyGetMe,
  colonyGetNotifications,
  colonyGetNotificationCount,
  colonyGetUnreadCount,
  colonyVotePost,
  colonyVoteComment,
  colonyReactPost,
  colonyReactComment,
  colonyGetPoll,
  colonyVotePoll,
  colonyListConversations,
  colonyGetConversation,
  colonyFollow,
  colonyUnfollow,
  colonyListColonies,
  colonyIterPosts,
  colonyUpdatePost,
  colonyDeletePost,
  colonyMarkNotificationsRead,
  colonyJoinColony,
  colonyLeaveColony,
  colonySystemPrompt,
} from "../src/tools.js";
import type { ColonyClient } from "@thecolony/sdk";
import { ColonyRateLimitError } from "@thecolony/sdk";

function mockClient(overrides: Partial<ColonyClient> = {}): ColonyClient {
  return {
    search: vi.fn().mockResolvedValue({ items: [], total: 0, users: [] }),
    getPosts: vi.fn().mockResolvedValue({ items: [], total: 0 }),
    getPost: vi.fn().mockResolvedValue({
      id: "p1",
      title: "Test",
      body: "body",
      author: { username: "alice", display_name: "Alice", user_type: "agent", karma: 10 },
      post_type: "discussion",
      colony_id: "col1",
      score: 5,
      comment_count: 2,
      language: "en",
      tags: null,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    }),
    iterComments: vi.fn().mockImplementation(async function* () {
      yield {
        id: "c1",
        author: { username: "bob" },
        body: "a comment",
        parent_id: null,
        score: 1,
        created_at: "2026-01-01",
      };
    }),
    createPost: vi
      .fn()
      .mockResolvedValue({ id: "p2", title: "New Post", created_at: "2026-01-01" }),
    createComment: vi
      .fn()
      .mockResolvedValue({ id: "c2", post_id: "p1", body: "my comment", created_at: "2026-01-01" }),
    sendMessage: vi.fn().mockResolvedValue({ id: "m1", body: "hello", created_at: "2026-01-01" }),
    getUser: vi.fn().mockResolvedValue({
      id: "u1",
      username: "alice",
      display_name: "Alice",
      user_type: "agent",
      bio: "An agent",
      karma: 42,
      capabilities: { skills: ["ts"] },
      created_at: "2026-01-01",
    }),
    directory: vi.fn().mockResolvedValue({ items: [], total: 0 }),
    getMe: vi.fn().mockResolvedValue({
      id: "me1",
      username: "mybot",
      display_name: "My Bot",
      user_type: "agent",
      bio: "I'm a bot",
      karma: 10,
      capabilities: {},
      created_at: "2026-01-01",
    }),
    getNotifications: vi.fn().mockResolvedValue([]),
    getNotificationCount: vi.fn().mockResolvedValue({ unread_notifications: 5, unread_count: 5 }),
    getUnreadCount: vi.fn().mockResolvedValue({ unread_direct_messages: 3, unread_count: 3 }),
    votePost: vi.fn().mockResolvedValue({}),
    voteComment: vi.fn().mockResolvedValue({}),
    reactPost: vi.fn().mockResolvedValue({}),
    reactComment: vi.fn().mockResolvedValue({}),
    getPoll: vi.fn().mockResolvedValue({
      options: [],
      total_votes: 0,
      is_closed: false,
      closes_at: null,
      user_voted: false,
    }),
    votePoll: vi.fn().mockResolvedValue({}),
    listConversations: vi.fn().mockResolvedValue([
      {
        id: "conv1",
        other_user: { username: "bob" },
        last_message_at: "2026-11-18T16:00:00Z",
        unread_count: 2,
        last_message_preview: "see you at five",
        is_archived: false,
      },
    ]),
    getConversation: vi.fn().mockResolvedValue({
      other_user: { username: "bob" },
      messages: [
        {
          id: "m1",
          sender: { username: "alice" },
          body: "hi",
          is_read: true,
          created_at: "2026-01-01",
        },
      ],
    }),
    follow: vi.fn().mockResolvedValue({}),
    unfollow: vi.fn().mockResolvedValue({}),
    getColonies: vi
      .fn()
      .mockResolvedValue([
        { name: "general", display_name: "General", description: "Main colony", member_count: 100 },
      ]),
    updatePost: vi.fn().mockResolvedValue({ id: "p1", title: "Updated", updated_at: "2026-01-02" }),
    deletePost: vi.fn().mockResolvedValue({}),
    markNotificationsRead: vi.fn().mockResolvedValue({}),
    joinColony: vi.fn().mockResolvedValue({ success: true }),
    leaveColony: vi.fn().mockResolvedValue({ success: true }),
    iterPosts: vi.fn().mockImplementation(async function* () {
      yield {
        id: "p1",
        title: "Test Post",
        body: "Hello world",
        author: { username: "testuser" },
        post_type: "discussion",
        colony_id: "general",
        score: 5,
        comment_count: 2,
        created_at: "2026-01-01",
      };
    }),
    ...overrides,
  } as unknown as ColonyClient;
}

const ctx = {} as any;

// ── Bundle tests ─────────────────────────────────────────────────

describe("colonyTools bundle", () => {
  it("returns all 30 tools", () => {
    const client = mockClient();
    const tools = colonyTools(client);
    expect(Object.keys(tools)).toHaveLength(30);
  });

  it("every tool has a description", () => {
    const client = mockClient();
    const tools = colonyTools(client);
    for (const [name, t] of Object.entries(tools)) {
      expect((t as any).description, `${name} missing description`).toBeTruthy();
    }
  });

  it("every tool has an id", () => {
    const client = mockClient();
    const tools = colonyTools(client);
    for (const [name, t] of Object.entries(tools)) {
      expect((t as any).id, `${name} missing id`).toBeTruthy();
    }
  });

  it("contains all expected tool names", () => {
    const client = mockClient();
    const names = Object.keys(colonyTools(client));
    const expected = [
      "colonySearch",
      "colonyGetPosts",
      "colonyGetPost",
      "colonyGetComments",
      "colonyCreatePost",
      "colonyCreateComment",
      "colonySendMessage",
      "colonyGetUser",
      "colonyDirectory",
      "colonyGetMe",
      "colonyGetNotifications",
      "colonyGetNotificationCount",
      "colonyGetUnreadCount",
      "colonyVotePost",
      "colonyVoteComment",
      "colonyReactPost",
      "colonyReactComment",
      "colonyGetPoll",
      "colonyVotePoll",
      "colonyListConversations",
      "colonyGetConversation",
      "colonyFollow",
      "colonyUnfollow",
      "colonyListColonies",
      "colonyIterPosts",
      "colonyUpdatePost",
      "colonyDeletePost",
      "colonyMarkNotificationsRead",
      "colonyJoinColony",
      "colonyLeaveColony",
    ];
    for (const name of expected) {
      expect(names).toContain(name);
    }
  });
});

describe("colonyReadOnlyTools bundle", () => {
  it("returns 15 tools", () => {
    const client = mockClient();
    expect(Object.keys(colonyReadOnlyTools(client))).toHaveLength(15);
  });

  it("excludes write tools", () => {
    const client = mockClient();
    const names = Object.keys(colonyReadOnlyTools(client));
    const writeTools = [
      "colonyCreatePost",
      "colonyCreateComment",
      "colonySendMessage",
      "colonyVotePost",
      "colonyVoteComment",
      "colonyReactPost",
      "colonyReactComment",
      "colonyVotePoll",
      "colonyFollow",
      "colonyUnfollow",
      "colonyUpdatePost",
      "colonyDeletePost",
      "colonyMarkNotificationsRead",
      "colonyJoinColony",
      "colonyLeaveColony",
    ];
    for (const name of writeTools) {
      expect(names).not.toContain(name);
    }
  });
});

// ── Per-tool tests ───────────────────────────────────────────────

describe("colonySearch", () => {
  it("calls client.search with the right params", async () => {
    const client = mockClient();
    const t = colonySearch(client);
    await t.execute!({ query: "ai agents", limit: 5 }, ctx);
    expect(client.search).toHaveBeenCalledWith("ai agents", {
      limit: 5,
      postType: undefined,
      sort: undefined,
    });
  });
});

describe("colonyGetPosts", () => {
  it("calls client.getPosts", async () => {
    const client = mockClient();
    const t = colonyGetPosts(client);
    await t.execute!({ colony: "general", sort: "top", limit: 5 }, ctx);
    expect(client.getPosts).toHaveBeenCalledWith({
      colony: "general",
      sort: "top",
      limit: 5,
      postType: undefined,
    });
  });
});

describe("colonyGetPost", () => {
  it("returns full post details", async () => {
    const client = mockClient();
    const t = colonyGetPost(client);
    const result = await t.execute!({ postId: "p1" }, ctx);
    expect(client.getPost).toHaveBeenCalledWith("p1");
    expect((result as any).id).toBe("p1");
    expect((result as any).author.username).toBe("alice");
  });
});

describe("colonyGetComments", () => {
  it("iterates comments", async () => {
    const client = mockClient();
    const t = colonyGetComments(client);
    const result = await t.execute!({ postId: "p1", maxComments: 20 }, ctx);
    expect(client.iterComments).toHaveBeenCalledWith("p1", 20);
    expect((result as any).comments).toHaveLength(1);
    expect((result as any).comments[0]?.author).toBe("bob");
  });
});

describe("colonyCreatePost", () => {
  it("creates a post and returns its URL", async () => {
    const client = mockClient();
    const t = colonyCreatePost(client);
    const result = await t.execute!(
      { title: "Hello", body: "World", colony: "general", postType: "discussion" },
      ctx,
    );
    expect(client.createPost).toHaveBeenCalledWith("Hello", "World", {
      colony: "general",
      postType: "discussion",
    });
    expect((result as any).url).toContain("p2");
  });
});

describe("colonyCreateComment", () => {
  it("creates a comment with parentId", async () => {
    const client = mockClient();
    const t = colonyCreateComment(client);
    await t.execute!({ postId: "p1", body: "nice post", parentId: "c0" }, ctx);
    expect(client.createComment).toHaveBeenCalledWith("p1", "nice post", "c0");
  });
});

describe("colonySendMessage", () => {
  it("sends a DM", async () => {
    const client = mockClient();
    const t = colonySendMessage(client);
    const result = await t.execute!({ username: "alice", body: "hello" }, ctx);
    expect(client.sendMessage).toHaveBeenCalledWith("alice", "hello");
    expect((result as any).body).toBe("hello");
  });
});

describe("colonyGetUser", () => {
  it("looks up a user profile", async () => {
    const client = mockClient();
    const t = colonyGetUser(client);
    const result = await t.execute!({ userId: "u1" }, ctx);
    expect(client.getUser).toHaveBeenCalledWith("u1");
    expect((result as any).karma).toBe(42);
  });
});

describe("colonyDirectory", () => {
  it("calls client.directory with filters", async () => {
    const client = mockClient();
    const t = colonyDirectory(client);
    await t.execute!({ query: "research", userType: "agent", sort: "karma", limit: 10 }, ctx);
    expect(client.directory).toHaveBeenCalledWith({
      query: "research",
      userType: "agent",
      sort: "karma",
      limit: 10,
    });
  });
});

describe("colonyGetMe", () => {
  it("returns the agent's own profile", async () => {
    const client = mockClient();
    const t = colonyGetMe(client);
    const result = await t.execute!({}, ctx);
    expect(client.getMe).toHaveBeenCalled();
    expect((result as any).username).toBe("mybot");
  });
});

describe("colonyGetNotifications", () => {
  it("calls getNotifications with filters", async () => {
    const client = mockClient();
    const t = colonyGetNotifications(client);
    await t.execute!({ unreadOnly: true, limit: 5 }, ctx);
    expect(client.getNotifications).toHaveBeenCalledWith({ unreadOnly: true, limit: 5 });
  });

  it("passes through the comment preview and the DM's conversation and message ids", async () => {
    const actor = { id: "u-bob", username: "bob", display_name: "Bob", user_type: "agent" };
    const client = mockClient({
      getNotifications: vi.fn().mockResolvedValue([
        {
          id: "n1",
          notification_type: "reply",
          message: "Bob replied to your comment",
          actor,
          post_id: "p1",
          comment_id: "c9",
          conversation_id: null,
          message_id: null,
          comment_preview: {
            id: "c9",
            parent_id: "c1",
            created_at: "2026-11-18T16:00:00Z",
            excerpt: "I measured it again and…",
            truncated: true,
          },
          is_read: false,
          created_at: "2026-11-18T16:00:00Z",
        },
        {
          id: "n2",
          notification_type: "direct_message",
          message: "Bob: are you free at five?",
          actor,
          post_id: null,
          comment_id: null,
          conversation_id: "conv1",
          message_id: "m7",
          comment_preview: null,
          is_read: false,
          created_at: "2026-11-18T16:01:00Z",
        },
      ]),
    } as any);
    const result = await colonyGetNotifications(client).execute!({}, ctx);
    const [reply, dm] = (result as any).notifications;
    expect(reply).toMatchObject({
      type: "reply",
      actor: "bob",
      postId: "p1",
      commentId: "c9",
      commentPreview: { excerpt: "I measured it again and…", truncated: true },
      conversationId: null,
      messageId: null,
    });
    expect(dm).toMatchObject({
      type: "direct_message",
      message: "Bob: are you free at five?",
      actor: "bob",
      commentId: null,
      commentPreview: null,
      conversationId: "conv1",
      messageId: "m7",
    });
  });

  it("tells the model what the previews hold", () => {
    const { description } = colonyGetNotifications(mockClient());
    expect(description).toContain("up to 500 characters");
    expect(description).toContain("~80 characters");
    expect(description).toContain("colonyGetConversation");
  });
});

describe("colonyGetNotificationCount", () => {
  it("returns notification count", async () => {
    const client = mockClient();
    const t = colonyGetNotificationCount(client);
    const result = await t.execute!({}, ctx);
    expect(client.getNotificationCount).toHaveBeenCalled();
    expect((result as any).count).toBe(5);
  });
});

describe("colonyGetUnreadCount", () => {
  it("returns unread DM count", async () => {
    const client = mockClient();
    const t = colonyGetUnreadCount(client);
    const result = await t.execute!({}, ctx);
    expect(client.getUnreadCount).toHaveBeenCalled();
    expect((result as any).count).toBe(3);
  });
});

describe("colonyVotePost", () => {
  it("calls client.votePost with parsed int", async () => {
    const client = mockClient();
    const t = colonyVotePost(client);
    await t.execute!({ postId: "p1", value: "1" }, ctx);
    expect(client.votePost).toHaveBeenCalledWith("p1", 1);
  });
});

describe("colonyVoteComment", () => {
  it("calls client.voteComment", async () => {
    const client = mockClient();
    const t = colonyVoteComment(client);
    await t.execute!({ commentId: "c1", value: "-1" }, ctx);
    expect(client.voteComment).toHaveBeenCalledWith("c1", -1);
  });
});

describe("colonyReactPost", () => {
  it("calls client.reactPost", async () => {
    const client = mockClient();
    const t = colonyReactPost(client);
    await t.execute!({ postId: "p1", emoji: "fire" }, ctx);
    expect(client.reactPost).toHaveBeenCalledWith("p1", "fire");
  });
});

describe("colonyReactComment", () => {
  it("calls client.reactComment", async () => {
    const client = mockClient();
    const t = colonyReactComment(client);
    await t.execute!({ commentId: "c1", emoji: "heart" }, ctx);
    expect(client.reactComment).toHaveBeenCalledWith("c1", "heart");
  });
});

describe("colonyGetPoll", () => {
  it("calls client.getPoll", async () => {
    const client = mockClient();
    const t = colonyGetPoll(client);
    await t.execute!({ postId: "p1" }, ctx);
    expect(client.getPoll).toHaveBeenCalledWith("p1");
  });

  it("reads the snake_case fields the API sends", async () => {
    const client = mockClient({
      getPoll: vi.fn().mockResolvedValue({
        options: [],
        total_votes: 7,
        is_closed: true,
        closes_at: "2026-11-20T00:00:00Z",
        user_voted: true,
      }),
    } as any);
    const result = await colonyGetPoll(client).execute!({ postId: "p1" }, ctx);
    expect(result).toMatchObject({
      totalVotes: 7,
      isClosed: true,
      closesAt: "2026-11-20T00:00:00Z",
      userHasVoted: true,
    });
  });
});

describe("colonyVotePoll", () => {
  it("calls client.votePoll", async () => {
    const client = mockClient();
    const t = colonyVotePoll(client);
    await t.execute!({ postId: "p1", optionIds: ["o1"] }, ctx);
    expect(client.votePoll).toHaveBeenCalledWith("p1", ["o1"]);
  });
});

describe("colonyListConversations", () => {
  it("calls client.listConversations", async () => {
    const client = mockClient();
    const t = colonyListConversations(client);
    await t.execute!({}, ctx);
    expect(client.listConversations).toHaveBeenCalled();
  });

  it("reads the snake_case fields the API sends", async () => {
    const client = mockClient();
    const result = await colonyListConversations(client).execute!({}, ctx);
    expect((result as any).conversations[0]).toMatchObject({
      id: "conv1",
      otherUser: { username: "bob" },
      lastMessageAt: "2026-11-18T16:00:00Z",
      lastMessagePreview: "see you at five",
      unreadCount: 2,
      isArchived: false,
    });
  });

  it("says whether the preview was cut, and false when the server does not say", async () => {
    const client = mockClient({
      listConversations: vi.fn().mockResolvedValue([
        {
          id: "conv1",
          other_user: { username: "bob" },
          last_message_at: "2026-11-18T16:00:00Z",
          unread_count: 0,
          last_message_preview: "Here is the whole plan, step by step…",
          last_message_preview_truncated: true,
          is_archived: false,
        },
        {
          id: "conv2",
          other_user: { username: "carol" },
          last_message_at: "2026-11-18T15:00:00Z",
          unread_count: 0,
          last_message_preview: "ok",
          is_archived: false,
        },
      ]),
    } as any);
    const result = await colonyListConversations(client).execute!({}, ctx);
    const [cut, whole] = (result as any).conversations;
    expect(cut.lastMessagePreviewTruncated).toBe(true);
    expect(whole.lastMessagePreviewTruncated).toBe(false);
  });

  it("tells the model how long the preview is and where the whole message is", () => {
    const { description } = colonyListConversations(mockClient());
    expect(description).toContain("up to 120 characters");
    expect(description).toContain("lastMessagePreviewTruncated");
    expect(description).toContain("colonyGetConversation");
  });
});

describe("colonyGetConversation", () => {
  it("calls client.getConversation", async () => {
    const client = mockClient();
    const t = colonyGetConversation(client);
    await t.execute!({ username: "bob" }, ctx);
    expect(client.getConversation).toHaveBeenCalledWith("bob");
  });

  it("reads the snake_case fields the API sends", async () => {
    const client = mockClient();
    const result = await colonyGetConversation(client).execute!({ username: "bob" }, ctx);
    expect((result as any).otherUser).toEqual({ username: "bob" });
    expect((result as any).messages[0]).toMatchObject({
      id: "m1",
      isRead: true,
      createdAt: "2026-01-01",
    });
  });
});

describe("colonyFollow", () => {
  it("calls client.follow", async () => {
    const client = mockClient();
    const t = colonyFollow(client);
    await t.execute!({ userId: "u1" }, ctx);
    expect(client.follow).toHaveBeenCalledWith("u1");
  });
});

describe("colonyUnfollow", () => {
  it("calls client.unfollow", async () => {
    const client = mockClient();
    const t = colonyUnfollow(client);
    await t.execute!({ userId: "u1" }, ctx);
    expect(client.unfollow).toHaveBeenCalledWith("u1");
  });
});

describe("colonyListColonies", () => {
  it("calls client.getColonies", async () => {
    const client = mockClient();
    const t = colonyListColonies(client);
    const result = await t.execute!({}, ctx);
    expect(client.getColonies).toHaveBeenCalled();
    expect((result as any).colonies).toEqual([
      { name: "general", displayName: "General", description: "Main colony", memberCount: 100 },
    ]);
  });
});

describe("colonyIterPosts", () => {
  it("iterates posts with pagination", async () => {
    const client = mockClient();
    const t = colonyIterPosts(client);
    const result = await t.execute!({ colony: "general", sort: "top", maxResults: 10 }, ctx);
    expect(client.iterPosts).toHaveBeenCalledWith({
      colony: "general",
      sort: "top",
      postType: undefined,
      maxResults: 10,
    });
    expect((result as any).count).toBe(1);
    expect((result as any).posts[0]?.id).toBe("p1");
  });

  it("defaults to 50 when maxResults omitted", async () => {
    const client = mockClient();
    const t = colonyIterPosts(client);
    await t.execute!({}, ctx);
    expect(client.iterPosts).toHaveBeenCalledWith({
      colony: undefined,
      sort: "new",
      postType: undefined,
      maxResults: 50,
    });
  });
});

describe("colonyUpdatePost", () => {
  it("calls client.updatePost", async () => {
    const client = mockClient();
    const t = colonyUpdatePost(client);
    const result = await t.execute!({ postId: "p1", title: "Updated" }, ctx);
    expect(client.updatePost).toHaveBeenCalledWith("p1", { title: "Updated", body: undefined });
    expect((result as any).title).toBe("Updated");
  });
});

describe("colonyDeletePost", () => {
  it("calls client.deletePost", async () => {
    const client = mockClient();
    const t = colonyDeletePost(client);
    const result = await t.execute!({ postId: "p1" }, ctx);
    expect(client.deletePost).toHaveBeenCalledWith("p1");
    expect((result as any).success).toBe(true);
  });
});

describe("colonyMarkNotificationsRead", () => {
  it("calls client.markNotificationsRead", async () => {
    const client = mockClient();
    const t = colonyMarkNotificationsRead(client);
    const result = await t.execute!({}, ctx);
    expect(client.markNotificationsRead).toHaveBeenCalled();
    expect((result as any).success).toBe(true);
  });
});

describe("colonyJoinColony", () => {
  it("calls client.joinColony", async () => {
    const client = mockClient();
    const t = colonyJoinColony(client);
    await t.execute!({ colony: "crypto" }, ctx);
    expect(client.joinColony).toHaveBeenCalledWith("crypto");
  });
});

describe("colonyLeaveColony", () => {
  it("calls client.leaveColony", async () => {
    const client = mockClient();
    const t = colonyLeaveColony(client);
    await t.execute!({ colony: "crypto" }, ctx);
    expect(client.leaveColony).toHaveBeenCalledWith("crypto");
  });
});

// ── Error handling ───────────────────────────────────────────────

describe("safeExecute error handling", () => {
  it("returns error object on ColonyRateLimitError", async () => {
    const err = new ColonyRateLimitError("rate limited", 429, {}, "RATE_LIMITED", 30);
    const client = mockClient({ search: vi.fn().mockRejectedValue(err) } as any);
    const t = colonySearch(client);
    const result = await t.execute!({ query: "test" }, ctx);
    expect((result as any).error).toContain("Rate limited");
    expect((result as any).retryAfter).toBe(30);
  });
});

// ── MCP annotations ──────────────────────────────────────────────

describe("MCP annotations", () => {
  it("read-only tools have readOnlyHint: true", () => {
    const client = mockClient();
    const t = colonySearch(client);
    expect((t as any).mcp?.annotations?.readOnlyHint).toBe(true);
  });

  it("write tools have readOnlyHint: false", () => {
    const client = mockClient();
    const t = colonyCreatePost(client);
    expect((t as any).mcp?.annotations?.readOnlyHint).toBe(false);
  });

  it("delete tool has destructiveHint: true", () => {
    const client = mockClient();
    const t = colonyDeletePost(client);
    expect((t as any).mcp?.annotations?.destructiveHint).toBe(true);
  });
});

// ── System prompt ────────────────────────────────────────────────

describe("colonySystemPrompt", () => {
  it("returns a string containing the agent username", async () => {
    const client = mockClient();
    const prompt = await colonySystemPrompt(client);
    expect(typeof prompt).toBe("string");
    expect(prompt).toContain("mybot");
  });
});
