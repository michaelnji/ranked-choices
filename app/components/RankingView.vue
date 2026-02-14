<script setup lang="ts">
import type { Criteria, Item, RankingMode } from '~/types'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { GripVertical, Star, Trophy } from 'lucide-vue-next'
import { computed, watch } from 'vue'
import ProgressBar from '~/components/ProgressBar.vue'
import { calculateScore, sortItems } from '~/utils/rankingEngine'

const props = defineProps<{
  items: Item[]
  criteria: Criteria[]
  mode: RankingMode
  listId: number
}>()

const emit = defineEmits<{
  (e: 'reorder', items: Item[]): void
}>()

// --- Weighted Mode Logic ---
const weightedItems = computed(() => {
  return sortItems(props.items, props.criteria, 'weighted')
})

const getScore = (item: Item) => calculateScore(item, props.criteria)

const totalPoints = computed(() => {
  return weightedItems.value.reduce((sum, item) => sum + getScore(item), 0)
})

function getContributionPercent(item: Item) {
  if (totalPoints.value === 0) {
    return 0
  }
  const score = calculateScore(item, props.criteria)
  return (score / totalPoints.value) * 100
}

// --- Manual Mode Logic ---
const [parent, manualItems] = useDragAndDrop(
  sortItems(props.items, props.criteria, 'manual'),
  {
    dragHandle: '.drag-handle',
    onSort: (event) => {
      emit('reorder', event.values as Item[])
    },
  },
)

watch(() => props.items, (newItems) => {
  manualItems.value = sortItems(newItems, props.criteria, 'manual')
}, { deep: true })
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 rounded-lg bg-primary-500/10 text-primary-500">
        <Trophy v-if="mode !== 'manual'" :size="24" />
        <Star v-else :size="24" />
      </div>
      <h2 class="text-xl font-bold text-white tracking-tight">
        {{ mode === 'manual' ? 'Manual Ranking' : 'Weighted Results' }}
      </h2>
    </div>

    <!-- Manual Mode List (Drag & Drop) -->
    <div v-show="mode === 'manual'" class="mt-8">
      <div v-show="manualItems.length > 0" ref="parent" class="space-y-3">
        <NuxtLink
          v-for="(item, index) in manualItems" :key="item.id"
          :to="`/lists/${listId}/items/${item.id}`"
          class="group flex items-center gap-4 bg-surface-900 border border-surface-800 rounded-2xl p-4 shadow-sm hover:border-primary-500/30 transition-all select-none cursor-pointer"
        >
          <!-- Drag Handle -->
          <div
            class="drag-handle cursor-grab active:cursor-grabbing p-1 text-surface-500 hover:text-white transition-colors touch-none"
            @click.prevent.stop
          >
            <GripVertical :size="20" />
          </div>

          <!-- Rank Number -->
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full bg-surface-800 text-white font-bold text-sm border border-surface-700"
          >
            {{ index + 1 }}
          </div>

          <!-- Content -->
          <div class="flex-1">
            <span class="text-base font-bold text-white group-hover:text-primary-400 transition-colors">{{ item.name
            }}</span>
          </div>
        </NuxtLink>
      </div>

      <div
        v-if="manualItems.length === 0"
        class="text-center py-12 text-surface-500 bg-surface-900/50 rounded-2xl border border-surface-800/50 border-dashed"
      >
        <p>Add items to start ranking manually.</p>
      </div>
    </div>

    <!-- Weighted Mode List (Read Only) -->
    <div v-if="mode !== 'manual'" class="space-y-4 mt-8">
      <NuxtLink
        v-for="(item, index) in weightedItems" :key="item.id"
        :to="`/lists/${listId}/items/${item.id}`"
        class="block relative overflow-hidden bg-surface-900 border border-surface-800 rounded-2xl p-5 shadow-sm transition-all hover:border-primary-500/30 cursor-pointer"
        :class="{ 'ring-1 ring-primary-500/50 shadow-[0_0_20px_-10px_rgba(var(--color-primary-500),0.3)]': index === 0 }"
      >
        <div class="flex items-center gap-4 relative z-10">
          <!-- Rank -->
          <div
            class="flex items-center justify-center size-8 rounded-full font-black  shadow-inner"
            :class="index === 0 ? 'bg-primary-500 size-10 text-lg text-primary-950' : 'bg-surface-800 text-surface-300'"
          >
            {{ index + 1 }}
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-4 mb-2">
              <div class="truncate">
                <span class="line-clamp-1 font-bold text-white hover:text-primary-400 transition-colors">{{ item.name
                }}</span>
              </div>
              <span class="text-xs font-bold px-2 py-1 rounded bg-surface-800 text-primary-400 tabular-nums">
                {{ getScore(item).toFixed(1) }} pts
              </span>
            </div>

            <div class="flex items-center gap-3">
              <ProgressBar
                :value="getContributionPercent(item)" :max="100"
                :color-class="index === 0 ? 'from-primary-400 to-primary-300' : 'from-primary-600 to-primary-500'"
              />
              <span class="text-xs font-bold text-surface-400 tabular-nums w-12 text-right">
                {{ getContributionPercent(item).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>

      <div
        v-if="weightedItems.length === 0"
        class="text-center py-12 text-surface-500 bg-surface-900/50 rounded-2xl border border-surface-800/50 border-dashed"
      >
        <p>Add items and criteria to see weighted results.</p>
      </div>
    </div>
  </div>
</template>
