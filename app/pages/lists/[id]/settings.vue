<script setup lang="ts">
import type { RankingMode } from '~/types'
import { BarChart2, ChevronRight, GripVertical, Scale, Trash2 } from 'lucide-vue-next'
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
} = useListDetails(listId)

const showDeleteDialog = ref(false)

onMounted(() => {
  fetchDetails()
})

async function updateRankingMode(mode: RankingMode) {
  if (list.value) {
    list.value.rankingMode = mode
    await db.lists.update(listId, { rankingMode: mode })
  }
}

async function confirmDelete() {
  try {
    await db.lists.delete(listId)
    await db.criteria.where('listId').equals(listId).delete()
    await db.items.where('listId').equals(listId).delete()
    router.push('/')
  }
  catch {
    // silent
  }
}

async function handleRename() {
  if (list.value && list.value.name.trim()) {
    try {
      await db.lists.update(listId, { name: list.value.name })
    }
    catch {
      // silent
    }
  }
}
</script>

<template>
  <div v-if="list" class="space-y-6 pt-4 min-h-full animate-fade-in-up pb-32">
    <!-- Header -->
    <header class="px-5 flex items-center justify-between mb-2">
      <NuxtLink :to="`/lists/${listId}`" class="active-scale-down-sm size-10 flex items-center justify-center -ml-2 text-primary">
        <span class="text-[17px] font-medium tracking-tight">Done</span>
      </NuxtLink>
    </header>

    <div class="px-5 space-y-8">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p class="text-[15px] text-muted-foreground">
          {{ list.name }}
        </p>
      </div>

      <!-- General Settings -->
      <div class="space-y-4">
        <h2 class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">
          General
        </h2>

        <div class="ios-list shadow-md">
          <div class="p-4 bg-transparent flex items-center gap-4">
            <label for="list-name" class="text-[17px] text-foreground font-medium whitespace-nowrap">Name</label>
            <input
              id="list-name"
              v-model="list.name"
              type="text"
              class="w-full bg-transparent border-0 text-[17px] text-zinc-400 focus:ring-0 text-right outline-none"
              @blur="handleRename"
            >
          </div>
        </div>
      </div>

      <!-- Ranking Mode -->
      <div class="space-y-4">
        <h2 class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">
          Ranking Mode
        </h2>

        <div class="ios-list shadow-md">
          <button
            class="ios-list-item w-full flex items-center justify-between active-scale-down-sm group"
            @click="updateRankingMode('manual')"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors" :class="list.rankingMode === 'manual' ? 'bg-primary' : 'bg-zinc-800'">
                <GripVertical :size="16" :class="list.rankingMode === 'manual' ? 'text-primary-foreground' : 'text-zinc-400'" />
              </div>
              <div class="text-left">
                <p class="text-[17px] font-medium text-foreground">
                  Manual
                </p>
                <p class="text-[13px] text-muted-foreground">
                  Drag and drop ordering
                </p>
              </div>
            </div>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors" :class="list.rankingMode === 'manual' ? 'border-primary' : 'border-zinc-700'">
              <div v-if="list.rankingMode === 'manual'" class="w-2.5 h-2.5 rounded-full bg-primary animate-scale-in" />
            </div>
          </button>

          <button
            class="ios-list-item w-full flex items-center justify-between active-scale-down-sm group border-t border-white/5"
            @click="updateRankingMode('weighted')"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors" :class="list.rankingMode === 'weighted' ? 'bg-primary' : 'bg-zinc-800'">
                <BarChart2 :size="16" :class="list.rankingMode === 'weighted' ? 'text-primary-foreground' : 'text-zinc-400'" />
              </div>
              <div class="text-left">
                <p class="text-[17px] font-medium text-foreground">
                  Weighted
                </p>
                <p class="text-[13px] text-muted-foreground">
                  Intelligent scoring
                </p>
              </div>
            </div>
            <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors" :class="list.rankingMode === 'weighted' ? 'border-primary' : 'border-zinc-700'">
              <div v-if="list.rankingMode === 'weighted'" class="w-2.5 h-2.5 rounded-full bg-primary animate-scale-in" />
            </div>
          </button>
        </div>
      </div>

      <!-- Configuration -->
      <div class="space-y-4">
        <h2 class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">
          Configuration
        </h2>

        <div class="ios-list shadow-md">
          <NuxtLink :to="`/lists/${listId}/criteria`" class="ios-list-item group">
            <div class="w-8 h-8 rounded-full bg-success flex items-center justify-center shrink-0 shadow-sm shadow-success/30 mr-3">
              <Scale :size="16" class="text-success-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[17px] font-medium text-foreground">
                Criteria
              </p>
            </div>
            <div class="flex items-center gap-2">
              <p class="text-[15px] text-muted-foreground truncate">
                {{ criteria.length === 0 ? 'None' : criteria.length }}
              </p>
              <ChevronRight :size="20" class="text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="pt-4">
        <div class="ios-list shadow-md ring-destructive/20 border border-destructive/10">
          <button class="ios-list-item w-full text-left active-scale-down-sm flex items-center gap-3" @click="showDeleteDialog = true">
            <Trash2 :size="20" class="text-destructive shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-[17px] font-medium text-destructive">
                Delete List
              </p>
            </div>
          </button>
        </div>
        <p class="text-[13px] text-muted-foreground text-center mt-3">
          This action cannot be undone.
        </p>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UiAlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>Delete List?</UiAlertDialogTitle>
          <UiAlertDialogDescription>
            This action cannot be undone. The list and all its rankings will be lost forever.
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>
        <UiAlertDialogFooter>
          <UiAlertDialogCancel @click="showDeleteDialog = false">
            Cancel
          </UiAlertDialogCancel>
          <UiAlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="confirmDelete"
          >
            Delete
          </UiAlertDialogAction>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>
</template>
