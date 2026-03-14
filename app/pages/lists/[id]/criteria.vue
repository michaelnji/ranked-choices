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
  <div class="space-y-0 animate-fade-in-up">
    <AppHeader
      title="Criteria"
      :subtitle="list?.name"
      :back="`/lists/${listId}/settings`"
      back-label="Back to settings"
    />

    <div class="px-5 pt-5 pb-8">
      <CriteriaManager
        :criteria="criteria"
        @add="(name, weight) => addCriteria(name, weight)"
        @update="(id, name, weight) => updateCriteria(id, name, weight)"
        @remove="(id) => removeCriteria(id)"
      />
    </div>
  </div>
</template>
