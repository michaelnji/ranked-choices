<script setup lang="ts">
import type { Criteria, Item, RankingMode } from '~/types'
import { useDragAndDrop } from '@formkit/drag-and-drop/vue'
import { GripVertical, ListOrdered, Trophy } from 'lucide-vue-next'
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
      <ul v-show="manualItems.length > 0" ref="parent" class="ios-list shadow-md">
        <li v-for="(item, index) in manualItems" :key="item.id">
          <NuxtLink
            :to="`/lists/${listId}/items/${item.id}`"
            class="ios-list-item gap-3 cursor-pointer p-0 pr-4"
          >
            <button
              type="button"
              class="drag-handle cursor-grab active:cursor-grabbing p-4 text-zinc-500 hover:text-zinc-300 transition-colors touch-none h-full flex items-center justify-center -mr-1"
              aria-label="Drag to reorder"
              @click.prevent.stop
            >
              <GripVertical :size="20" />
            </button>

            <span class="flex items-center justify-center w-7 h-7 rounded text-[13px] font-semibold tabular-nums" :class="index === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-zinc-800'">
              {{ index + 1 }}
            </span>

            <span class="flex-1 text-[17px] font-medium text-foreground py-3 truncate">
              {{ item.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Manual Empty State -->
      <div
        v-if="manualItems.length === 0"
        class="flex flex-col items-center text-center py-12 text-muted-foreground bg-zinc-900/30 rounded-[24px] ring-1 ring-white/5 backdrop-blur-md"
      >
        <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          <ListOrdered :size="24" :stroke-width="1.5" class="text-zinc-400" />
        </div>
        <p class="text-[17px] font-semibold text-foreground mb-1 tracking-tight">
          No items yet
        </p>
        <p class="text-[14px] text-muted-foreground max-w-[200px] mb-6 leading-snug">
          Add items to start manually ordering them.
        </p>
        <NuxtLink :to="`/lists/${listId}/add`">
          <button class="active-scale-down-sm px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-foreground text-[15px] font-medium transition-colors">
            Add Items
          </button>
        </NuxtLink>
      </div>
    </div>

    <!-- Weighted Mode List (Read Only) -->
    <div v-if="mode !== 'manual'" class="space-y-4">
      <ul v-if="weightedItems.length > 0" class="ios-list shadow-md">
        <li
          v-for="(item, index) in weightedItems" :key="item.id"
          class="animate-fade-in-up"
          :style="`animation-delay: ${Math.min(index * 55, 275)}ms`"
        >
          <NuxtLink
            :to="`/lists/${listId}/items/${item.id}`"
            class="ios-list-item flex items-center gap-4 py-3 cursor-pointer"
            :class="index === 0 ? 'bg-primary/5' : ''"
          >
            <span
              class="flex items-center justify-center size-8 rounded-full font-bold text-[15px] tabular-nums shrink-0"
              :class="index === 0 ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30' : 'bg-zinc-800 text-muted-foreground'"
            >
              {{ index + 1 }}
            </span>

            <div class="flex-1 min-w-0 flex flex-col justify-center translate-y-0.5">
              <div class="flex items-center justify-between gap-3 mb-1.5">
                <span class="text-[17px] font-medium text-foreground truncate tracking-tight">{{ item.name }}</span>
                <span class="text-[15px] font-semibold tabular-nums text-muted-foreground shrink-0" :class="index === 0 ? 'text-primary' : ''">
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
        class="flex flex-col items-center text-center py-12 text-muted-foreground bg-zinc-900/30 rounded-[24px] ring-1 ring-white/5 backdrop-blur-md"
      >
        <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
          <Trophy :size="24" :stroke-width="1.5" class="text-zinc-400" />
        </div>
        <p class="text-[17px] font-semibold text-foreground mb-1 tracking-tight">
          No results yet
        </p>
        <p class="text-[14px] text-muted-foreground max-w-[200px] mb-6 leading-snug">
          Add items and criteria to see intelligent rankings.
        </p>
        <div class="flex flex-col gap-3 w-full px-8">
          <NuxtLink :to="`/lists/${listId}/add`" class="w-full block">
            <button class="active-scale-down-sm w-full py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-[15px] font-semibold transition-colors shadow-md shadow-primary/20">
              Add Items
            </button>
          </NuxtLink>
          <NuxtLink :to="`/lists/${listId}/criteria`" class="w-full block">
            <button class="active-scale-down-sm w-full py-3 rounded-full bg-white/5 hover:bg-white/10 text-foreground text-[15px] font-semibold transition-colors">
              Set Criteria
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
