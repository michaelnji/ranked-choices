<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'

const route = useRoute()
const listId = Number(route.params.id)
const itemId = Number(route.params.itemId)

const {
  criteria,
  items,
  fetchDetails,
} = useListDetails(listId)

onMounted(async () => {
  await fetchDetails()
})

const item = computed(() => items.value.find(i => i.id === itemId))
</script>

<template>
  <div v-if="item" class="space-y-6 pb-20">
    <!-- Header -->
    <div class="k-card space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink :to="`/lists/${listId}`" class="k-btn k-btn-ghost">
            <Icon name="solar:arrow-left-bold" class="text-xl" />
          </NuxtLink>
          <div>
            <p class="k-section-subtitle">
              Item Details
            </p>
            <h1 class="k-title">
              {{ item.name }}
            </h1>
          </div>
        </div>
        <NuxtLink :to="`/lists/${listId}/items/${itemId}/edit`" class="k-btn k-btn-ghost">
          <Icon name="solar:pen-bold" class="text-xl" />
        </NuxtLink>
      </div>
    </div>

    <!-- Scores -->
    <div class="k-card space-y-6">
      <h2 class="k-section-title">
        Scores
      </h2>

      <div v-if="criteria.length > 0" class="space-y-4">
        <div v-for="c in criteria" :key="c.id" class="space-y-1">
          <div class="flex justify-between items-center">
            <span class="font-bold">{{ c.name }}</span>
            <span class="font-mono font-bold text-lg">{{ item.scores[c.id!] || 0 }}<span class="text-sm text-(--color-text-muted)">/10</span></span>
          </div>
          <progress
            class="progress progress-primary w-full h-3 border border-(--color-text) rounded-none bg-white"
            :value="item.scores[c.id!] || 0"
            max="10"
          />
        </div>
      </div>
      <div v-else class="text-sm text-(--color-text-muted)">
        No criteria defined.
      </div>
    </div>
  </div>
  <div v-else class="flex justify-center py-20">
    <div class="k-card k-card-accent">
      <span class="k-section-title">
        Loading...
      </span>
    </div>
  </div>
</template>
