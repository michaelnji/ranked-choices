<script setup lang="ts">
import type { Criteria, Item } from '~/types'
import { Package, Trash2 } from 'lucide-vue-next'

defineProps<{
  items: Item[]
  criteria: Criteria[]
}>()

const emit = defineEmits<{
  (e: 'add', name: string): void
  (e: 'remove', id: number): void
  (e: 'updateScores', id: number, scores: Record<number, number>): void
}>()
</script>

<template>
  <UiCard>
    <UiCardContent class="space-y-4 pt-6">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-label">
            Entries
          </p>
          <h2 class="text-xl font-bold text-foreground">
            Items ({{ items.length }}/100)
          </h2>
        </div>
        <UiBadge variant="outline" class="text-muted-foreground">
          Max 100
        </UiBadge>
      </div>
      <p class="text-sm text-muted-foreground">
        Add the options you want to rank.
      </p>

      <div class="space-y-3">
        <div
          v-for="item in items" :key="item.id"
          class="flex items-center gap-3 p-3 bg-card border border-zinc-800 rounded-xl hover:border-primary/30 transition-all"
        >
          <NuxtLink :to="`/lists/${item.listId}/items/${item.id}`" class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-3">
              <span class="text-base font-bold text-foreground truncate">{{ item.name }}</span>
              <UiBadge variant="secondary" class="shrink-0">
                {{ criteria.length }} Scores
              </UiBadge>
            </div>
          </NuxtLink>
          <UiButton
            variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
            @click="item.id && emit('remove', item.id)"
          >
            <Trash2 :size="16" />
          </UiButton>
        </div>

        <!-- Empty State -->
        <div
          v-if="items.length === 0"
          class="flex flex-col items-center text-center py-8 text-muted-foreground border border-dashed border-zinc-800 rounded-xl"
        >
          <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <Package :size="24" :stroke-width="1.5" />
          </div>
          <p class="font-bold text-foreground mb-1">
            No items yet
          </p>
          <p class="text-sm">
            Add options you want to rank and compare.
          </p>
        </div>
      </div>
    </UiCardContent>
  </UiCard>
</template>
