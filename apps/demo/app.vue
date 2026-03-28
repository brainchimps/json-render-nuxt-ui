<template>
  <UApp>
    <div class="h-dvh overflow-hidden px-4 py-4 lg:px-6 flex flex-col">
      <div :class="containerClasses" class="min-h-0 flex-1">
        <div :class="layoutClasses">
          <UCard :class="chatCardClasses" :ui="chatCardUi">
          <template #header>
            <!-- Mobile drawer handle (split view only) -->
            <div v-if="showSplitView" class="flex items-center justify-between lg:hidden">
              <button
                type="button"
                class="flex items-center gap-1.5 text-muted hover:text-default transition-colors"
                @click="toggleChatDrawer"
              >
                <UIcon
                  :name="chatExpanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
                  class="size-4"
                />
                <span class="text-sm font-medium">Chat</span>
              </button>
              <div class="flex items-center gap-2">
                <UBadge
                  v-if="chatMessages.length"
                  :label="`${chatMessages.length}`"
                  size="xs"
                  variant="subtle"
                />
                <UButton
                  class="-my-1"
                  :icon="showOpsPanel ? 'i-lucide-code-xml' : 'i-lucide-code-xml'"
                  :color="showOpsPanel ? 'primary' : 'neutral'"
                  :variant="showOpsPanel ? 'soft' : 'ghost'"
                  size="xs"
                  aria-label="Toggle JSONL debug"
                  @click="toggleOpsPanel"
                />
              </div>
            </div>
            <!-- Desktop / initial state header -->
            <div
              class="items-center justify-between"
              :class="showSplitView ? 'hidden lg:flex' : 'flex'"
            >
              <span
                data-testid="chat-title"
                :class="showSplitView ? 'text-sm! font-medium!' : 'text-lg font-semibold'"
              >json-render-nuxt-ui</span>
              <UButton
                v-if="showSplitView"
                class="-my-1"
                :icon="showOpsPanel ? 'i-lucide-code-xml' : 'i-lucide-code-xml'"
                :color="showOpsPanel ? 'primary' : 'neutral'"
                :variant="showOpsPanel ? 'soft' : 'ghost'"
                size="xs"
                aria-label="Toggle JSONL debug"
                @click="toggleOpsPanel"
              />
            </div>
          </template>
          <div :class="chatContentClasses">
          <UChatMessages
            v-if="!hasMessages"
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
            v-if="!hasMessages"
            data-testid="starter-chips"
            class="-mt-8 mb-8 ml-2 flex flex-wrap items-center gap-2"
          >
            <button
              v-for="(starter, index) in starterPrompts"
              :key="starter.label"
              :data-testid="`starter-chip-${index}`"
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

          <div :class="chatBodyClasses">
            <div
              data-testid="chat-messages"
              class="min-h-0 overflow-y-auto -mr-4 sm:-mr-6"
              :class="{
                'hidden': !hasMessages || (showSplitView && !chatExpanded),
                'lg:block!': showSplitView && !chatExpanded && hasMessages
              }"
            >
              <UChatMessages
                class="pr-4 sm:pr-6"
                :messages="chatMessages"
                :status="chatStatus"
                should-auto-scroll
                :ui="{
                  viewport: 'sticky top-auto bottom-2 z-10 flex justify-center pointer-events-none',
                  autoScroll: 'static right-auto translate-x-0 rounded-full pointer-events-auto',
                }"
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
                <template #indicator>
                  <UButton
                    class="px-0"
                    color="neutral"
                    variant="link"
                    loading
                    label="Generating UI..."
                  />
                </template>
              </UChatMessages>
            </div>

            <div data-testid="chat-prompt" class="shrink-0">
              <UChatPrompt
                variant="subtle"
                v-model="input"
                :error="uiError"
                autofocus
                @submit="onSubmit"
              >
                <template #footer>
                  <USelect
                    v-model="selectedModel"
                    :items="availableModels"
                    :icon="selectedModelIcon"
                    variant="ghost"
                    :disabled="isModelLocked || isGenerating"
                    :ui="{ base: 'w-56' }"
                    placeholder="Select a model"
                  />
                </template>
                <UChatPromptSubmit
                  :status="chatStatus"
                  @reload="onReload"
                />
              </UChatPrompt>
            </div>
          </div>
          </div>
          </UCard>

          <!-- Desktop-only: JSONL debug pane (middle column) -->
          <UCard
            v-if="showSplitView && showOpsPanel"
            data-testid="debug-panel"
            class="order-1 min-h-0 flex-col overflow-hidden lg:order-2 hidden lg:flex"
            :ui="{ body: 'flex-1 min-h-0 flex flex-col' }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">JSONL Stream</span>
                <UBadge v-if="rawLines.length" :label="`${rawLines.length} ops`" size="xs" variant="subtle" />
              </div>
            </template>
            <JsonlViewer :lines="rawLines" />
          </UCard>

          <!-- Render / debug panel -->
          <UCard
            v-if="showSplitView"
            data-testid="render-panel"
            class="order-1 flex min-h-0 flex-col overflow-hidden"
            :class="showOpsPanel ? 'lg:order-3' : 'lg:order-2'"
            :ui="{ body: 'flex-1 flex flex-col min-h-0 overflow-hidden' }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Rendered UI</span>
                <div v-if="showOpsPanel" class="flex items-center gap-1 lg:hidden">
                  <UButton
                    size="xs"
                    :variant="activeRenderTab === 'ui' ? 'soft' : 'ghost'"
                    :color="activeRenderTab === 'ui' ? 'primary' : 'neutral'"
                    label="UI"
                    @click="activeRenderTab = 'ui'"
                  />
                  <UButton
                    size="xs"
                    :variant="activeRenderTab === 'jsonl' ? 'soft' : 'ghost'"
                    :color="activeRenderTab === 'jsonl' ? 'primary' : 'neutral'"
                    label="JSONL"
                    @click="activeRenderTab = 'jsonl'"
                  />
                </div>
              </div>
            </template>

            <!-- UI view (wrapped in div — JSONUIProvider renders a fragment so v-show can't hide it) -->
            <div
              class="flex-1 flex-col min-h-0"
              :class="showOpsPanel && activeRenderTab === 'jsonl' ? 'hidden lg:flex!' : 'flex'"
            >
              <JSONUIProvider
                :registry="registry"
                :initial-state="{}"
                class="flex flex-1 flex-col min-h-0"
              >
                <div v-if="hasRenderedSpec" class="flex min-h-full items-center justify-center p-4">
                  <Renderer :spec="renderedSpec" :registry="registry" />
                </div>
                <div v-else class="flex flex-1 flex-col items-center justify-center gap-3 text-muted">
                  <template v-if="isGenerating">
                    <UIcon name="i-lucide-loader" class="size-6 animate-spin" />
                    <p class="text-sm">Generating UI&hellip;</p>
                  </template>
                  <template v-else>
                    <UIcon name="i-lucide-sparkles" class="size-6" />
                    <p class="text-sm text-center">Ask the AI to generate something<br>and it will appear here.</p>
                  </template>
                </div>
              </JSONUIProvider>
            </div>

            <!-- Mobile-only: JSONL view (tab-swap inside render card) -->
            <JsonlViewer
              v-if="showOpsPanel && activeRenderTab === 'jsonl'"
              :lines="rawLines"
              class="lg:hidden"
            />
          </UCard>
        </div>
      </div>
      <footer class="shrink-0 flex justify-center gap-2 pt-4 text-xs text-muted">
        <span>from <a href="https://brainchimps.com" target="_blank" rel="noopener" class="hover:text-default transition-colors underline decoration-dotted underline-offset-2 decoration-muted/50">Brainchimps</a> with 🥨</span>
        <span v-if="imprintUrl || privacyPolicyUrl" class="select-none">&middot;</span>
        <a v-if="imprintUrl" :href="imprintUrl" target="_blank" rel="noopener" class="hover:text-default transition-colors">Imprint</a>
        <span v-if="imprintUrl && privacyPolicyUrl" class="select-none">&middot;</span>
        <a v-if="privacyPolicyUrl" :href="privacyPolicyUrl" target="_blank" rel="noopener" class="hover:text-default transition-colors">Privacy Policy</a>
      </footer>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { JSONUIProvider, Renderer } from "@json-render/vue";
import { isTextUIPart } from "ai";
import {
  ALLOWED_CHAT_MODELS,
  OPENAI_ICON,
  type ChatModelOption,
} from "~/shared/models";

const { registry, renderedSpec, hasRenderedSpec, isGenerating, uiError, rawLines, send } =
  useJsonRender();

const showOpsPanel = ref(false);
type RenderTab = "ui" | "jsonl";
const activeRenderTab = ref<RenderTab>("ui");

function toggleOpsPanel() {
  showOpsPanel.value = !showOpsPanel.value;
  activeRenderTab.value = showOpsPanel.value ? "jsonl" : "ui";
}

const chatExpanded = ref(false);

function toggleChatDrawer() {
  chatExpanded.value = !chatExpanded.value;
}

const greeting = "What can I build for you today?";
type DemoChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: Array<{ type: "text"; text: string }>;
};

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
const input = ref("");
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

