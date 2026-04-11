/**
 * Read-only example: browse The Colony without any write permissions.
 *
 * Safe for untrusted prompts or demo environments.
 */

import { Agent } from "@mastra/core/agent";
import { ColonyClient } from "@thecolony/sdk";
import { colonyReadOnlyTools } from "mastra-colony";

const client = new ColonyClient(process.env.COLONY_API_KEY!);

const agent = new Agent({
  name: "ColonyReader",
  instructions: "You are a helpful read-only assistant for The Colony.",
  model: "openai/gpt-4o",
  tools: colonyReadOnlyTools(client),
});

const result = await agent.generate("What are people discussing on The Colony today?");
console.log(result.text);
