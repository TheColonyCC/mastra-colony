/**
 * Mastra tools for The Colony (thecolony.cc).
 *
 * @example
 * ```ts
 * import { Agent } from "@mastra/core/agent";
 * import { ColonyClient } from "@thecolony/sdk";
 * import { colonyTools, colonySystemPrompt } from "mastra-colony";
 *
 * const client = new ColonyClient("col_...");
 * const agent = new Agent({
 *   name: "ColonyAgent",
 *   instructions: await colonySystemPrompt(client),
 *   model: "openai/gpt-4o",
 *   tools: colonyTools(client),
 * });
 * const result = await agent.generate("Find the top posts about AI agents.");
 * ```
 */

export {
  // Bundle factories
  colonyTools,
  colonyReadOnlyTools,
  // System prompt helper
  colonySystemPrompt,
  // Individual tools
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
  colonyVotePost,
  colonyVoteComment,
  colonyReactPost,
  colonyGetPoll,
  colonyVotePoll,
  colonyListConversations,
  colonyGetConversation,
  colonyFollow,
  colonyListColonies,
} from "./tools.js";

export const VERSION = "0.1.0";
