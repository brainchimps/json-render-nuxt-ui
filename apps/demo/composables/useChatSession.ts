import {
  ALLOWED_CHAT_MODELS,
  OPENAI_ICON,
  type ChatModelOption,
} from "~/shared/models";

export type DemoChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: Array<{ type: "text"; text: string }>;
};

/**
 * SSR-safe shared state for the chat session.
 * Survives client-side navigation between the landing page and chat page.
 */
export function useChatSession() {
  const runtimeConfig = useRuntimeConfig();
  const lockedModel = runtimeConfig.public.enforcedAiModel?.trim();
  const imprintUrl = runtimeConfig.public.imprintUrl as string;
  const privacyPolicyUrl = runtimeConfig.public.privacyPolicyUrl as string;

  const isModelLocked = computed(() => Boolean(lockedModel));

  const availableModels = computed<ChatModelOption[]>(() => {
    if (lockedModel) {
      return [{ label: lockedModel, value: lockedModel, icon: OPENAI_ICON }];
    }
    return ALLOWED_CHAT_MODELS;
  });

  const selectedModel = useState(
    "chat-selected-model",
    () => availableModels.value[0]?.value ?? "openai/gpt-5.3-codex",
  );

  const selectedModelIcon = computed(() => {
    return (
      availableModels.value.find((m) => m.value === selectedModel.value)?.icon ??
      OPENAI_ICON
    );
  });

  const chatMessages = useState<DemoChatMessage[]>("chat-messages", () => []);
  const lastSubmittedPrompt = useState<string | null>(
    "chat-last-prompt",
    () => null,
  );

  /** Set by the landing page so the chat page can pick it up after navigation. */
  const pendingPrompt = useState<string | null>(
    "chat-pending-prompt",
    () => null,
  );

  const hasMessages = computed(() => chatMessages.value.length > 0);

  function addUserMessage(text: string) {
    chatMessages.value.push({
      id: `user-${Date.now()}-${chatMessages.value.length}`,
      role: "user",
      parts: [{ type: "text", text }],
    });
  }

  function addAssistantMessage(text: string) {
    chatMessages.value.push({
      id: `assistant-${Date.now()}-${chatMessages.value.length}`,
      role: "assistant",
      parts: [{ type: "text", text }],
    });
  }

  function reset() {
    chatMessages.value = [];
    lastSubmittedPrompt.value = null;
    pendingPrompt.value = null;
  }

  return {
    selectedModel,
    selectedModelIcon,
    isModelLocked,
    availableModels,
    chatMessages,
    lastSubmittedPrompt,
    pendingPrompt,
    hasMessages,
    imprintUrl,
    privacyPolicyUrl,
    addUserMessage,
    addAssistantMessage,
    reset,
  };
}
