<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle?: string
  back: string
  backLabel?: string
}>()
</script>

<template>
  <header class="sticky top-0 z-40 glass px-4 py-3 flex items-center gap-3">
    <NuxtLink
      :to="back"
      :aria-label="backLabel || 'Go back'"
      class="flex items-center justify-center w-11 h-11 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
    >
      <ChevronLeft :size="20" :stroke-width="2" />
    </NuxtLink>

    <div class="flex-1 min-w-0">
      <h1 class="text-base font-semibold text-foreground truncate leading-tight">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-label mt-0.5">
        {{ subtitle }}
      </p>
    </div>

    <div class="shrink-0 flex items-center gap-1">
      <slot name="right" />
    </div>
  </header>
</template>
