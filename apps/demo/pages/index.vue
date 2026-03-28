<template>
  <div class="mx-auto h-full w-full max-w-3xl flex flex-col items-center justify-center gap-3">
    <UCard class="w-full overflow-hidden">
      <template #header>
        <div class="flex items-center justify-between">
          <span data-testid="chat-title" class="text-lg font-semibold">json-render-nuxt-ui</span>
        </div>
      </template>

      <UChatMessages
        class="mb-4"
        :messages="greetingMessages"
        status="ready"
        :auto-scroll="false"
        :should-scroll-to-bottom="false"
        :ui="{ root: 'w-full flex-none px-0 gap-1' }"
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

      <div
        data-testid="starter-chips"
        class="-mt-8 mb-8 ml-2 flex flex-wrap items-center gap-2"
      >
        <button
          v-for="(starter, idx) in starterPrompts"
          :key="starter.label"
          :data-testid="`starter-chip-${idx}`"
          type="button"
          class="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-muted px-3 py-1.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-default disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isGenerating"
          @click="useStarterPrompt(starter.prompt)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="h-3 w-3"
            aria-hidden="true"
          >
            <path
              d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
            />
            <path d="M20 2v4" />
            <path d="M22 4h-4" />
            <circle cx="4" cy="20" r="2" />
          </svg>
          {{ starter.label }}
        </button>
      </div>

      <div class="flex flex-col">
        <div data-testid="chat-prompt" class="shrink-0">
          <PromptInput
            v-model="input"
            :error="uiError"
            autofocus
            :disabled="isGenerating"
            :status="chatStatus"
            :selected-model="selectedModel"
            :selected-model-icon="selectedModelIcon"
            :available-models="availableModels"
            :is-model-locked="isModelLocked"
            @update:selected-model="selectedModel = $event"
            @submit="onSubmit"
          />
        </div>
      </div>
    </UCard>

    <p
      v-if="isModelLocked"
      data-testid="enforced-model-notice"
      class="text-center text-sm text-warning"
    >
      This demo uses a basic LLM model and may show degraded results.
      <br/>
      Run it locally with your own API key for the best experience.
    </p>
  </div>
</template>

<script setup lang="ts">
import { isTextUIPart } from "ai";
import type { DemoChatMessage } from "~/composables/useChatSession";

const {
  selectedModel,
  selectedModelIcon,
  isModelLocked,
  availableModels,
  pendingPrompt,
  reset,
} = useChatSession();

const { isGenerating, uiError } = useJsonRender();

const router = useRouter();
const input = ref("");

const chatStatus = computed(() => (isGenerating.value ? "submitted" : "ready"));

const greetingMessages: DemoChatMessage[] = [
  {
    id: "assistant-greeting",
    role: "assistant",
    parts: [{ type: "text", text: "What can I build for you today?" }],
  },
];

const starterPrompts = [
  {
    label: "Project Status Board",
    prompt: "Create a simple project status dashboard with progress stats.",
  },
  {
    label: "Workout Planner",
    prompt: "Build a weekly workout planner with three focus days.",
  },
  {
    label: "Launch Checklist",
    prompt: "Design a launch checklist with priorities and due dates.",
  },
];

function useStarterPrompt(prompt: string) {
  if (isGenerating.value) return;
  input.value = prompt;
  onSubmit();
}

function onSubmit() {
  const text = input.value.trim();
  if (!text || isGenerating.value) return;

  reset();
  pendingPrompt.value = text;
  input.value = "";
  router.push("/chat");
}
</script>
