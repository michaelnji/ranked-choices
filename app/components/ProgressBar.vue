<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  max?: number
  showLabel?: boolean
  label?: string
}>(), {
  max: 100,
  showLabel: false,
  label: '',
})

const percentage = computed(() => {
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})

const scaleX = computed(() => percentage.value / 100)
</script>

<template>
  <div
    role="progressbar"
    :aria-valuenow="value"
    aria-valuemin="0"
    :aria-valuemax="max"
    :aria-label="label || 'Progress'"
    class="w-full"
  >
    <div v-if="showLabel" class="flex justify-between items-end mb-2">
      <span class="text-xs font-medium text-muted-foreground uppercase tracking-widest">{{ label }}</span>
      <span class="text-xs font-semibold text-primary tabular-nums">{{ percentage.toFixed(0) }}%</span>
    </div>

    <div class="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <div
        class="absolute inset-y-0 left-0 w-full origin-left bg-primary rounded-full transition-transform duration-500 ease-out"
        :style="{ transform: `scaleX(${scaleX})` }"
      />
    </div>
  </div>
</template>
