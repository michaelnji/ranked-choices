<script setup lang="ts">
import { Check, Save, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-hot-toast'
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
    toast.success('Item updated successfully')
    router.push(`/lists/${listId}/items/${itemId}`)
  }
  catch {
    toast.error('Failed to update item')
  }
}

async function confirmRemove() {
  try {
    await removeItem(itemId)
    toast.success('Item deleted successfully')
    router.push(`/lists/${listId}`)
  }
  catch {
    toast.error('Failed to delete item')
  }
}

function toggleScore(criteriaId: number) {
  const current = scores.value[criteriaId] || 0
  scores.value[criteriaId] = current > 0 ? 0 : 10
}
</script>

<template>
  <div v-if="isReady" class="space-y-8 animate-fade-in-up">
    <AppHeader title="Edit Item" subtitle="Update details" :back="`/lists/${listId}/items/${itemId}`" />

    <div class="px-6 pb-6">
      <UiCard>
        <UiCardContent class="pt-6">
          <form class="space-y-8" @submit.prevent="handleSave">
            <!-- Name Input -->
            <div class="space-y-2">
              <UiLabel for="item-name" class="text-label ml-1">
                Item Name
              </UiLabel>
              <UiInput
                id="item-name" v-model="name" type="text"
                class="h-14 text-lg" autofocus
              />
            </div>

            <!-- Criteria Selection -->
            <div v-if="criteria.length > 0" class="space-y-4">
              <div class="pb-2">
                <h3 id="criteria-match-label" class="text-lg font-bold text-foreground">
                  Criteria Match
                </h3>
                <p class="text-sm text-muted-foreground">
                  Select all criteria that apply to this item.
                </p>
              </div>
              <UiSeparator />

              <div class="grid gap-3" role="group" aria-labelledby="criteria-match-label">
                <button
                  v-for="c in criteria" :key="c.id"
                  role="checkbox"
                  :aria-checked="(scores[c.id!] || 0) > 0"
                  type="button"
                  class="group relative flex items-center justify-between p-4 rounded-xl border transition-all text-left"
                  :class="(scores[c.id!] || 0) > 0
                    ? 'bg-primary/10 border-primary text-foreground'
                    : 'bg-background border-zinc-800 text-muted-foreground hover:border-muted-foreground/50'"
                  @click="c.id && toggleScore(c.id)"
                >
                  <span class="font-bold text-lg">{{ c.name }}</span>
                  <div
                    class="w-6 h-6 rounded-full border flex items-center justify-center transition-all" :class="(scores[c.id!] || 0) > 0
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-muted-foreground/50 group-hover:border-muted-foreground'"
                  >
                    <Check v-if="(scores[c.id!] || 0) > 0" :size="16" :stroke-width="4" aria-hidden="true" />
                  </div>
                </button>
              </div>
            </div>

            <!-- Save Button -->
            <UiButton type="submit" class="w-full h-14 text-lg" :disabled="!name.trim()">
              <Save :size="22" class="mr-2" />
              Save Changes
            </UiButton>

            <!-- Delete Button -->
            <UiButton
              type="button" variant="ghost" class="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              @click="showDeleteDialog = true"
            >
              <Trash2 :size="18" class="mr-2" />
              Delete Item
            </UiButton>
          </form>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UiAlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>Delete Item?</UiAlertDialogTitle>
          <UiAlertDialogDescription>
            This action cannot be undone. The item and its scores will be lost forever.
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>
        <UiAlertDialogFooter>
          <UiAlertDialogCancel @click="showDeleteDialog = false">
            Cancel
          </UiAlertDialogCancel>
          <UiAlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="confirmRemove"
          >
            Delete
          </UiAlertDialogAction>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>
</template>
