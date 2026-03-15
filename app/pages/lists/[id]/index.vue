<script setup lang="ts">
import { Plus, Settings } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'

const route = useRoute()
const listId = Number(route.params.id)

const {
  list,
  criteria,
  items,
  fetchDetails,
  updateItemRanks,
} = useListDetails(listId)

onMounted(() => {
  fetchDetails()
})
</script>

<template>
  <div v-if="list" class="flex flex-col h-full animate-fade-in-up">
    <!-- Header -->
    <AppHeader :title="list.name" :subtitle="`${items.length} Items · ${criteria.length} Criteria`" back="/">
      <template #right>
        <NuxtLink :to="`/lists/${listId}/settings`">
          <UiButton variant="ghost" size="icon" class="h-11 w-11 text-muted-foreground hover:text-foreground" aria-label="List settings">
            <Settings :size="20" :stroke-width="2" />
          </UiButton>
        </NuxtLink>
      </template>
    </AppHeader>

    <!-- Main Content -->
    <div class="flex-1 px-5 py-4 pb-32">
      <RankingView
        :items="items" :criteria="criteria" :mode="list.rankingMode" :list-id="listId"
        @reorder="updateItemRanks"
      />
    </div>

    <!-- FAB -->
    <div class="fixed bottom-6 right-5 z-40">
      <NuxtLink :to="`/lists/${listId}/add`" class="active-scale-down block" aria-label="Add item">
        <button class="flex items-center justify-center size-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-white/10 hover:bg-primary/90 transition-all">
          <Plus :size="28" stroke-width="2.5" />
        </button>
      </NuxtLink>
    </div>
  </div>

  <!-- Loading / Not found state -->
  <div v-else class="flex items-center justify-center h-[50vh]">
    <div class="flex flex-col items-center gap-4">
      <UiSkeleton class="h-6 w-48 rounded-lg" />
      <UiSkeleton class="h-4 w-32 rounded-lg" />
      <div class="space-y-3 w-full max-w-xs mt-6">
        <UiSkeleton class="h-16 w-full rounded-xl" />
        <UiSkeleton class="h-16 w-full rounded-xl" />
        <UiSkeleton class="h-16 w-full rounded-xl" />
      </div>
    </div>
  </div>
</template>
