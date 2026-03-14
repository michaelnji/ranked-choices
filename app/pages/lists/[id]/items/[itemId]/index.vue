<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
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
  <div v-if="item" class="space-y-8 animate-fade-in-up">
    <AppHeader :title="item.name" subtitle="Item Details" :back="`/lists/${listId}`">
      <template #right>
        <NuxtLink :to="`/lists/${listId}/items/${itemId}/edit`">
          <UiButton variant="ghost" size="icon" class="text-muted-foreground hover:text-foreground" aria-label="Edit item">
            <Pencil :size="18" :stroke-width="2" />
          </UiButton>
        </NuxtLink>
      </template>
    </AppHeader>

    <div class="px-6 pb-6">
      <UiCard>
        <UiCardContent class="space-y-6 pt-6">
          <h2 class="text-xl font-bold text-foreground">
            Scores
          </h2>

          <div v-if="criteria.length > 0" class="space-y-4">
            <div v-for="c in criteria" :key="c.id" class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="font-bold text-muted-foreground">{{ c.name }}</span>
                <UiBadge variant="secondary" class="font-bold">
                  {{ (item.scores[c.id!] || 0) > 0 ? 'Yes' : 'No' }}
                </UiBadge>
              </div>
              <ProgressBar
                :value="item.scores[c.id!] || 0"
                :max="10"
                :label="`${c.name} score`"
              />
            </div>
          </div>

          <div v-else class="text-center py-8 text-muted-foreground border border-dashed border-zinc-800 rounded-xl">
            No criteria defined.
          </div>
        </UiCardContent>
      </UiCard>
    </div>
  </div>

  <!-- Not found state -->
  <div v-else class="flex flex-col items-center justify-center h-[60vh] px-6 text-center">
    <p class="text-sm font-medium text-foreground mb-1">
      Item not found
    </p>
    <p class="text-xs text-muted-foreground mb-4">
      This item may have been deleted.
    </p>
    <NuxtLink :to="`/lists/${listId}`">
      <UiButton variant="outline" size="sm">
        Go back to list
      </UiButton>
    </NuxtLink>
  </div>
</template>
