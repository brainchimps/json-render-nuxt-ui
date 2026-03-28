import { isNonEmptySpec } from "@json-render/core";
import { useUIStream } from "@json-render/vue";
import { registry } from "~/shared/json-render-registry";

function getGenerationErrorDescription(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("AI_GATEWAY_API_KEY")) {
    return "Add AI_GATEWAY_API_KEY to apps/demo/.env";
  }
  return "UI generation failed. Please try again.";
}

export function useJsonRender() {
  const toast = useToast();

  const ui = useUIStream({
    api: "/api/generate",
    onError(error) {
      toast.add({
        title: "Generation unavailable",
        description: getGenerationErrorDescription(error),
        color: "error",
      });
    },
  });

  const isGenerating = computed(() => ui.isStreaming.value);
  const uiError = computed(() => ui.error.value ?? undefined);
  const renderedSpec = computed(() => ui.spec.value);
  const hasRenderedSpec = computed(() => isNonEmptySpec(renderedSpec.value));

  return {
    registry,
    renderedSpec,
    hasRenderedSpec,
    isGenerating,
    uiError,
    send: ui.send,
  };
}
