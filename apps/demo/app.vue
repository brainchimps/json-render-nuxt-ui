<template>
  <UApp>
    <div class="h-dvh overflow-hidden px-4 py-4 lg:px-6 flex flex-col">
      <div class="min-h-0 flex-1">
        <NuxtPage />
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
const { imprintUrl, privacyPolicyUrl } = useChatSession();
</script>
