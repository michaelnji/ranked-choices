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
    <div class="relative h-5 w-full bg-surface-950/50 rounded-full border border-surface-800/50 shadow-inner overflow-hidden backdrop-blur-sm">
      <!-- Progress Fill -->
      <div
        class="relative h-full bg-gradient-to-r transition-all duration-700 ease-out flex items-center"
        :class="colorClass"
        :style="{ width: `${percentage}%` }"
      >
        <!-- Shine Effect (Top Half) -->
        <div class="absolute top-0.5 left-1 right-1 h-[40%] bg-white/20 rounded-full opacity-80" />

        <!-- Pulse/Glow Effect for 100% -->
        <div v-if="percentage >= 100" class="absolute inset-0 bg-white/10 animate-pulse" />

        <!-- End Dot (Highlight) -->
        <div
          v-if="percentage > 0"
          class="absolute right-1.5 size-1.5 bg-white/60 rounded-full shadow-[0_0_4px_rgba(255,255,255,0.6)]"
        />
      </div>
    </div>
  </div>
</template>
