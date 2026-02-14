<script setup lang="ts">
import type { Criteria, Item, RankingMode } from '~/types'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { computed, watch } from 'vue'
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

const maxPossibleScore = computed(() => {
  return props.criteria.reduce((sum, c) => sum + (c.weight * 10), 0)
})

function getScorePercent(item: Item) {
  if (maxPossibleScore.value === 0)
    return 0
  const score = calculateScore(item, props.criteria)
  return (score / maxPossibleScore.value) * 100
}

const getScore = (item: Item) => calculateScore(item, props.criteria)

// --- Manual Mode Logic ---
// Initialize with sorted manual items
const [parent, manualItems] = useDragAndDrop(
  sortItems(props.items, props.criteria, 'manual'),
  {
    dragHandle: '.drag-handle',
    onSort: (event) => {
      // FormKit drag and drop passes the new values array directly in the event if it's just a sort
      // But the types might be a bit loose.
      // Based on docs, event is the new values array.
      emit('reorder', event.values as Item[])
    },
  },
)

// Sync when props change (e.g. added item)
watch(() => props.items, (newItems) => {
  manualItems.value = sortItems(newItems, props.criteria, 'manual')
}, { deep: true })
</script>

<template>
  <div class="k-card space-y-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="k-section-subtitle">
          Results
        </p>
        <h2 class="k-section-title">
          Ranking
        </h2>
      </div>
    </div>

    <!-- Manual Mode List (Drag & Drop) -->
    <div v-show="mode === 'manual'" ref="parent" class="space-y-4">
      <div
        v-for="(item, index) in manualItems" :key="item.id"
        class="flex items-center gap-4 border-[3px] border-(--color-text) px-3 py-3 bg-(--color-surface-2)"
      >
        <!-- Drag Handle -->
        <div class="drag-handle cursor-grab active:cursor-grabbing p-2 touch-none">
          <Icon name="solar:reorder-bold" class="text-xl text-(--color-text-muted)" />
        </div>

        <!-- Rank Number -->
        <div
          class="flex h-10 w-10 items-center justify-center border-[3px] border-(--color-text) bg-(--color-surface) text-base font-black!"
        >
          {{ index + 1 }}
        </div>

        <div class="flex-1 space-y-2">
          <NuxtLink :to="`/lists/${listId}/items/${item.id}`" class="block">
            <span class="text-lg font-black hover:underline cursor-pointer">{{ item.name }}</span>
          </NuxtLink>
        </div>
      </div>
      <div v-if="manualItems.length === 0" class="k-muted text-center py-8">
        Add items to start ranking.
      </div>
    </div>

    <!-- Weighted Mode List (Read Only) -->
    <div v-if="mode !== 'manual'" class="space-y-4">
      <div
        v-for="(item, index) in weightedItems" :key="item.id"
        class="flex items-center gap-4 border-[3px] border-(--color-text) px-3 py-3"
        :class="index === 0 ? 'bg-(--color-primary) text-(--color-primary-foreground)' : 'bg-(--color-surface-2)'"
      >
        <div
          class="flex h-10 w-10 items-center justify-center border-[3px] border-(--color-text) bg-(--color-surface) text-base font-black! text-(--color-text)"
        >
          {{ index + 1 }}
        </div>

        <div class="flex-1 space-y-2">
          <div class="flex items-center justify-between gap-4">
            <NuxtLink :to="`/lists/${listId}/items/${item.id}`" class="block">
              <span class="text-lg font-black hover:underline cursor-pointer">{{ item.name }}</span>
            </NuxtLink>
            <span class="k-chip shadow-none! bg-(--color-surface) text-(--color-text)">
              {{ getScore(item) }} pts
            </span>
          </div>

          <div
            class="h-4 w-full border-[3px] border-(--color-text) bg-(--color-surface)"
          >
            <div class="h-full bg-(--color-text)" :style="{ width: `${getScorePercent(item)}%` }" />
          </div>
        </div>
      </div>

      <div v-if="weightedItems.length === 0" class="k-muted text-center py-8">
        Add items to see rankings.
      </div>
    </div>
  </div>
</template>
