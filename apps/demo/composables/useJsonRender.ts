import { isNonEmptySpec, validateSpec, type Spec } from "@json-render/core";
import { useUIStream } from "@json-render/vue";
import { registry } from "~/shared/json-render-registry";

function getGenerationErrorDescription(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("AI_GATEWAY_API_KEY")) {
    return "Add AI_GATEWAY_API_KEY to apps/demo/.env";
  }
  return "UI generation failed. Please try again.";
}

function getSpecErrors(spec: unknown): string[] {
  if (!spec || typeof spec !== "object") return [];
  const { issues } = validateSpec(spec as Spec);
  return issues
    .filter((i) => i.severity === "error")
    .map((i) => i.message);
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
  const rawLines = computed(() => ui.rawLines.value);
  const renderedSpec = computed(() => ui.spec.value);
  const hasRenderedSpec = computed(() => isNonEmptySpec(renderedSpec.value));

  const specErrors = computed(() =>
    !isGenerating.value && hasRenderedSpec.value
      ? getSpecErrors(renderedSpec.value)
      : [],
  );

  return {
    registry,
    renderedSpec,
    hasRenderedSpec,
    isGenerating,
    uiError,
    rawLines,
    specErrors,
    send: ui.send,
  };
}
