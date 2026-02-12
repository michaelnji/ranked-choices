<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'
import { db } from '~/utils/db'

type RankingMode = import('~/types').RankingMode

const route = useRoute()
const listId = Number(route.params.id)

const {
  list,
  criteria,
  items,
  fetchDetails,
  addCriteria,
  removeCriteria,
  addItem,
  removeItem,
  updateItemScores,
} = useListDetails(listId)

onMounted(() => {
  fetchDetails()
})

async function updateRankingMode(mode: RankingMode) {
  if (list.value) {
    list.value.rankingMode = mode
    await db.lists.update(listId, { rankingMode: mode })
  }
}
</script>

<template>
  <div v-if="list" class="space-y-6 pb-20">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink to="/" class="btn btn-circle btn-ghost">
        <span class="i-solar-arrow-left-bold text-xl" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold">
          {{ list.name }}
        </h1>
        <p class="text-sm text-base-content/70">
          Created: {{ new Date(list.createdAt).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Inputs -->
      <div class="lg:col-span-5 space-y-6">
        <CriteriaManager
          :criteria="criteria"
          @add="addCriteria"
          @remove="removeCriteria"
        />
        <ItemManager
          :items="items"
          :criteria="criteria"
          @add="addItem"
          @remove="removeItem"
          @update-scores="updateItemScores"
        />
      </div>

      <!-- Right Column: Ranking -->
      <div class="lg:col-span-7">
        <div class="sticky top-4">
          <RankingView
            :items="items"
            :criteria="criteria"
            :mode="list.rankingMode"
            @update:mode="updateRankingMode"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex justify-center py-20">
    <span class="loading loading-spinner loading-lg text-primary" />
  </div>
</template>
