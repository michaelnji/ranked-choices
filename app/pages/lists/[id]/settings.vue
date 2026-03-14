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
  <div v-if="list" class="space-y-8 animate-fade-in-up">
    <AppHeader title="Settings" :subtitle="list.name" :back="`/lists/${listId}`" back-label="Back to list" />

    <div class="px-6 pb-6 space-y-6">
      <!-- General Settings -->
      <UiCard>
        <UiCardContent class="space-y-6 pt-6">
          <h2 class="text-xl font-bold text-foreground">
            General
          </h2>

          <div class="space-y-2">
            <UiLabel for="list-name" class="text-label ml-1">
              List Name
            </UiLabel>
            <UiInput
              id="list-name" v-model="list.name" type="text"
              @blur="handleRename"
            />
          </div>

          <div class="space-y-2">
            <UiLabel id="ranking-mode-label" class="text-label ml-1">
              Ranking Mode
            </UiLabel>
            <div role="group" aria-labelledby="ranking-mode-label" class="grid grid-cols-2 gap-3">
              <UiButton
                :variant="list.rankingMode === 'manual' ? 'default' : 'outline'" class="justify-center gap-2"
                @click="updateRankingMode('manual')"
              >
                <GripVertical :size="18" />
                Manual
              </UiButton>
              <UiButton
                :variant="list.rankingMode === 'weighted' ? 'default' : 'outline'" class="justify-center gap-2"
                @click="updateRankingMode('weighted')"
              >
                <BarChart2 :size="18" />
                Weighted
              </UiButton>
            </div>
            <p class="text-xs text-muted-foreground px-1">
              <span v-if="list.rankingMode === 'manual'">Drag and drop items to order them manually.</span>
              <span v-else>Items are ordered based on weighted criteria scores.</span>
            </p>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Criteria Navigation Row -->
      <NuxtLink :to="`/lists/${listId}/criteria`">
        <UiCard class="hover:border-primary/30 transition-colors">
          <UiCardContent class="flex items-center gap-4 py-4 px-5">
            <div class="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
              <Scale :size="16" class="text-success" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-foreground">
                Criteria
              </p>
              <p class="text-xs text-muted-foreground mt-0.5">
                {{ criteria.length === 0 ? 'No criteria defined yet' : `${criteria.length} criterion${criteria.length !== 1 ? 'a' : 'on'} defined` }}
              </p>
            </div>
            <ChevronRight :size="16" class="text-muted-foreground shrink-0" />
          </UiCardContent>
        </UiCard>
      </NuxtLink>

      <!-- Danger Zone -->
      <UiCard class="border-destructive/30 bg-destructive/5">
        <UiCardContent class="space-y-4 pt-6">
          <h2 class="text-xl font-bold text-destructive">
            Danger Zone
          </h2>
          <p class="text-sm text-muted-foreground">
            Once you delete a list, there is no going back. Please be certain.
          </p>
          <UiButton variant="destructive" class="w-full" @click="showDeleteDialog = true">
            <Trash2 :size="18" class="mr-2" />
            Delete List
          </UiButton>
        </UiCardContent>
      </UiCard>
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
