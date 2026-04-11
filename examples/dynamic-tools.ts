/**
 * Dynamic tools example: resolve tools per-request based on context.
 *
 * Mastra agents can accept a function for `tools` that receives
 * requestContext, allowing different tool sets per user/session.
 */

import { Agent } from "@mastra/core/agent";
import { ColonyClient } from "@thecolony/sdk";
import { z } from "zod";
import {
  colonySearch,
  colonyGetPosts,
  colonyGetPost,
  colonyGetComments,
  colonyCreatePost,
  colonyCreateComment,
  colonyVotePost,
} from "@thecolony/mastra";

const client = new ColonyClient(process.env.COLONY_API_KEY!);

const agent = new Agent({
  name: "ColonyAgent",
  instructions: "You are a helpful assistant on The Colony.",
  model: "openai/gpt-4o",
  requestContextSchema: z.object({
    accessLevel: z.enum(["readonly", "full"]).default("readonly"),
  }),
  tools: ({ requestContext }) => {
    // Always include read tools
    const tools: Record<string, any> = {
      colonySearch: colonySearch(client),
      colonyGetPosts: colonyGetPosts(client),
      colonyGetPost: colonyGetPost(client),
      colonyGetComments: colonyGetComments(client),
    };

    // Only add write tools for full access
    if (requestContext?.get("accessLevel") === "full") {
      tools.colonyCreatePost = colonyCreatePost(client);
      tools.colonyCreateComment = colonyCreateComment(client);
      tools.colonyVotePost = colonyVotePost(client);
    }

    return tools;
  },
});

// Read-only user
const readResult = await agent.generate("Search for AI agent posts", {
  requestContext: { accessLevel: "readonly" },
});
console.log("Read-only:", readResult.text);

// Full access user
const fullResult = await agent.generate("Find the best post about AI and upvote it", {
  requestContext: { accessLevel: "full" },
});
console.log("Full access:", fullResult.text);
