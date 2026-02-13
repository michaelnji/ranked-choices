<script setup lang="ts">
import type { Criteria, Item, RankingMode } from '~/types'
import { calculateScore, sortItems } from '~/utils/rankingEngine'

const props = defineProps<{
  items: Item[]
  criteria: Criteria[]
  mode: RankingMode
}>()

// Sorted list (computed based on mode)
const sortedItems = computed(() => {
  return sortItems(props.items, props.criteria, props.mode)
})

// Max possible score for weighted mode (used for progress bars)
const maxPossibleScore = computed(() => {
  return props.criteria.reduce((sum, c) => sum + (c.weight * 10), 0)
})

// Function to calculate score percentage
function getScorePercent(item: Item) {
  if (props.mode === 'manual' || maxPossibleScore.value === 0)
    return 0
  const score = calculateScore(item, props.criteria)
  return (score / maxPossibleScore.value) * 100
}

const getScore = (item: Item) => calculateScore(item, props.criteria)
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

    <div class="space-y-4">
      <div
        v-for="(item, index) in sortedItems" :key="item.id"
        class="flex items-center gap-4 border-[3px] border-(--color-text) px-3 py-3"
        :class="index === 0 ? 'bg-(--color-primary) text-(--color-primary-foreground)' : 'bg-(--color-surface-2)'"
      >
        <div
          class="flex h-10 w-10 items-center justify-center border-[3px] border-(--color-text) bg-(--color-surface) text-base font-black!"
        >
          {{ index + 1 }}
        </div>

        <div class="flex-1 space-y-2">
          <div class="flex items-center justify-between gap-4">
            <span class="text-lg font-black">{{ item.name }}</span>
            <span v-if="mode === 'weighted'" class="k-chip shadow-none!">
              {{ getScore(item) }} pts
            </span>
          </div>

          <div
            v-if="mode === 'weighted'"
            class="h-4 w-full border-[3px] border-(--color-text) bg-(--color-surface)"
          >
            <div class="h-full bg-(--color-text)" :style="{ width: `${getScorePercent(item)}%` }" />
          </div>
        </div>
      </div>

      <div v-if="items.length === 0" class="k-muted text-center py-8">
        Add items to see rankings.
      </div>
    </div>
  </div>
</template>
