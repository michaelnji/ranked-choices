<script setup lang="ts">
import type { Criteria, Item, RankingMode } from '~/types'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { GripVertical, ListOrdered, Plus, Settings, Trophy } from 'lucide-vue-next'
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

// Shallow watch: re-sort when items array reference changes (after DB operations)
watch(() => props.items, (newItems) => {
  manualItems.value = sortItems(newItems, props.criteria, 'manual')
})
</script>

<template>
  <div class="space-y-4">
    <!-- Manual Mode List (Drag & Drop) -->
    <div v-show="mode === 'manual'">
      <ul v-show="manualItems.length > 0" ref="parent" class="space-y-2">
        <li v-for="(item, index) in manualItems" :key="item.id">
          <NuxtLink
            :to="`/lists/${listId}/items/${item.id}`"
            class="group flex items-center gap-3 bg-card border border-zinc-800 rounded-lg px-3 py-3 hover:border-primary/40 hover:bg-card/80 transition-all select-none cursor-pointer"
          >
            <button
              type="button"
              class="drag-handle cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground transition-colors touch-none rounded"
              aria-label="Drag to reorder"
              @click.prevent.stop
            >
              <GripVertical :size="16" />
            </button>

            <span class="flex items-center justify-center w-6 h-6 rounded text-xs font-semibold tabular-nums text-muted-foreground bg-muted">
              {{ index + 1 }}
            </span>

            <span class="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
              {{ item.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Manual Empty State -->
      <div
        v-if="manualItems.length === 0"
        class="flex flex-col items-center text-center py-10 text-muted-foreground rounded-lg border border-dashed border-zinc-800"
      >
        <ListOrdered :size="24" :stroke-width="1.5" class="mb-3 text-muted-foreground" />
        <p class="text-sm font-medium text-foreground mb-1">
          No items to rank
        </p>
        <p class="text-xs text-muted-foreground max-w-[200px] mb-4">
          Add items to start ordering them.
        </p>
        <NuxtLink :to="`/lists/${listId}/add`">
          <UiButton size="sm" variant="outline">
            <Plus :size="14" class="mr-1.5" />
            Add Items
          </UiButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Weighted Mode List (Read Only) -->
    <div v-if="mode !== 'manual'" class="space-y-2">
      <ul class="space-y-2">
        <li
          v-for="(item, index) in weightedItems" :key="item.id"
          class="animate-fade-in-up"
          :style="`animation-delay: ${Math.min(index * 55, 275)}ms`"
        >
          <NuxtLink
            :to="`/lists/${listId}/items/${item.id}`"
            class="flex items-center gap-4 bg-card border border-zinc-800 rounded-lg px-4 py-3 transition-all hover:border-primary/40 cursor-pointer"
            :class="index === 0 ? 'border-primary/30 bg-primary/5' : ''"
          >
            <span
              class="flex items-center justify-center size-7 rounded font-bold text-sm tabular-nums shrink-0"
              :class="index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
            >
              {{ index + 1 }}
            </span>

            <div class="flex-1 min-w-0 space-y-1.5">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm font-semibold text-foreground truncate">{{ item.name }}</span>
                <span class="text-xs font-semibold tabular-nums text-muted-foreground shrink-0">
                  {{ getScore(item).toFixed(1) }}
                </span>
              </div>
              <ProgressBar
                :value="getContributionPercent(item)"
                :max="100"
                :label="`${item.name} score share`"
              />
            </div>
          </NuxtLink>
        </li>
      </ul>

      <!-- Weighted Empty State -->
      <div
        v-if="weightedItems.length === 0"
        class="flex flex-col items-center text-center py-10 text-muted-foreground rounded-lg border border-dashed border-zinc-800"
      >
        <Trophy :size="24" :stroke-width="1.5" class="mb-3 text-muted-foreground" />
        <p class="text-sm font-medium text-foreground mb-1">
          No results yet
        </p>
        <p class="text-xs text-muted-foreground max-w-[200px] mb-4">
          Add items and criteria to see weighted rankings.
        </p>
        <div class="flex gap-2">
          <NuxtLink :to="`/lists/${listId}/add`">
            <UiButton size="sm" variant="outline">
              <Plus :size="14" class="mr-1.5" />
              Add Items
            </UiButton>
          </NuxtLink>
          <NuxtLink :to="`/lists/${listId}/criteria`">
            <UiButton size="sm" variant="outline">
              <Settings :size="14" class="mr-1.5" />
              Criteria
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
