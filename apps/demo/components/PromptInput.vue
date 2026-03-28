<template>
  <UChatPrompt
    variant="subtle"
    :model-value="modelValue"
    :error="error"
    :autofocus="autofocus"
    @update:model-value="$emit('update:modelValue', $event)"
    @submit="$emit('submit')"
  >
    <template #footer>
      <USelect
        :model-value="selectedModel"
        :items="availableModels"
        :icon="selectedModelIcon"
        variant="ghost"
        :disabled="isModelLocked || disabled"
        :ui="{ base: 'w-56' }"
        placeholder="Select a model"
        @update:model-value="$emit('update:selectedModel', $event)"
      />
    </template>
    <UChatPromptSubmit
      :status="status"
      @reload="$emit('reload')"
    />
  </UChatPrompt>
</template>

<script setup lang="ts">
import type { ChatModelOption } from "~/shared/models";

defineProps<{
  modelValue: string;
  error?: Error;
  autofocus?: boolean;
  disabled?: boolean;
  status: "submitted" | "ready";
  selectedModel: string;
  selectedModelIcon: string;
  availableModels: ChatModelOption[];
  isModelLocked: boolean;
}>();

defineEmits<{
  "update:modelValue": [value: string];
  "update:selectedModel": [value: string];
  submit: [];
  reload: [];
}>();
</script>
