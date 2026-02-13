<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'

const route = useRoute()
const router = useRouter()
const listId = Number(route.params.id)

const {
  criteria,
  fetchDetails,
  addItem,
} = useListDetails(listId)

onMounted(() => {
  fetchDetails()
})

const name = ref('')
const scores = ref<Record<number, number>>({})

async function handleSave() {
  if (!name.value.trim())
    return

  await addItem(name.value, scores.value)
  router.push(`/lists/${listId}`)
}
</script>

<template>
  <div class="space-y-6 pb-20">
    <!-- Header -->
    <div class="k-card space-y-4">
      <div class="flex items-center gap-4">
        <NuxtLink :to="`/lists/${listId}`" class="k-btn k-btn-ghost p-0! shadow-none! border-none!">
          <Icon name="solar:arrow-left-linear" class="text-3xl" />
        </NuxtLink>
        <div>
          <p class="k-section-subtitle">
            New Entry
          </p>
          <h1 class="k-title">
            Add Item
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
          placeholder="e.g. Paris"
          class="k-input"
          autofocus
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
                name="solar:verified-check-linear"
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

      <div class="pt-4">
        <button
          class="k-btn k-btn-primary w-full flex items-center justify-center gap-2"
          :disabled="!name.trim()"
          @click="handleSave"
        >
          <Icon name="solar:diskette-bold" class="text-xl" />
          Save Item
        </button>
      </div>
    </div>
  </div>
</template>
