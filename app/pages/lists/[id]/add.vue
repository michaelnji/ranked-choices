<script setup lang="ts">
import { AlertTriangle, Check, Save } from 'lucide-vue-next'
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

  if (criteria.value.length === 0)
    return

  try {
    await addItem(name.value, scores.value)
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
  <div class="space-y-6 pt-4 min-h-full animate-fade-in-up pb-32">
    <!-- Header -->
    <header class="px-5 flex items-center justify-between mb-2">
      <NuxtLink :to="`/lists/${listId}`" class="active-scale-down-sm size-10 flex items-center justify-center -ml-2 text-primary">
        <span class="text-[17px] font-medium tracking-tight">Cancel</span>
      </NuxtLink>
    </header>

    <div class="px-5 space-y-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">
        Add Item
      </h1>

      <form class="space-y-8" @submit.prevent="handleSave">
        <!-- Name Input -->
        <div class="ios-list shadow-md">
          <div class="p-4 bg-transparent flex items-center">
            <input
              id="item-name"
              v-model="name"
              type="text"
              placeholder="e.g. Paris"
              autofocus
              class="w-full bg-transparent border-0 text-[17px] focus:ring-0 placeholder:text-muted-foreground/60 text-foreground outline-none"
            >
          </div>
        </div>

        <!-- Criteria Selection -->
        <div v-if="criteria.length > 0" class="space-y-4">
          <div class="pb-1 px-1">
            <h3 id="criteria-match-label" class="text-[20px] font-semibold tracking-tight text-foreground">
              Criteria Match
            </h3>
            <p class="text-[14px] text-muted-foreground mt-1">
              Select all criteria that apply to this item.
            </p>
          </div>

          <div class="ios-list shadow-md" role="group" aria-labelledby="criteria-match-label">
            <button
              v-for="(c, index) in criteria" :key="c.id"
              role="checkbox"
              :aria-checked="(scores[c.id!] || 0) > 0"
              type="button"
              class="ios-list-item w-full flex items-center justify-between active-scale-down-sm group py-3.5"
              :class="index > 0 ? 'border-t border-white/5' : ''"
              @click="c.id && toggleScore(c.id)"
            >
              <span class="text-[17px] font-medium transition-colors" :class="(scores[c.id!] || 0) > 0 ? 'text-primary' : 'text-foreground'">
                {{ c.name }}
              </span>
              <div
                class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                :class="(scores[c.id!] || 0) > 0
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-zinc-700 bg-zinc-800/50'"
              >
                <Check v-if="(scores[c.id!] || 0) > 0" :size="14" stroke-width="3" aria-hidden="true" class="animate-scale-in" />
              </div>
            </button>
          </div>
        </div>

        <!-- No Criteria Warning -->
        <div v-else class="flex flex-col items-center text-center py-10 text-muted-foreground bg-warning/10 rounded-[24px] ring-1 ring-warning/20">
          <div class="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center mb-4">
            <AlertTriangle :size="24" class="text-warning" />
          </div>
          <p class="text-[17px] font-semibold text-warning mb-1 tracking-tight">
            No criteria defined
          </p>
          <p class="text-[14px] text-warning/80 max-w-[200px] mb-6 leading-snug">
            Define criteria in settings before adding items.
          </p>
          <NuxtLink :to="`/lists/${listId}/settings`">
            <button type="button" class="active-scale-down-sm px-5 py-2.5 rounded-full bg-warning hover:bg-warning/90 text-warning-foreground text-[15px] font-medium transition-colors shadow-md shadow-warning/20">
              Go to Settings
            </button>
          </NuxtLink>
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          class="active-scale-down flex items-center justify-center w-full h-[54px] rounded-[18px] text-[17px] font-semibold transition-all duration-300"
          :class="name.trim() && criteria.length > 0 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'"
          :disabled="!name.trim() || criteria.length === 0"
        >
          <Save v-if="name.trim() && criteria.length > 0" :size="20" class="mr-2" stroke-width="2.5" />
          Save Item
        </button>
      </form>
    </div>
  </div>
</template>
