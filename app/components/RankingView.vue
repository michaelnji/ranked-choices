<script setup lang="ts">
import type { Criteria, Item, RankingMode } from '~/types'
import { calculateScore, sortItems } from '~/utils/rankingEngine'

const props = defineProps<{
  items: Item[]
  criteria: Criteria[]
  mode: RankingMode
}>()

const emit = defineEmits<{
  (e: 'update:mode', mode: RankingMode): void
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
  <div class="card bg-base-100 shadow border border-base-200 h-full">
    <div class="card-body">
      <div class="flex justify-between items-start">
        <div>
          <h2 class="card-title text-lg">
            <span class="i-solar-ranking-bold" />
            Ranking
          </h2>
          <p class="text-sm text-base-content/70">
            {{ mode === 'manual' ? 'Drag to reorder' : 'Calculated automatically' }}
          </p>
        </div>

        <!-- Mode Toggle -->
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :class="{ 'btn-primary': mode === 'manual' }"
            @click="emit('update:mode', 'manual')"
          >
            Manual
          </button>
          <button
            class="join-item btn btn-sm"
            :class="{ 'btn-primary': mode === 'weighted' }"
            @click="emit('update:mode', 'weighted')"
          >
            Weighted
          </button>
        </div>
      </div>

      <!-- Ranking List -->
      <div class="mt-4 space-y-2 overflow-y-auto max-h-[600px]">
        <div
          v-for="(item, index) in sortedItems"
          :key="item.id"
          class="flex items-center gap-4 p-3 rounded-lg border transition-all"
          :class="index === 0 ? 'bg-primary/10 border-primary' : 'bg-base-200 border-base-300'"
        >
          <!-- Rank Number -->
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full font-bold"
            :class="index === 0 ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content'"
          >
            {{ index + 1 }}
          </div>

          <!-- Item Details -->
          <div class="flex-1">
            <div class="flex justify-between items-center">
              <span class="font-bold text-lg">{{ item.name }}</span>
              <span v-if="mode === 'weighted'" class="badge badge-lg badge-ghost">
                {{ getScore(item) }} pts
              </span>
            </div>

            <!-- Score Bar (Weighted Mode) -->
            <div v-if="mode === 'weighted'" class="mt-1 w-full bg-base-300 h-2 rounded-full overflow-hidden">
              <div
                class="h-full bg-primary transition-all duration-500"
                :style="{ width: `${getScorePercent(item)}%` }"
              />
            </div>
          </div>
        </div>

        <div v-if="items.length === 0" class="text-center py-8 text-base-content/50">
          Add items to see rankings.
        </div>
      </div>
    </div>
  </div>
</template>
