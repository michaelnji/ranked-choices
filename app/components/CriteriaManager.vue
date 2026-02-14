<script setup lang="ts">
import type { Criteria } from '~/types'

defineProps<{
  criteria: Criteria[]
}>()

const emit = defineEmits<{
  (e: 'add', name: string, weight: number): void
  (e: 'remove', id: number): void
  (e: 'update', id: number, name: string, weight: number): void
}>()

const newName = ref('')
const newWeight = ref(5)

const editingId = ref<number | null>(null)
const editName = ref('')
const editWeight = ref(5)

function handleAdd() {
  if (!newName.value.trim())
    return
  emit('add', newName.value, newWeight.value)
  newName.value = ''
  newWeight.value = 5
}

function startEdit(c: Criteria) {
  if (!c.id)
    return
  editingId.value = c.id
  editName.value = c.name
  editWeight.value = c.weight
}

function cancelEdit() {
  editingId.value = null
}

function saveEdit() {
  if (editingId.value !== null && editName.value.trim()) {
    emit('update', editingId.value, editName.value, editWeight.value)
    cancelEdit()
  }
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
    <div class="space-y-4 border-b-2 border-dashed border-(--color-text-muted) pb-6">
      <div class="flex gap-2">
        <input
          v-model="newName"
          type="text"
          placeholder="New Criterion (e.g. Cost)"
          class="k-input flex-1"
          @keyup.enter="handleAdd"
        >
        <button
          class="k-btn k-btn-primary"
          :disabled="!newName.trim() || criteria.length >= 20"
          @click="handleAdd"
        >
          <Icon name="solar:add-circle-bold" class="text-xl" />
        </button>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-sm font-bold uppercase w-16">Weight:</span>
        <span class="k-chip shadow-none! w-8 justify-center">
          {{ newWeight }}
        </span>
        <input
          v-model.number="newWeight"
          type="range"
          min="0"
          max="10"
          class="k-range shadow-none! flex-1"
        >
      </div>
    </div>

    <!-- List -->
    <div class="space-y-3">
      <div
        v-for="c in criteria"
        :key="c.id"
        class="border-[3px] border-(--color-text) bg-(--color-surface-2) px-3 py-3 transition-all"
        :class="{ 'border-primary bg-primary/5': editingId === c.id }"
      >
        <!-- View Mode -->
        <div v-if="editingId !== c.id" class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="k-chip shadow-none! min-w-[2rem] justify-center bg-(--color-surface)">
              {{ c.weight }}
            </span>
            <span class="text-base font-bold truncate">{{ c.name }}</span>
          </div>
          <div class="flex items-center gap-1">
            <button
              class="k-btn k-btn-ghost k-btn-sm !p-2"
              @click="startEdit(c)"
            >
              <Icon name="solar:pen-bold" class="text-lg" />
            </button>
            <button
              class="k-btn k-btn-ghost k-btn-sm !p-2 text-error"
              @click="c.id && emit('remove', c.id)"
            >
              <Icon name="solar:trash-bin-trash-bold" class="text-lg" />
            </button>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="space-y-3">
          <div class="flex gap-2">
            <input
              v-model="editName"
              type="text"
              class="k-input k-input-sm flex-1"
              @keyup.enter="saveEdit"
            >
          </div>
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold uppercase">Weight:</span>
            <span class="k-chip k-chip-sm shadow-none! w-6 justify-center bg-(--color-surface)">
              {{ editWeight }}
            </span>
            <input
              v-model.number="editWeight"
              type="range"
              min="0"
              max="10"
              class="k-range k-range-xs shadow-none! flex-1"
            >
          </div>
          <div class="flex justify-end gap-2 pt-1">
            <button
              class="k-btn k-btn-ghost k-btn-sm"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button
              class="k-btn k-btn-primary k-btn-sm"
              :disabled="!editName.trim()"
              @click="saveEdit"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div v-if="criteria.length === 0" class="k-muted text-center py-4">
        No criteria defined yet.
      </div>
    </div>
  </div>
</template>
