<script setup lang="ts">
import { FileQuestion, List as ListIcon, Pencil } from 'lucide-vue-next'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProgressBar from '~/components/ProgressBar.vue'
import { useListDetails } from '~/composables/useListDetails'

const route = useRoute()
const listId = Number(route.params.id)
const itemId = Number(route.params.itemId)

const {
  criteria,
  items,
  fetchDetails,
} = useListDetails(listId)

onMounted(async () => {
  await fetchDetails()
})

const item = computed(() => items.value.find(i => i.id === itemId))
</script>

<template>
  <div v-if="item" class="min-h-screen bg-background pb-24">
    <AppHeader :title="item.name" subtitle="Item Details" :back="`/lists/${listId}`">
      <template #right>
        <NuxtLink :to="`/lists/${listId}/items/${itemId}/edit`" class="active-scale-down flex items-center justify-center h-11 w-11 text-primary hover:text-primary/80 transition-colors">
          <Pencil :size="20" :stroke-width="2.5" />
        </NuxtLink>
      </template>
    </AppHeader>

    <div class="px-5 mt-6 space-y-8 animate-fade-in-up">
      <div class="space-y-4">
        <h2 class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">
          Scores
        </h2>

        <div v-if="criteria.length > 0" class="ios-list p-0 overflow-hidden shadow-sm">
          <div v-for="(c, idx) in criteria" :key="c.id" class="relative">
            <div class="p-5 space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-[17px] font-semibold text-foreground tracking-tight">{{ c.name }}</span>
                <div
                  class="px-3 py-1 rounded-full text-[13px] font-bold tracking-wide"
                  :class="(item.scores[c.id!] || 0) > 0
                    ? 'bg-success/15 text-success border border-success/30'
                    : 'bg-zinc-800 text-zinc-400 border border-white/5'"
                >
                  {{ (item.scores[c.id!] || 0) > 0 ? 'Yes' : 'No' }}
                </div>
              </div>
              <ProgressBar
                :value="item.scores[c.id!] || 0"
                :max="10"
                :label="`${c.name} score`"
              />
            </div>

            <!-- Separator -->
            <div v-if="idx !== criteria.length - 1" class="h-[1px] bg-white/5 ml-5 absolute bottom-0 left-0 right-0" />
          </div>
        </div>

        <div v-else class="text-center py-10 ios-list shadow-sm px-6 border border-white/5">
          <div class="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto mb-4 border border-white/10">
            <ListIcon :size="22" class="text-muted-foreground" />
          </div>
          <p class="text-[17px] font-semibold text-foreground tracking-tight">
            No criteria defined
          </p>
          <p class="text-[15px] text-muted-foreground mt-2 leading-relaxed">
            Go back to criteria settings to add ranking criteria for this list.
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Not found state -->
  <div v-else class="flex flex-col items-center justify-center h-[60vh] px-8 text-center animate-fade-in">
    <div class="w-16 h-16 rounded-[24px] bg-zinc-900 border border-white/10 shadow-xl flex items-center justify-center mx-auto mb-5 rotate-3">
      <FileQuestion :size="32" class="text-muted-foreground -rotate-3" />
    </div>

    <h2 class="text-[22px] font-bold text-foreground tracking-tight mb-2">
      Item Not Found
    </h2>

    <p class="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-[280px]">
      This item may have been deleted or the link might be broken.
    </p>

    <NuxtLink :to="`/lists/${listId}`" class="ios-list-item flex items-center justify-center w-full px-6 py-3.5 bg-primary/10 text-primary font-semibold rounded-[14px] active-scale-down">
      Go Back to List
    </NuxtLink>
  </div>
</template>
