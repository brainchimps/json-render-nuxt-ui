import { buildUserPrompt, type Spec } from "@json-render/core";
import { gateway } from "@ai-sdk/gateway";
import { streamText } from "ai";
import { createError } from "h3";
import { catalog } from "~/shared/json-render-catalog";
import { getGatewayApiKey, resolveGatewayModel } from "../utils/model-config";

type GenerateBody = {
  prompt?: string;
  model?: string;
  currentSpec?: unknown;
};

export default defineEventHandler(async (event) => {
  const body = await readBody<GenerateBody>(event);
  const prompt = body.prompt?.trim();

  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Prompt is required.",
    });
  }

  try {
    process.env.AI_GATEWAY_API_KEY = getGatewayApiKey();
    
    const model = resolveGatewayModel(body.model);

    const system = catalog.prompt();
    const userPrompt = buildUserPrompt({
      prompt,
      currentSpec: (body.currentSpec as Spec | null | undefined) ?? null,
    });

    return streamText({
      model: gateway(model),
      system,
      prompt: userPrompt,
    }).toTextStreamResponse();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to run UI generation endpoint.";
    throw createError({ statusCode: 500, statusMessage: message });
  }
});
