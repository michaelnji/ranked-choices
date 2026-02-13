<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'

const route = useRoute()
const listId = Number(route.params.id)

const {
  list,
  criteria,
  items,
  fetchDetails,
} = useListDetails(listId)

onMounted(() => {
  fetchDetails()
})
</script>

<template>
  <div v-if="list" class="space-y-6 pb-20 relative min-h-[80vh]">
    <!-- Header -->
    <div class="k-card space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="k-btn shadow-none! k-btn-ghost border-none! p-0!">
            <Icon name="solar:arrow-left-linear" class="text-3xl" />
          </NuxtLink>
          <div>
            <p class="k-section-subtitle">
              Decision List
            </p>
            <h1 class="k-title text-xl sm:text-2xl">
              {{ list.name }}
            </h1>
          </div>
        </div>
        <NuxtLink :to="`/lists/${listId}/settings`" class="k-btn k-btn-ghost p-0! shadow-none! border-none!">
          <Icon name="solar:settings-bold" class="text-4xl" />
        </NuxtLink>
      </div>
      <div class="flex items-center justify-between">
        <p class="k-muted">
          {{ items.length }} Items • {{ criteria.length }} Criteria
        </p>
      </div>
    </div>

    <!-- Ranking View (Main Content) -->
    <RankingView
      :items="items"
      :criteria="criteria"
      :mode="list.rankingMode"
    />

    <!-- Add Item FAB -->
    <div class="fixed bottom-20 right-4 z-30 sm:absolute sm:bottom-4 sm:right-4">
      <NuxtLink :to="`/lists/${listId}/add`" class="k-btn k-btn-primary shadow-lg rounded-full !w-14 !h-14 !min-w-0 !p-0 flex items-center justify-center">
        <Icon name="solar:add-circle-bold" class="text-3xl" />
      </NuxtLink>
    </div>
  </div>
  <div v-else class="flex justify-center py-20">
    <div class="k-card k-card-accent">
      <span class="k-section-title">
        Loading
      </span>
    </div>
  </div>
</template>
