<script setup lang="ts">
type CriteriaType = import('~/types').Criteria

defineProps<{
  criteria: CriteriaType[]
}>()

const emit = defineEmits<{
  (e: 'add', name: string, weight: number): void
  (e: 'remove', id: number): void
}>()

const newName = ref('')
const newWeight = ref(5)

function handleAdd() {
  if (!newName.value.trim())
    return
  emit('add', newName.value, newWeight.value)
  newName.value = ''
  newWeight.value = 5
}
</script>

<template>
  <div class="card bg-base-100 shadow border border-base-200">
    <div class="card-body">
      <h2 class="card-title text-lg">
        <span class="i-solar-list-check-bold" />
        Criteria ({{ criteria.length }}/20)
      </h2>
      <p class="text-sm text-base-content/70">
        Define what matters for this decision.
      </p>

      <!-- Add Form -->
      <div class="flex flex-col sm:flex-row gap-2 mt-2">
        <input
          v-model="newName"
          type="text"
          placeholder="New Criterion (e.g. Cost)"
          class="input input-bordered input-sm flex-1"
          @keyup.enter="handleAdd"
        >
        <div class="flex items-center gap-2 bg-base-200 px-3 rounded-lg">
          <span class="text-xs font-bold">Wt: {{ newWeight }}</span>
          <input
            v-model.number="newWeight"
            type="range"
            min="0"
            max="10"
            class="range range-xs range-primary w-24"
          >
        </div>
        <button
          class="btn btn-sm btn-primary"
          :disabled="!newName.trim() || criteria.length >= 20"
          @click="handleAdd"
        >
          Add
        </button>
      </div>

      <!-- List -->
      <div class="mt-4 space-y-2">
        <div
          v-for="c in criteria"
          :key="c.id"
          class="flex items-center justify-between p-2 bg-base-200 rounded-lg group"
        >
          <div class="flex items-center gap-2">
            <span class="font-medium">{{ c.name }}</span>
            <div class="badge badge-primary badge-sm">
              Wt: {{ c.weight }}
            </div>
          </div>
          <button
            class="btn btn-ghost btn-xs text-error opacity-0 group-hover:opacity-100 transition-opacity"
            @click="c.id && emit('remove', c.id)"
          >
            Remove
          </button>
        </div>
        <div v-if="criteria.length === 0" class="text-center py-4 text-sm text-base-content/50 italic">
          No criteria defined yet.
        </div>
      </div>
    </div>
  </div>
</template>
