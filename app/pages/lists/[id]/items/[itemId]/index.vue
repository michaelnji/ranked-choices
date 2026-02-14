<script setup lang="ts">
import { ChevronLeft, Pencil } from 'lucide-vue-next'
import { computed, onMounted } from 'vue'
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
  <div v-if="item" class="p-6 space-y-8 pb-20 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-4 min-w-0">
        <NuxtLink
          :to="`/lists/${listId}`"
          class="btn btn-ghost rounded-full !p-3 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors"
        >
          <ChevronLeft :size="24" stroke-width="2.5" />
        </NuxtLink>
        <div class="min-w-0">
          <h1 class="text-3xl text-display text-white truncate">
            {{ item.name }}
          </h1>
          <p class="text-surface-400 font-medium">
            Item Details
          </p>
        </div>
      </div>
      <NuxtLink
        :to="`/lists/${listId}/items/${itemId}/edit`"
        class="btn btn-ghost rounded-full !p-3 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors"
      >
        <Pencil :size="24" stroke-width="2" />
      </NuxtLink>
    </div>

    <!-- Scores -->
    <div class="card space-y-6">
      <h2 class="text-xl font-bold text-white">
        Scores
      </h2>

      <div v-if="criteria.length > 0" class="space-y-4">
        <div v-for="c in criteria" :key="c.id" class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="font-bold text-surface-300">{{ c.name }}</span>
            <span class="text-sm font-bold text-primary-400">{{ item.scores[c.id!] || 0 }} / 10</span>
          </div>
          <!-- Progress Bar -->
          <div class="h-2 w-full bg-surface-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary-500 rounded-full transition-all duration-500"
              :style="{ width: `${(item.scores[c.id!] || 0) * 10}%` }"
            />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-surface-500 border border-dashed border-surface-800 rounded-xl">
        No criteria defined.
      </div>
    </div>
  </div>
</template>
