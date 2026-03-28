<template>
  <div ref="scrollEl" class="flex-1 min-h-0 overflow-y-auto font-mono text-xs leading-relaxed">
    <div v-if="lines.length === 0" class="flex flex-1 items-center justify-center p-4 text-muted">
      <p class="text-sm text-center">JSONL patches will appear here<br>as the AI streams them.</p>
    </div>
    <div v-else class="space-y-px">
      <div
        v-for="(line, i) in lines"
        :key="i"
        class="group flex gap-2 px-3 py-1 hover:bg-elevated/50 transition-colors"
      >
        <span class="shrink-0 w-6 text-right tabular-nums text-muted select-none">{{ i + 1 }}</span>
        <pre class="whitespace-pre-wrap break-all text-default">{{ formatJson(line) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ lines: string[] }>();

const scrollEl = ref<HTMLElement | null>(null);

function formatJson(line: string): string {
  try {
    return JSON.stringify(JSON.parse(line), null, 2);
  } catch {
    return line;
  }
}

watch(
  () => props.lines.length,
  () => {
    nextTick(() => {
      if (scrollEl.value) {
        scrollEl.value.scrollTop = scrollEl.value.scrollHeight;
      }
    });
  }
);
</script>
