<script setup lang="ts">
import type { RankingMode } from '~/types'
import { BarChart2, ChevronLeft, GripVertical, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'
import { db } from '~/utils/db'

const route = useRoute()
const router = useRouter()
const listId = Number(route.params.id)

const {
  list,
  criteria,
  fetchDetails,
  addCriteria,
  updateCriteria,
  removeCriteria,
} = useListDetails(listId)

const showDeleteModal = ref(false)

onMounted(() => {
  fetchDetails()
})

async function updateRankingMode(mode: RankingMode) {
  if (list.value) {
    list.value.rankingMode = mode
    await db.lists.update(listId, { rankingMode: mode })
  }
}

function handleDelete() {
  showDeleteModal.value = true
}

async function confirmDelete() {
  await db.lists.delete(listId)
  await db.criteria.where('listId').equals(listId).delete()
  await db.items.where('listId').equals(listId).delete()
  router.push('/')
}

async function handleRename() {
  if (list.value && list.value.name.trim()) {
    await db.lists.update(listId, { name: list.value.name })
  }
}
</script>

<template>
  <div v-if="list" class="p-6 space-y-8 pb-20 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink
        :to="`/lists/${listId}`"
        class="btn btn-ghost rounded-full !p-3 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors"
      >
        <ChevronLeft :size="24" stroke-width="2.5" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl text-display text-white">
          Settings
        </h1>
        <p class="text-surface-400 font-medium">
          Configure list options
        </p>
      </div>
    </div>

    <!-- General Settings -->
    <div class="card space-y-6">
      <h2 class="text-xl font-bold text-white">
        General
      </h2>

      <div class="space-y-2">
        <label class="text-sm font-bold uppercase tracking-wider text-surface-400 ml-1">List Name</label>
        <input
          v-model="list.name"
          type="text"
          class="input bg-surface-950 border-surface-800 focus:border-primary-500 focus:ring-primary-500/20 placeholder:text-surface-600"
          @blur="handleRename"
        >
      </div>

      <div class="space-y-2">
        <label class="text-sm font-bold uppercase tracking-wider text-surface-400 ml-1">Ranking Mode</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            class="btn flex items-center gap-2 justify-center border"
            :class="list.rankingMode === 'manual' ? 'bg-primary-500 text-primary-950 border-primary-500' : 'bg-surface-950 border-surface-800 text-surface-400 hover:border-surface-600'"
            @click="updateRankingMode('manual')"
          >
            <GripVertical :size="20" />
            Manual
          </button>
          <button
            class="btn flex items-center gap-2 justify-center border"
            :class="list.rankingMode === 'weighted' ? 'bg-primary-500 text-primary-950 border-primary-500' : 'bg-surface-950 border-surface-800 text-surface-400 hover:border-surface-600'"
            @click="updateRankingMode('weighted')"
          >
            <BarChart2 :size="20" />
            Weighted
          </button>
        </div>
        <div class="text-xs text-surface-500 px-1">
          <span v-if="list.rankingMode === 'manual'">Drag and drop items to order them manually.</span>
          <span v-else>Items are ordered based on weighted criteria scores.</span>
        </div>
      </div>
    </div>

    <!-- Criteria Settings -->
    <CriteriaManager
      :criteria="criteria"
      @add="addCriteria"
      @update="updateCriteria"
      @remove="removeCriteria"
    />

    <!-- Danger Zone -->
    <div class="card border-red-500/30 bg-red-500/5 space-y-4">
      <h2 class="text-xl font-bold text-red-400">
        Danger Zone
      </h2>
      <p class="text-sm text-surface-400">
        Once you delete a list, there is no going back. Please be certain.
      </p>
      <button
        class="btn bg-red-500 hover:bg-red-600 text-white w-full flex items-center justify-center gap-2 border-0 shadow-none"
        @click="handleDelete"
      >
        <Trash2 :size="20" />
        Delete List
      </button>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center px-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" @click="showDeleteModal = false" />

      <!-- Modal Content -->
      <div
        class="card w-full max-w-sm relative z-10 animate-fade-in-up border-red-500/20 shadow-[0_0_50px_-20px_rgba(239,68,68,0.5)]"
      >
        <h3 class="text-xl font-bold text-white mb-2">
          Delete List?
        </h3>
        <p class="text-surface-400 mb-8 leading-relaxed">
          This action cannot be undone. The list and all its rankings
          will be lost forever.
        </p>

        <div class="grid grid-cols-2 gap-4">
          <button class="btn bg-surface-800 text-white hover:bg-surface-700" @click="showDeleteModal = false">
            Cancel
          </button>
          <button class="btn bg-red-500 text-white hover:bg-red-600 shadow-none border-0" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