const selectedModel = ref(
  availableModels.value[0]?.value ?? "openai/gpt-5.3-codex"
);
const selectedModelIcon = computed(() => {
  return (
    availableModels.value.find((model) => model.value === selectedModel.value)
      ?.icon ?? OPENAI_ICON
  );
});

const chatStatus = computed(() => (isGenerating.value ? "submitted" : "ready"));
const greetingMessages = computed<DemoChatMessage[]>(() => [
  {
    id: "assistant-greeting",
    role: "assistant",
    parts: [{ type: "text", text: greeting }],
  },
]);

const chatMessages = ref<DemoChatMessage[]>([]);
const hasMessages = computed(() => chatMessages.value.length > 0);
const showSplitView = computed(() => hasMessages.value);
const lastSubmittedPrompt = ref<string | null>(null);
const containerClasses = computed(() =>
  showSplitView.value
    ? "mx-auto h-full w-full"
    : "mx-auto h-full w-full max-w-3xl flex items-center"
);
const layoutClasses = computed(() => {
  if (!showSplitView.value) return "w-full";
  const base = "grid h-full min-h-0 gap-4 lg:gap-6 lg:grid-rows-1";
  const mobileRows = "grid-rows-1";
  const lgCols = showOpsPanel.value ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return `${base} ${mobileRows} ${lgCols}`;
});
const chatCardClasses = computed(() => {
  if (!showSplitView.value) return "overflow-hidden";
  const base = "flex flex-col overflow-hidden transition-[max-height] duration-300 ease-in-out";
  const mobile = "fixed bottom-0 inset-x-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]";
  const desktop = "lg:static lg:inset-auto lg:z-auto lg:shadow-none lg:h-full lg:min-h-0 lg:order-1";
  const height = chatExpanded.value ? "max-h-[70dvh] lg:max-h-none" : "lg:max-h-none";
  return `${base} ${mobile} ${desktop} ${height}`;
});
const chatContentClasses = computed(() =>
  showSplitView.value
    ? "flex flex-1 min-h-0 flex-col"
    : ""
);
const chatBodyClasses = computed(() => {
  if (showSplitView.value) {
    return "grid flex-1 min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-4";
  }

  return "flex flex-col";
});
const chatCardUi = computed(() => {
  if (showSplitView.value) {
    return { body: "flex-1 min-h-0 flex flex-col overflow-hidden" };
  }
  return {};
});

async function useStarterPrompt(prompt: string) {
  if (isGenerating.value) return;
  input.value = prompt;
  await onSubmit();
}

async function submitPrompt(text: string) {
  lastSubmittedPrompt.value = text;
  chatMessages.value.push({
    id: `user-${Date.now()}-${chatMessages.value.length}`,
    role: "user",
    parts: [{ type: "text", text }],
  });

  await send(text, {
    model: selectedModel.value,
    currentSpec: renderedSpec.value ?? undefined,
  });

  chatMessages.value.push({
    id: `assistant-${Date.now()}-${chatMessages.value.length}`,
    role: "assistant",
    parts: [{ type: "text", text: "Generated UI updated." }],
  });
}

async function onSubmit() {
  const text = input.value.trim();
  if (!text || isGenerating.value) return;

  chatExpanded.value = false;
  await submitPrompt(text);
  input.value = "";
}

async function onReload() {
  if (!lastSubmittedPrompt.value || isGenerating.value) return;
  await submitPrompt(lastSubmittedPrompt.value);
}
</script>
