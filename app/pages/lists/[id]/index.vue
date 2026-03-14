<script setup lang="ts">
import { ChevronLeft, Loader2, Plus, Settings } from 'lucide-vue-next'
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
    <div
      class="px-6 pt-6 pb-4 flex items-center justify-between sticky top-0 z-20 bg-surface-950/95 backdrop-blur-sm border-b border-surface-800/50"
    >
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/"
          class="btn btn-ghost rounded-full !p-2 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors"
        >
          <ChevronLeft :size="24" stroke-width="2.5" />
        </NuxtLink>
        <div>
          <h1 class="text-xl font-display font-bold text-white truncate max-w-[200px] leading-none">
            {{ list.name }}
          </h1>
          <p class="text-xs font-bold uppercase tracking-wider text-surface-400 mt-1">
            {{ items.length }} Items • {{ criteria.length }} Criteria
          </p>
        </div>
      </div>
      <NuxtLink
        :to="`/lists/${listId}/settings`"
        class="btn btn-ghost rounded-full !p-2 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors"
      >
        <Settings :size="24" stroke-width="2" />
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div class="flex-1 px-6 py-4 pb-24">
      <RankingView
        :items="items" :criteria="criteria" :mode="list.rankingMode" :list-id="listId"
        @reorder="updateItemRanks"
      />
    </div>

    <!-- FAB -->
    <div class="fixed! bottom-6 right-6 z-30 ">
      <NuxtLink
        :to="`/lists/${listId}/add`"
        class="btn btn-primary rounded-full !w-14 !h-14 !p-0 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <Plus :size="28" stroke-width="3" />
      </NuxtLink>
    </div>
  </div>

  <div v-else class="flex items-center justify-center h-[50vh]">
    <div class="flex flex-col items-center gap-4 text-surface-400">
      <Loader2 :size="40" class="animate-spin text-primary-500" />
      <span class="font-bold tracking-wide text-sm">LOADING LIST...</span>
    </div>
  </div>
</template>
