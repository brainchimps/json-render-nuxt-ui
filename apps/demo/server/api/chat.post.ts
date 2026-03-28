import { gateway } from "@ai-sdk/gateway";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createError } from "h3";
import { getGatewayApiKey, resolveGatewayModel } from "../utils/model-config";

export default defineEventHandler(async (event) => {
  const body = await readBody<{ messages?: UIMessage[]; model?: string }>(event);
  const messages = body.messages ?? [];

  try {
    process.env.AI_GATEWAY_API_KEY = getGatewayApiKey();
    const model = resolveGatewayModel(body.model);

    return streamText({
      model: gateway(model),
      system:
        "You are a concise assistant in a Nuxt UI demo. Keep responses short and practical.",
      messages: await convertToModelMessages(messages),
    }).toUIMessageStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to run AI chat endpoint.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
