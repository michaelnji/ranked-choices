<script setup lang="ts">
import { AlertTriangle, Check, ChevronLeft, Save } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
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

function toggleScore(criteriaId: number) {
  const current = scores.value[criteriaId] || 0
  scores.value[criteriaId] = current > 0 ? 0 : 10
}
</script>

<template>
  <div class="p-6 space-y-8 pb-24 animate-fade-in-up">
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
          Add Item
        </h1>
        <p class="text-surface-400 font-medium">
          New entry for ranking
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
          placeholder="e.g. Paris"
          class="input bg-surface-950 border-surface-800 focus:border-primary-500 focus:ring-primary-500/20 placeholder:text-surface-600 h-14 text-lg"
          autofocus
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

      <!-- No Criteria Warning -->
      <div v-else class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex gap-4 text-yellow-500">
        <AlertTriangle :size="24" />
        <div>
          <h4 class="font-bold">
            No criteria defined
          </h4>
          <p class="text-sm opacity-90">
            You must define criteria in Settings before adding items.
          </p>
        </div>
      </div>

      <!-- Save Button -->
      <button
        class="btn btn-primary w-full flex items-center justify-center gap-2 text-lg h-14"
        :disabled="!name.trim()" @click="handleSave"
      >
        <Save :size="24" />
        Save Item
      </button>
    </div>
  </div>
</template>
