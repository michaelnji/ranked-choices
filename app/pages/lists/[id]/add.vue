<script setup lang="ts">
import { AlertTriangle, Check, Save, Settings } from 'lucide-vue-next'
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
  <div class="space-y-8 animate-fade-in-up">
    <AppHeader title="Add Item" :back="`/lists/${listId}`" />

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
                id="item-name" v-model="name" type="text" placeholder="e.g. Paris"
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
                  class="group relative flex items-center justify-between p-4 rounded-xl border transition-all text-left active:scale-[0.97]"
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
                    <Check v-if="(scores[c.id!] || 0) > 0" :size="16" :stroke-width="4" aria-hidden="true" class="animate-scale-in" />
                  </div>
                </button>
              </div>
            </div>

            <!-- No Criteria Warning -->
            <UiAlert
              v-else
              class="border-warning/30 bg-warning/10 text-warning [&>svg]:text-warning"
            >
              <AlertTriangle class="h-5 w-5" />
              <UiAlertTitle>No criteria defined</UiAlertTitle>
              <UiAlertDescription class="flex flex-col gap-3">
                <span>You need to define criteria before adding items.</span>
                <NuxtLink :to="`/lists/${listId}/settings`">
                  <UiButton
                    variant="outline" size="sm"
                    class="border-warning/30 text-warning hover:bg-warning/10"
                  >
                    <Settings :size="16" class="mr-2" />
                    Go to Settings
                  </UiButton>
                </NuxtLink>
              </UiAlertDescription>
            </UiAlert>

            <!-- Save Button -->
            <UiButton type="submit" class="w-full h-14 text-lg" :disabled="!name.trim() || criteria.length === 0">
              <Save :size="22" class="mr-2" />
              Save Item
            </UiButton>
          </form>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
