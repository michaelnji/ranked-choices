<script setup lang="ts">
type CriteriaType = import('~/types').Criteria
type ItemType = import('~/types').Item

defineProps<{
  items: ItemType[]
  criteria: CriteriaType[]
}>()

const emit = defineEmits<{
  (e: 'add', name: string): void
  (e: 'remove', id: number): void
  (e: 'updateScores', id: number, scores: Record<number, number>): void
}>()
</script>

<template>
  <div class="k-card space-y-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="k-section-subtitle">
          Entries
        </p>
        <h2 class="k-section-title">
          Items ({{ items.length }}/100)
        </h2>
      </div>
      <span class="k-chip">
        Max 100
      </span>
    </div>
    <p class="k-muted">
      Add the options you want to rank.
    </p>
    <!-- List -->

    <div class="space-y-4">
      <div
        v-for="item in items" :key="item.id"
        class="flex cursor-pointer items-center justify-between gap-4 font-black uppercase tracking-wide"
      >
        <NuxtLink :to="`/lists/${item.listId}/items/${item.id}`" class="flex-1">
          <div class="flex items-center justify-between gap-4">
            <span class="text-base">{{ item.name }}</span>
            <span class="k-chip">{{ criteria.length }} Scores</span>
          </div>
        </NuxtLink>
        <button
          class="k-btn k-btn-ghost px-2 !min-w-0" @click="item.id && emit('remove', item.id)"
        >
          <Icon name="solar:trash-bin-trash-bold" class="text-lg text-error" />
        </button>
      </div>

      <div v-if="items.length === 0" class="k-muted text-center py-4">
        No items added yet.
      </div>
    </div>
  </div>
</template>
