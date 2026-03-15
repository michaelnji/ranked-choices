<script setup lang="ts">
import { Check, Save, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'

const route = useRoute()
const router = useRouter()
const listId = Number(route.params.id)
const itemId = Number(route.params.itemId)

const {
  criteria,
  items,
  fetchDetails,
  updateItem,
  removeItem,
} = useListDetails(listId)

const name = ref('')
const scores = ref<Record<number, number>>({})
const isReady = ref(false)
const showDeleteDialog = ref(false)

onMounted(async () => {
  await fetchDetails()
  const item = items.value.find(i => i.id === itemId)
  if (item) {
    name.value = item.name
    scores.value = { ...item.scores }
    isReady.value = true
  }
  else {
    router.push(`/lists/${listId}`)
  }
})

async function handleSave() {
  if (!name.value.trim())
    return
  try {
    await updateItem(itemId, name.value, scores.value)
    router.push(`/lists/${listId}/items/${itemId}`)
  }
  catch {
    // silent
  }
}

async function confirmRemove() {
  try {
    await removeItem(itemId)
    router.push(`/lists/${listId}`)
  }
  catch {
    // silent
  }
}

function toggleScore(criteriaId: number) {
  const current = scores.value[criteriaId] || 0
  scores.value[criteriaId] = current > 0 ? 0 : 10
}
</script>

<template>
  <div v-if="isReady" class="min-h-screen bg-background pb-32 animate-fade-in-up">
    <AppHeader title="Edit Item" subtitle="Update details" :back="`/lists/${listId}/items/${itemId}`" />

    <div class="px-5 mt-6 space-y-8">
      <form class="space-y-8" @submit.prevent="handleSave">
        <!-- Item Name -->
        <div class="space-y-2">
          <label for="item-name" class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">
            Item Name
          </label>
          <div class="ios-list p-1 shadow-sm">
            <input
              id="item-name"
              v-model="name"
              type="text"
              placeholder="Enter item name..."
              class="w-full bg-transparent border-0 px-4 py-3.5 text-[19px] font-medium text-foreground placeholder:text-zinc-600 focus:ring-0 focus:outline-none"
              autofocus
            >
          </div>
        </div>

        <!-- Criteria Selection -->
        <div v-if="criteria.length > 0" class="space-y-2">
          <div class="mb-2">
            <h3 id="criteria-match-label" class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">
              Criteria Match
            </h3>
          </div>

          <div class="ios-list p-0 overflow-hidden shadow-sm" role="group" aria-labelledby="criteria-match-label">
            <button
              v-for="(c, idx) in criteria" :key="c.id"
              role="checkbox"
              :aria-checked="(scores[c.id!] || 0) > 0"
              type="button"
              class="ios-list-item w-full flex items-center justify-between p-4 px-5 active-scale-down-sm relative"
              @click="c.id && toggleScore(c.id)"
            >
              <span class="text-[17px] font-medium transition-colors text-foreground">
                {{ c.name }}
              </span>

              <!-- Custom Native-Feeling Checkbox -->
              <div
                class="w-7 h-7 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-300"
                :class="(scores[c.id!] || 0) > 0
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-zinc-700 bg-zinc-800/50'"
              >
                <Check v-if="(scores[c.id!] || 0) > 0" :size="16" :stroke-width="3.5" class="animate-in zoom-in text-white" />
              </div>

              <!-- Separator line -->
              <div v-if="idx !== criteria.length - 1" class="h-[1px] bg-white/5 absolute bottom-0 left-5 right-0 pointer-events-none" />
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-4 pt-4">
          <button
            type="submit"
            class="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-[14px] font-semibold text-[17px] active-scale-down shadow-md disabled:opacity-50 transition-opacity"
            :disabled="!name.trim()"
          >
            <Save :size="20" />
            Save Changes
          </button>

          <button
            type="button"
            class="w-full flex items-center justify-center gap-2 bg-destructive/10 text-destructive py-4 rounded-[14px] font-semibold text-[17px] active-scale-down"
            @click="showDeleteDialog = true"
          >
            <Trash2 :size="20" />
            Delete Item
          </button>
        </div>
      </form>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UiAlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <UiAlertDialogContent class="bg-zinc-900 border border-white/10 rounded-[24px]">
        <UiAlertDialogHeader>
          <UiAlertDialogTitle class="text-[20px] font-semibold text-foreground tracking-tight">
            Delete Item?
          </UiAlertDialogTitle>
          <UiAlertDialogDescription class="text-[15px] text-muted-foreground">
            This action cannot be undone. The item and its scores will be lost forever.
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>
        <UiAlertDialogFooter class="gap-2 sm:gap-0 mt-2">
          <UiAlertDialogCancel class="rounded-xl border-white/10 text-foreground active-scale-down-sm" @click="showDeleteDialog = false">
            Cancel
          </UiAlertDialogCancel>
          <UiAlertDialogAction
            class="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 active-scale-down-sm font-semibold"
            @click="confirmRemove"
          >
            Delete
          </UiAlertDialogAction>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>
</template>
