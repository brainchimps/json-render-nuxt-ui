<template>
  <div class="mx-auto h-full w-full">
    <div :class="layoutClasses">
      <!-- Chat panel -->
      <UCard
        :class="chatCardClasses"
        :ui="{ body: 'flex-1 min-h-0 flex flex-col overflow-hidden' }"
      >
        <template #header>
          <!-- Mobile drawer handle -->
          <div class="flex items-center justify-between lg:hidden">
            <button
              type="button"
              class="flex items-center gap-1.5 text-muted hover:text-default transition-colors"
              @click="chatExpanded = !chatExpanded"
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
                icon="i-lucide-code-xml"
                :color="showOpsPanel ? 'primary' : 'neutral'"
                :variant="showOpsPanel ? 'soft' : 'ghost'"
                size="xs"
                aria-label="Toggle JSONL debug"
                @click="toggleOpsPanel"
              />
            </div>
          </div>
          <!-- Desktop header -->
          <div class="hidden lg:flex items-center justify-between">
            <NuxtLink to="/" class="flex items-center gap-2 text-muted hover:text-default transition-colors">
              <UIcon name="i-lucide-plus" class="size-4" />
              <span data-testid="chat-title" class="text-sm font-medium">New Chat</span>
            </NuxtLink>
            <UButton
              class="-my-1"
              icon="i-lucide-code-xml"
              :color="showOpsPanel ? 'primary' : 'neutral'"
              :variant="showOpsPanel ? 'soft' : 'ghost'"
              size="xs"
              aria-label="Toggle JSONL debug"
              @click="toggleOpsPanel"
            />
          </div>
        </template>

        <div class="flex flex-1 min-h-0 flex-col">
          <div class="grid flex-1 min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-4">
            <div
              data-testid="chat-messages"
              class="min-h-0 overflow-y-auto -mr-4 sm:-mr-6"
              :class="{
                'hidden': !chatExpanded,
                'lg:block!': !chatExpanded
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
                @reload="onReload"
              />
            </div>
          </div>
        </div>
      </UCard>

      <!-- Desktop-only: JSONL debug pane -->
      <UCard
        v-if="showOpsPanel"
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

      <!-- Render panel -->
      <UCard
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

        <div
          class="flex-1 flex-col min-h-0"
          :class="showOpsPanel && activeRenderTab === 'jsonl' ? 'hidden lg:flex!' : 'flex'"
        >
          <JSONUIProvider :registry="registry" :initial-state="{}">
            <div v-if="hasRenderedSpec && !specErrors.length" class="flex min-h-full items-center justify-center p-4">
              <Renderer :spec="renderedSpec" :registry="registry" :loading="isGenerating" />
            </div>
            <div v-else-if="specErrors.length" class="flex flex-1 flex-col items-center justify-center gap-4 text-muted p-6">
              <UIcon name="i-lucide-triangle-alert" class="size-6 text-warning" />
              <div class="text-center space-y-1">
                <p class="text-sm font-medium text-default">Generated UI has issues</p>
                <p class="text-xs">The AI produced an invalid spec. Try rephrasing or regenerating.</p>
              </div>
              <ul class="text-xs space-y-0.5 max-w-md">
                <li v-for="(err, i) in specErrors.slice(0, 5)" :key="i" class="truncate">
                  &bull; {{ err }}
                </li>
                <li v-if="specErrors.length > 5" class="text-dimmed">
                  &hellip; and {{ specErrors.length - 5 }} more
                </li>
              </ul>
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
</template>

<script setup lang="ts">
import { JSONUIProvider, Renderer } from "@json-render/vue";
import { isTextUIPart } from "ai";

const {
  selectedModel,
  selectedModelIcon,
  isModelLocked,
  availableModels,
  chatMessages,
  lastSubmittedPrompt,
  pendingPrompt,
  addUserMessage,
  addAssistantMessage,
} = useChatSession();

const { registry, renderedSpec, hasRenderedSpec, isGenerating, uiError, rawLines, specErrors, send } =
  useJsonRender();

const input = ref("");
const chatExpanded = ref(false);

const showOpsPanel = ref(false);
type RenderTab = "ui" | "jsonl";
const activeRenderTab = ref<RenderTab>("ui");

function toggleOpsPanel() {
  showOpsPanel.value = !showOpsPanel.value;
  activeRenderTab.value = showOpsPanel.value ? "jsonl" : "ui";
}

const chatStatus = computed(() => (isGenerating.value ? "submitted" : "ready"));

const layoutClasses = computed(() => {
  const base = "grid h-full min-h-0 gap-4 lg:gap-6 lg:grid-rows-1";
  const mobileRows = "grid-rows-[1fr_auto]";
  const lgCols = showOpsPanel.value ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return `${base} ${mobileRows} ${lgCols}`;
});

const chatCardClasses = computed(() => {
  const base = "order-2 flex flex-col overflow-hidden lg:order-1 lg:h-full lg:min-h-0";
  const height = chatExpanded.value ? "max-h-[70dvh] lg:max-h-none" : "lg:max-h-none";
  return `${base} ${height}`;
});

async function submitPrompt(text: string) {
  lastSubmittedPrompt.value = text;
  addUserMessage(text);

  await send(text, {
    model: selectedModel.value,
    currentSpec: renderedSpec.value ?? undefined,
  });

  addAssistantMessage("Generated UI updated.");
}

async function onSubmit() {
  const text = input.value.trim();
  if (!text || isGenerating.value) return;

  chatExpanded.value = false;
  input.value = "";
  await submitPrompt(text);
}

async function onReload() {
  if (!lastSubmittedPrompt.value || isGenerating.value) return;
  await submitPrompt(lastSubmittedPrompt.value);
}

definePageMeta({
  middleware: [
    function (to) {
      const { chatMessages, pendingPrompt } = useChatSession();
      if (!pendingPrompt.value && chatMessages.value.length === 0) {
        return navigateTo("/", { replace: true });
      }
    },
  ],
});

onMounted(async () => {
  if (pendingPrompt.value) {
    const prompt = pendingPrompt.value;
    pendingPrompt.value = null;
    await submitPrompt(prompt);
  }
});
</script>
