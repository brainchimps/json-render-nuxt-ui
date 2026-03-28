import { isAllowedChatModel } from "../../shared/models";

export function getEnforcedModelOverride(): string | undefined {
  const model = process.env.ENFORCE_AI_MODEL?.trim();
  return model || undefined;
}

export function resolveGatewayModel(requestedModel: string): string {
  const envOverride = getEnforcedModelOverride();
  if (envOverride) {
    if (!isAllowedChatModel(envOverride)) {
      throw new Error(
        `Invalid ENFORCE_AI_MODEL "${envOverride}". It must match one of the allowed models.`
      );
    }
    return envOverride;
  }

  const requested = requestedModel.trim();
  if (!isAllowedChatModel(requested)) {
    throw new Error(
      `Invalid model "${requested}". Please choose a supported model from the selector.`
    );
  }

  return requested;
}

export function getGatewayApiKey(): string {
  const key = process.env.AI_GATEWAY_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing AI_GATEWAY_API_KEY. Add it to apps/demo/.env before running chat."
    );
  }
  return key;
}
