<script setup lang="ts">
import { ArrowRight, Calendar1, LayoutList, PlusCircle, Scale, Target, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useLists } from '~/composables/useLists'

const { lists, fetchLists, deleteList } = useLists()
const deleteCandidateId = ref<number | null>(null)
const showDeleteDialog = ref(false)

onMounted(() => {
  fetchLists()
})

function handleDelete(id: number) {
  deleteCandidateId.value = id
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (deleteCandidateId.value == null)
    return
  try {
    await deleteList(deleteCandidateId.value)
    deleteCandidateId.value = null
    showDeleteDialog.value = false
  }
  catch {
    // silent
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diffInSeconds < 60)
    return 'Just now'
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`

  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="p-5 space-y-6 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between pt-1">
      <div class="flex items-center gap-2.5">
        <svg width="22" height="22" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
          <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
          <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
        </svg>
        <h1 class="text-2xl text-display text-foreground">
          My Lists
        </h1>
      </div>
      <NuxtLink v-if="lists.length > 0" to="/new">
        <UiButton size="icon" class="rounded-lg h-11 w-11" aria-label="Create new list">
          <PlusCircle :size="18" :stroke-width="2" />
        </UiButton>
      </NuxtLink>
    </div>

    <!-- Empty State with Inline Onboarding -->
    <div v-if="lists.length === 0" class="space-y-6">
      <div class="space-y-4">
        <p class="text-label">
          How it works
        </p>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
              <LayoutList :size="13" />
            </span>
            <div>
              <p class="text-sm font-semibold text-foreground">
                Create a list
              </p>
              <p class="text-xs text-muted-foreground mt-0.5">
                Name your decision — "Best Laptops", "Vacation Spots"
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-success/10 text-success shrink-0 mt-0.5">
              <Scale :size="13" />
            </span>
            <div>
              <p class="text-sm font-semibold text-foreground">
                Define criteria
              </p>
              <p class="text-xs text-muted-foreground mt-0.5">
                Set what matters: cost, quality, fit. Give each a weight.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-warning/10 text-warning shrink-0 mt-0.5">
              <Target :size="13" />
            </span>
            <div>
              <p class="text-sm font-semibold text-foreground">
                Score &amp; rank
              </p>
              <p class="text-xs text-muted-foreground mt-0.5">
                Add options and see which one wins based on your criteria.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NuxtLink to="/new">
        <UiButton class="w-full">
          <PlusCircle :size="16" class="mr-2" />
          Create your first list
        </UiButton>
      </NuxtLink>
    </div>

    <!-- List Items -->
    <ul v-else class="space-y-2">
      <li v-for="list in lists" :key="list.id">
        <div class="group flex items-center gap-3 bg-card border border-zinc-800 rounded-lg px-4 py-3 hover:border-primary/30 transition-all">
          <div class="flex-1 min-w-0">
            <h2 class="text-sm font-semibold text-foreground truncate">
              {{ list.name }}
            </h2>
            <div class="flex items-center gap-2 mt-1">
              <span class="flex items-center gap-1 text-xs text-muted-foreground">
                <LayoutList :size="11" />
                {{ list.itemCount }} items
              </span>
              <span class="text-muted-foreground/40">·</span>
              <span class="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar1 :size="11" />
                {{ formatTimeAgo(list.createdAt) }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <UiButton
              variant="ghost"
              size="icon"
              class="h-11 w-11 text-muted-foreground hover:text-destructive"
              :aria-label="`Delete ${list.name}`"
              @click.prevent="list.id && handleDelete(list.id)"
            >
              <Trash2 :size="15" />
            </UiButton>
            <NuxtLink :to="`/lists/${list.id}`">
              <UiButton size="icon" variant="ghost" class="h-11 w-11 text-muted-foreground hover:text-foreground" :aria-label="`Open ${list.name}`">
                <ArrowRight :size="15" />
              </UiButton>
            </NuxtLink>
          </div>
        </div>
      </li>
    </ul>

    <!-- Delete Confirmation Dialog -->
    <UiAlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>Delete list?</UiAlertDialogTitle>
          <UiAlertDialogDescription>
            This cannot be undone. The list and all its rankings will be permanently deleted.
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>
        <UiAlertDialogFooter>
          <UiAlertDialogCancel @click="showDeleteDialog = false">
            Cancel
          </UiAlertDialogCancel>
          <UiAlertDialogAction class="bg-destructive text-destructive-foreground hover:bg-destructive/90" @click="confirmDelete">
            Delete
          </UiAlertDialogAction>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>
</template>
