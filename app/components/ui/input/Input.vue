<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="cn(
      'h-[50px] w-full min-w-0 rounded-[14px] bg-zinc-800/50 px-4 py-2 text-[17px] text-foreground placeholder:text-muted-foreground/60 transition-all outline-none focus:bg-zinc-800 focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      props.class,
    )"
  >
</template>
