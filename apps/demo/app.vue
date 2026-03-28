<template>
  <UApp>
    <div class="min-h-screen flex items-center justify-center px-4">
      <UContainer class="w-full max-w-3xl">
        <UCard class="overflow-hidden">
          <template #header>
            <h1 data-testid="chat-title" class="text-lg font-semibold">
              <code>json-render-nuxt-ui</code>
            </h1>
          </template>
          <p class="text-sm text-muted mb-4">
            {{ greeting }}
          </p>

          <div
            :class="
              hasMessages
                ? 'flex h-[60vh] min-h-96 max-h-[70vh] flex-col'
                : 'flex flex-col'
            "
          >
            <div
              data-testid="chat-messages"
              v-show="hasMessages"
              class="flex-1 min-h-0 overflow-hidden"
            >
              <UChatMessages
                class="h-full overflow-y-auto pr-1"
                :messages="chat.messages"
                :status="chat.status"
              >
                <template #content="{ message }">
                  <template
                    v-for="(part, index) in message.parts"
                    :key="`${message.id}-${part.type}-${index}`"
                  >
                    <p
                      v-if="isTextUIPart(part)"
                      class="whitespace-pre-wrap wrap-break-word"
                    >
                      {{ part.text }}
                    </p>
                  </template>
                </template>
              </UChatMessages>
            </div>

            <div data-testid="chat-prompt" class="mt-4 shrink-0">
              <UChatPrompt
                variant="subtle"
                v-model="input"
                :error="chat.error"
                autofocus
                @submit="onSubmit"
              >
                <template #footer>
                  <USelect
                    v-model="selectedModel"
                    :items="availableModels"
                    :icon="selectedModelIcon"
                    variant="ghost"
                    :disabled="isModelLocked"
                    :ui="{ base: 'w-56' }"
                    placeholder="Select a model"
                  />
                </template>
                <UChatPromptSubmit
                  :status="chat.status"
                  @stop="chat.stop()"
                  @reload="chat.regenerate()"
                />
              </UChatPrompt>
            </div>
          </div>
        </UCard>
      </UContainer>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { Chat } from "@ai-sdk/vue";
import { DefaultChatTransport, isTextUIPart } from "ai";
import { helloWord } from "json-render-nuxt-ui";
import {
  ALLOWED_CHAT_MODELS,
  OPENAI_ICON,
  type ChatModelOption,
} from "~/shared/models";

const greeting = helloWord();
const input = ref("");
const toast = useToast();
const runtimeConfig = useRuntimeConfig();
const lockedModel = runtimeConfig.public.enforcedAiModel?.trim();
const isModelLocked = computed(() => Boolean(lockedModel));

const availableModels = computed<ChatModelOption[]>(() => {
  if (lockedModel) {
    return [{ label: lockedModel, value: lockedModel, icon: OPENAI_ICON }];
  }
  return ALLOWED_CHAT_MODELS;
});

const selectedModel = ref(
  availableModels.value[0]?.value ?? "openai/gpt-5.3-codex"
);
const selectedModelIcon = computed(() => {
  return (
    availableModels.value.find((model) => model.value === selectedModel.value)
      ?.icon ?? OPENAI_ICON
  );
});
const hasMessages = computed(() => chat.messages.length > 0);

function getChatErrorDescription(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("AI_GATEWAY_API_KEY")) {
    return "Add AI_GATEWAY_API_KEY to apps/demo/.env";
  }

  return "Chat request failed. Please try again.";
}

const chat = new Chat({
  transport: new DefaultChatTransport({ api: "/api/chat" }),
  onError(error) {
    toast.add({
      title: "Chat unavailable",
      description: getChatErrorDescription(error),
      color: "error",
    });
  },
});

function onSubmit() {
  const text = input.value.trim();
  if (!text) return;

  chat.sendMessage({ text }, { body: { model: selectedModel.value } });
  input.value = "";
}
</script>
