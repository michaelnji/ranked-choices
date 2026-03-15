<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useListDetails } from '~/composables/useListDetails'

const route = useRoute()
const listId = Number(route.params.id)

const {
  list,
  criteria,
  fetchDetails,
  addCriteria,
  updateCriteria,
  removeCriteria,
} = useListDetails(listId)

onMounted(() => {
  fetchDetails()
})

useHead({
  title: computed(() => list.value ? `Criteria — ${list.value.name}` : 'Criteria'),
})
</script>

<template>
  <div class="space-y-0 animate-fade-in-up pb-32">
    <AppHeader
      title="Criteria"
      :subtitle="list?.name"
      :back="`/lists/${listId}/settings`"
      back-label="Settings"
    />

    <div class="px-5 pt-5 pb-8 space-y-6">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight text-foreground px-1">
          Criteria
        </h1>
        <p class="text-[15px] text-muted-foreground px-1">
          Manage dimensions to score by
        </p>
      </div>

      <CriteriaManager
        :criteria="criteria"
        @add="(name, weight) => addCriteria(name, weight)"
        @update="(id, name, weight) => updateCriteria(id, name, weight)"
        @remove="(id) => removeCriteria(id)"
      />
    </div>
  </div>
</template>
