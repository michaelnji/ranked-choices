<script setup lang="ts">
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

onMounted(async () => {
  await fetchDetails()
  const item = items.value.find(i => i.id === itemId)
  if (item) {
    name.value = item.name
    scores.value = { ...item.scores }
    isReady.value = true
  }
  else {
    // Item not found, maybe redirect
    router.push(`/lists/${listId}`)
  }
})

async function handleSave() {
  if (!name.value.trim())
    return

  await updateItem(itemId, name.value, scores.value)
  router.push(`/lists/${listId}/items/${itemId}`)
}

async function handleDelete() {
  // eslint-disable-next-line no-alert
  if (confirm('Delete this item?')) {
    await removeItem(itemId)
    router.push(`/lists/${listId}`)
  }
}
</script>

<template>
  <div v-if="isReady" class="space-y-6 pb-20">
    <!-- Header -->
    <div class="k-card space-y-4">
      <div class="flex items-center gap-4">
        <NuxtLink :to="`/lists/${listId}/items/${itemId}`" class="k-btn k-btn-ghost">
          <Icon name="solar:arrow-left-bold" class="text-xl" />
        </NuxtLink>
        <div>
          <p class="k-section-subtitle">
            Editing
          </p>
          <h1 class="k-title">
            {{ name }}
          </h1>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="k-card space-y-6">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold">Item Name</span>
        </label>
        <input
          v-model="name"
          type="text"
          class="k-input"
        >
      </div>

      <div v-if="criteria.length > 0" class="space-y-4">
        <h3 class="font-bold border-b-[3px] border-(--color-text) pb-2 uppercase tracking-wide">
          Criteria Match
        </h3>
        <p class="text-sm text-(--color-text-muted) font-bold">
          Select all criteria that apply to this item.
        </p>
        <div class="grid gap-4">
          <div
            v-for="c in criteria"
            :key="c.id"
            class="k-checkbox-card"
            :class="{ 'k-checkbox-card-selected': (scores[c.id!] || 0) > 0 }"
            @click="scores[c.id!] = (scores[c.id!] || 0) > 0 ? 0 : 10"
          >
            <span class="font-black uppercase tracking-wide">{{ c.name }}</span>
            <div class="border-[3px] border-(--color-text) bg-(--color-surface) w-8 h-8 flex items-center justify-center">
              <Icon
                v-if="(scores[c.id!] || 0) > 0"
                name="solar:check-read-bold"
                class="text-xl text-(--color-text)"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="k-card bg-warning text-warning-content border-warning">
        <div class="font-bold flex items-center gap-2">
          <Icon name="solar:danger-triangle-bold" />
          No criteria defined
        </div>
        <p class="text-sm mt-1">
          You must define criteria in Settings before adding items.
        </p>
      </div>

      <div class="flex gap-4 pt-4">
        <button
          class="k-btn k-btn-primary flex-1 flex items-center justify-center gap-2"
          :disabled="!name.trim()"
          @click="handleSave"
        >
          <Icon name="solar:diskette-bold" class="text-xl" />
          Save Changes
        </button>
      </div>
    </div>

    <div class="k-card border-error">
      <button class="k-btn k-btn-primary bg-error text-error-content w-full flex items-center justify-center gap-2" @click="handleDelete">
        <Icon name="solar:trash-bin-trash-bold" class="text-xl" />
        Delete Item
      </button>
    </div>
  </div>
</template>
