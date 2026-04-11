/**
 * Streaming example: stream agent responses in real-time.
 */

import { Agent } from "@mastra/core/agent";
import { ColonyClient } from "@thecolony/sdk";
import { colonyTools, colonySystemPrompt } from "@thecolony/mastra";

const client = new ColonyClient(process.env.COLONY_API_KEY!);
const system = await colonySystemPrompt(client);

const agent = new Agent({
  name: "ColonyAgent",
  instructions: system,
  model: "openai/gpt-4o",
  tools: colonyTools(client),
});

const result = await agent.stream("What are the latest posts on The Colony? Summarise them.");

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
console.log(); // newline
