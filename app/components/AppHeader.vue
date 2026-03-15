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
  <header class="sticky top-0 z-40 glass px-4 py-3 flex items-center justify-between min-h-[56px] border-b-0!">
    <div class="flex-1 flex items-center justify-start">
      <NuxtLink
        :to="back" :aria-label="backLabel || 'Go back'"
        class="active-scale-down-sm flex items-center gap-1 -ml-2 px-2 py-1 h-10 rounded-xl text-primary transition-all duration-200 hover:opacity-80"
      >
        <ChevronLeft :size="24" :stroke-width="2.5" />
        <span v-if="backLabel" class="text-[17px] font-medium tracking-tight -ml-1">{{ backLabel }}</span>
        <span v-else class="text-[17px] font-medium tracking-tight -ml-1">Back</span>
      </NuxtLink>
    </div>

    <!-- Centered Title -->
    <div class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
      <h1 class="text-[17px] font-semibold text-foreground tracking-tight max-w-[200px] truncate">
        {{ title }}
      </h1>
      <p v-if="subtitle" class="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
        {{ subtitle }}
      </p>
    </div>

    <div class="flex-1 flex items-center justify-end gap-1">
      <slot name="right" />
    </div>
  </header>
</template>
