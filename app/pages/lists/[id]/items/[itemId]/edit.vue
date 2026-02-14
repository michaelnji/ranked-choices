<script setup lang="ts">
import { Check, ChevronLeft, Save, Trash2 } from 'lucide-vue-next'
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
const showDeleteModal = ref(false)

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

async function handleDelete() {
  showDeleteModal.value = true
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
  <div v-if="isReady" class="p-6 space-y-8 pb-6 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink
        :to="`/lists/${listId}/items/${itemId}`"
        class="btn btn-ghost rounded-full !p-3 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors"
      >
        <ChevronLeft :size="24" stroke-width="2.5" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl text-display text-white">
          Edit Item
        </h1>
        <p class="text-surface-400 font-medium">
          Update details
        </p>
      </div>
    </div>

    <div class="card space-y-8">
      <!-- Name Input -->
      <div class="space-y-2">
        <label class="text-sm font-bold uppercase tracking-wider text-surface-400 ml-1">Item Name</label>
        <input
          v-model="name"
          type="text"
          class="input bg-surface-950 border-surface-800 focus:border-primary-500 focus:ring-primary-500/20 placeholder:text-surface-600 h-14 text-lg"
          @keyup.enter="handleSave"
        >
      </div>

      <!-- Criteria Selection -->
      <div v-if="criteria.length > 0" class="space-y-4">
        <div class="border-b border-surface-800 pb-2">
          <h3 class="text-lg font-bold text-white">
            Criteria Match
          </h3>
          <p class="text-sm text-surface-400">
            Select all criteria that apply to this item.
          </p>
        </div>

        <div class="grid gap-3">
          <button
            v-for="c in criteria"
            :key="c.id"
            class="group relative flex items-center justify-between p-4 rounded-xl border transition-all text-left"
            :class="(scores[c.id!] || 0) > 0
              ? 'bg-primary-500/10 border-primary-500 text-white shadow-[0_0_15px_-5px_rgba(var(--color-primary-500),0.3)]'
              : 'bg-surface-950 border-surface-800 text-surface-400 hover:border-surface-600'"
            @click="c.id && toggleScore(c.id)"
          >
            <span class="font-bold text-lg">{{ c.name }}</span>
            <div
              class="w-6 h-6 rounded-full border flex items-center justify-center transition-all" :class="(scores[c.id!] || 0) > 0
                ? 'bg-primary-500 border-primary-500 text-primary-950'
                : 'border-surface-600 group-hover:border-surface-500'"
            >
              <Check v-if="(scores[c.id!] || 0) > 0" :size="16" stroke-width="4" />
            </div>
          </button>
        </div>
      </div>

      <!-- Save Button -->
      <button
        class="btn btn-primary w-full flex items-center justify-center gap-2 text-lg h-14"
        :disabled="!name.trim()" @click="handleSave"
      >
        <Save :size="24" />
        Save Changes
      </button>

      <!-- Delete Button -->
      <button
        class="btn btn-ghost text-red-400 hover:bg-red-500/10 hover:text-red-400 w-full flex items-center justify-center gap-2"
        @click="handleDelete"
      >
        <Trash2 :size="20" />
        Delete Item
      </button>

      <!-- Delete Modal -->
      <Teleport to="body">
        <div v-if="showDeleteModal" class="fixed inset-0 z-100 flex items-center justify-center px-6">
          <div
            class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            @click="showDeleteModal = false"
          />
          <div
            class="card w-full max-w-sm relative z-10 animate-fade-in-up border-red-500/20 shadow-[0_0_50px_-20px_rgba(239,68,68,0.5)]"
          >
            <h3 class="text-xl font-bold text-white mb-2">
              Delete Item?
            </h3>
            <p class="text-surface-400 mb-8 leading-relaxed">
              This action cannot be undone. The item and its scores will be
              lost forever.
            </p>
            <div class="grid grid-cols-2 gap-4">
              <button class="btn bg-surface-800 text-white hover:bg-surface-700" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn bg-red-500 text-white hover:bg-red-600 shadow-none border-0" @click="confirmRemove">
                Delete
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>
