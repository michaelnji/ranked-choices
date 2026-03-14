<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: number
  max?: number
  showLabel?: boolean
  label?: string
  colorClass?: string
}>(), {
  max: 100,
  showLabel: false,
  label: '',
  colorClass: 'from-primary-500 to-primary-400',
})

const percentage = computed(() => {
  return Math.min(100, Math.max(0, (props.value / props.max) * 100))
})
</script>

<template>
  <div
    role="progressbar"
    :aria-valuenow="value"
    aria-valuemin="0"
    :aria-valuemax="max"
    class="w-full group"
  >
    <!-- Optional Header/Label -->
    <div v-if="showLabel" class="flex justify-between items-end mb-2">
      <span class="text-xs font-bold text-surface-400 uppercase tracking-wider">{{ label }}</span>
      <span class="text-xs font-bold text-primary-400 tabular-nums">{{ percentage.toFixed(0) }}%</span>
    </div>

    <!-- Progress Track -->
    <div class="relative h-2 w-full bg-surface-800 rounded-full overflow-hidden">
      <!-- Progress Fill -->
      <div
        class="h-full bg-gradient-to-r transition-all duration-700 ease-out"
        :class="colorClass"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>
