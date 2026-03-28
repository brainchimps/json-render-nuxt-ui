<template>
  <UApp>
    <UContainer class="py-10">
      <UCard>
        <template #header>
          <h1 class="text-lg font-semibold">json-render-nuxt-ui demo</h1>
        </template>
        <p data-testid="greeting" class="text-muted">
          {{ greeting }}
        </p>
        <UButton
          class="mt-4"
          to="https://ui.nuxt.com"
          target="_blank"
          variant="subtle"
        >
          Nuxt UI docs
        </UButton>
      </UCard>
    </UContainer>
  </UApp>
</template>

<script setup lang="ts">
import { helloWord } from "json-render-nuxt-ui";

const greeting = helloWord();
</script>
