<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'
import { db } from '~/utils/db'

type RankingMode = import('~/types').RankingMode

const route = useRoute()
const router = useRouter()
const listId = Number(route.params.id)

const {
  list,
  criteria,
  fetchDetails,
  addCriteria,
  removeCriteria,
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

async function handleDelete() {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this list? This cannot be undone.')) {
    await db.lists.delete(listId)
    await db.criteria.where('listId').equals(listId).delete()
    await db.items.where('listId').equals(listId).delete()
    router.push('/')
  }
}

async function handleRename() {
  if (list.value && list.value.name.trim()) {
    await db.lists.update(listId, { name: list.value.name })
  }
}
</script>

<template>
  <div v-if="list" class="space-y-6 pb-20">
    <!-- Header -->
    <div class="k-card space-y-4">
      <div class="flex items-center gap-4">
        <NuxtLink :to="`/lists/${listId}`" class="k-btn k-btn-ghost p-0! shadow-none! border-none!">
          <Icon name="solar:arrow-left-linear" class="text-3xl" />
        </NuxtLink>
        <div>
          <p class="k-section-subtitle">
            Configuration
          </p>
          <h1 class="k-title">
            Settings
          </h1>
        </div>
      </div>
    </div>

    <!-- General Settings -->
    <div class="k-card space-y-6">
      <h2 class="k-section-title">
        General
      </h2>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold">List Name</span>
        </label>
        <input
          v-model="list.name"
          type="text"
          class="k-input mt-2"
          @blur="handleRename"
        >
      </div>

      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold">Ranking Mode</span>
        </label>
        <div class="grid mt-2 grid-cols-2 gap-2">
          <button
            class="k-btn flex items-center gap-2"
            :class="list.rankingMode === 'manual' ? 'k-btn-primary' : 'k-btn-ghost'"
            @click="updateRankingMode('manual')"
          >
            <Icon name="solar:reorder-bold" class="text-xl" />
            Manual
          </button>
          <button
            class="k-btn flex items-center gap-2"
            :class="list.rankingMode === 'weighted' ? 'k-btn-primary' : 'k-btn-ghost'"
            @click="updateRankingMode('weighted')"
          >
            <Icon name="solar:chart-square-bold" class="text-xl" />
            Weighted
          </button>
        </div>
        <p class="text-xs text-(--color-text-muted) mt-4">
          {{ list.rankingMode === 'manual' ? 'Drag and drop items to order them manually.' : 'Items are ordered based on criteria scores.' }}
        </p>
      </div>
    </div>

    <!-- Criteria Settings -->
    <CriteriaManager
      :criteria="criteria"
      @add="addCriteria"
      @remove="removeCriteria"
    />

    <!-- Danger Zone -->
    <div class="k-card border-error">
      <h2 class="k-section-title text-error">
        Danger Zone
      </h2>
      <p class="text-sm mb-4">
        Once you delete a list, there is no going back. Please be certain.
      </p>
      <button class="k-btn k-btn-primary bg-error text-error-content w-full flex items-center justify-center gap-2" @click="handleDelete">
        <Icon name="solar:trash-bin-trash-bold" class="text-xl" />
        Delete List
      </button>
    </div>
  </div>
</template>
