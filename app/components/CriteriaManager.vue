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
  <div class="k-card space-y-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="k-section-subtitle">
          Weights
        </p>
        <h2 class="k-section-title">
          Criteria ({{ criteria.length }}/20)
        </h2>
      </div>
      <span class="k-chip">
        Max 20
      </span>
    </div>
    <p class="k-muted">
      Define what matters for this decision.
    </p>

    <!-- Add Form -->

    <div class="space-y-4">
      <input
        v-model="newName" type="text" placeholder="New Criterion (e.g. Cost)" class="k-input"
        @keyup.enter="handleAdd"
      >

      <div class="flex items-center gap-4">
        <span class="k-chip shadow-none!">
          {{ newWeight }}
        </span>
        <input
          v-model.number="newWeight" type="range" min="0" max="10" class="k-range shadow-none!"
        >
      </div>
      <button
        class="k-btn k-btn-primary w-full" :disabled="!newName.trim() || criteria.length >= 20"
        @click="handleAdd"
      >
        Add Criterion
      </button>
    </div>

    <!-- List -->

    <div class="space-y-4">
      <div
        v-for="c in criteria" :key="c.id"
        class="flex items-center justify-between gap-4 border-[3px] border-(--color-text) bg-(--color-surface-2) px-3 py-2"
      >
        <div class="space-x-3">
          <span class="text-base font-bold">{{ c.name }}</span>
          <span class="k-chip shadow-none!"> {{ c.weight }}</span>
        </div>
        <button
          class="k-btn shadow-none! p-2! border-none! k-btn-ghost px-2 !min-w-0"
          @click="c.id && emit('remove', c.id)"
        >
          <Icon name="solar:trash-bin-trash-bold" class=" text-error" size="24" />
        </button>
      </div>

      <div v-if="criteria.length === 0" class="k-muted text-center py-4">
        No criteria defined yet.
      </div>
    </div>
  </div>
</template>
