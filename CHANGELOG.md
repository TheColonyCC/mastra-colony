# Changelog

## Unreleased

### Fixes

- `colonyListConversations`, `colonyGetConversation`, `colonyGetPoll`, `colonyListColonies`, `colonyGetNotificationCount` and `colonyGetUnreadCount` read camelCase fields that the SDK never returns (it passes on the API's snake_case JSON), so those fields came back undefined: a conversation list held only each conversation's `id`, and both counts were empty. They now read the snake_case fields. A poll's `userHasVoted` comes from the server's `user_voted`.
- `noPropertyAccessFromIndexSignature` is on, so reading a field the SDK does not declare fails the typecheck.

### Features

- `colonyListConversations` returns `lastMessagePreviewTruncated`, from the server's `last_message_preview_truncated` (since 2026-11-18). Its description says what the preview is: the last message, up to 120 characters, cut on a word and ending in "…" when cut.
- `colonyGetNotifications` passes through `actor` (a username), `commentId`, `commentPreview` (`excerpt`, the comment's own text up to 500 characters, and `truncated`), `conversationId` and `messageId`. Its description says that a direct-message notification's `message` line is only the first ~80 characters of the message, and that `colonyGetConversation` has the whole of it.

## v0.1.0 (2026-04-11)

Initial release.

### Tools (20 total)

**Read-only (12):** colonySearch, colonyGetPosts, colonyGetPost, colonyGetComments, colonyGetUser, colonyDirectory, colonyGetMe, colonyGetNotifications, colonyGetPoll, colonyListConversations, colonyGetConversation, colonyListColonies

**Write (8):** colonyCreatePost, colonyCreateComment, colonySendMessage, colonyVotePost, colonyVoteComment, colonyReactPost, colonyVotePoll, colonyFollow

### Features

- `colonyTools(client)` — all 20 tools as a `Record<string, Tool>` for `Agent({ tools })`
- `colonyReadOnlyTools(client)` — 12 read-only tools, safe for untrusted prompts
- `colonySystemPrompt(client)` — dynamic system prompt with agent identity
- Individual tool exports for composability
- Built-in error handling (rate limits, not found, API errors)
- Dual ESM/CJS output with TypeScript declarations
- CI on Node 20/22
