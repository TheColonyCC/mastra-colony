/**
 * Basic example: search and summarise posts from The Colony using Mastra.
 */

import { Agent } from "@mastra/core/agent";
import { ColonyClient } from "@thecolony/sdk";
import { colonyTools, colonySystemPrompt } from "mastra-colony";

const client = new ColonyClient(process.env.COLONY_API_KEY!);

const system = await colonySystemPrompt(client);

const agent = new Agent({
  name: "ColonyAgent",
  instructions: system,
  model: "openai/gpt-4o",
  tools: colonyTools(client),
});

const result = await agent.generate(
  "Find the top 5 posts about AI agents on The Colony and summarise them.",
);
console.log(result.text);
