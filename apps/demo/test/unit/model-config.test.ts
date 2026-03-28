import { afterEach, describe, expect, it } from "vitest";
import {
  getEnforcedModelOverride,
  resolveGatewayModel,
} from "../../server/utils/model-config";
import { ALLOWED_CHAT_MODELS } from "../../shared/models";

describe("gateway model config", () => {
  const original = process.env.ENFORCE_AI_MODEL;

  afterEach(() => {
    process.env.ENFORCE_AI_MODEL = original;
  });

  it("returns ENFORCE_AI_MODEL override when set to allowed model", () => {
    process.env.ENFORCE_AI_MODEL = "anthropic/claude-opus-4.6";
    expect(getEnforcedModelOverride()).toBe("anthropic/claude-opus-4.6");
    expect(resolveGatewayModel("openai/gpt-5.4-nano")).toBe(
      "anthropic/claude-opus-4.6"
    );
  });

  it("uses first allowlisted model when no model is provided", () => {
    delete process.env.ENFORCE_AI_MODEL;
    expect(resolveGatewayModel()).toBe(ALLOWED_CHAT_MODELS[0]?.value);
  });

  it("accepts a valid selected model", () => {
    delete process.env.ENFORCE_AI_MODEL;
    expect(resolveGatewayModel("openai/gpt-5.4-nano")).toBe(
      "openai/gpt-5.4-nano"
    );
  });

  it("enforces ENFORCE_AI_MODEL over user-picked model", () => {
    process.env.ENFORCE_AI_MODEL = "anthropic/claude-opus-4.6";
    expect(resolveGatewayModel("openai/gpt-5.4-nano")).toBe(
      "anthropic/claude-opus-4.6"
    );
  });

  it("rejects invalid ENFORCE_AI_MODEL values", () => {
    process.env.ENFORCE_AI_MODEL = "custom/model-from-env";
    expect(() => resolveGatewayModel("openai/gpt-5.4-nano")).toThrow(
      /Invalid ENFORCE_AI_MODEL/
    );
  });

  it("rejects an invalid selected model", () => {
    delete process.env.ENFORCE_AI_MODEL;
    expect(() => resolveGatewayModel("invalid-model")).toThrow(
      /Invalid model/
    );
  });

  it("rejects legacy alias model ids", () => {
    delete process.env.ENFORCE_AI_MODEL;
    expect(() => resolveGatewayModel("gpt-5.3-codex")).toThrow(/Invalid model/);
    expect(() => resolveGatewayModel("GPT-5.3-Codex")).toThrow(
      /Invalid model/
    );
  });
});
