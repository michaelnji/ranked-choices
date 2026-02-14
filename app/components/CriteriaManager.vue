<script setup lang="ts">
import type { Criteria } from '~/types'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-vue-next'
import { ref } from 'vue'

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
  <div class="card space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-white">
        Criteria <span class="text-surface-500 text-sm ml-2">({{ criteria.length
        }}/20)</span>
      </h2>
      <span v-if="criteria.length >= 20" class="text-xs font-bold text-red-400 uppercase">Max Reached</span>
    </div>

    <!-- Add Form -->
    <div class="space-y-4 bg-surface-950/50 p-4 rounded-2xl border border-surface-800/50">
      <div class="flex gap-2">
        <input
          v-model="newName"
          type="text"
          placeholder="New Criterion (e.g. Cost)"
          class="input bg-surface-900 border-surface-700 focus:border-primary-500 h-12"
          @keyup.enter="handleAdd"
        >
        <button
          class="btn btn-primary aspect-square !p-0 w-12 flex-shrink-0 rounded-xl"
          :disabled="!newName.trim() || criteria.length >= 20"
          @click="handleAdd"
        >
          <Plus :size="24" />
        </button>
      </div>

      <div class="flex items-center gap-4 px-1">
        <span class="text-xs font-bold uppercase text-surface-400 w-12">Weight</span>
        <span class="flex items-center justify-center w-8 h-8 rounded bg-surface-800 text-white font-bold text-sm">
          {{ newWeight }}
        </span>
        <input
          v-model.number="newWeight"
          type="range"
          min="0"
          max="10"
          class="flex-1 h-2 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
        >
      </div>
    </div>

    <!-- List -->
    <div class="space-y-3">
      <div
        v-for="c in criteria"
        :key="c.id"
        class="bg-surface-900 border border-surface-800 rounded-xl p-4 transition-all"
        :class="{ 'ring-1 ring-primary-500 border-primary-500/50': editingId === c.id }"
      >
        <!-- View Mode -->
        <div v-if="editingId !== c.id" class="flex items-center gap-3">
          <div
            class="flex items-center justify-center w-8 h-8 rounded bg-surface-800 text-primary-400 font-bold text-sm border border-surface-700"
          >
            {{ c.weight }}
          </div>
          <span class="text-base font-medium text-white flex-1 truncate">{{ c.name }}</span>

          <div class="flex items-center gap-1">
            <button
              class="p-2 text-surface-400 hover:text-white hover:bg-surface-800 rounded-lg transition-colors"
              @click="startEdit(c)"
            >
              <Pencil :size="18" />
            </button>
            <button
              class="p-2 text-surface-400 hover:text-red-400 hover:bg-surface-800 rounded-lg transition-colors"
              @click="c.id && emit('remove', c.id)"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="space-y-4">
          <input
            v-model="editName" type="text" class="input bg-surface-950 border-surface-700 h-10 text-sm"
            @keyup.enter="saveEdit"
          >

          <div class="flex items-center gap-3">
            <span class="text-xs font-bold uppercase text-surface-400">Weight</span>
            <span class="flex items-center justify-center w-6 h-6 rounded bg-surface-800 text-white font-bold text-xs">
              {{ editWeight }}
            </span>
            <input
              v-model.number="editWeight"
              type="range"
              min="0"
              max="10"
              class="flex-1 h-1.5 bg-surface-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
            >
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <button class="btn btn-ghost !p-2 h-9 text-xs" @click="cancelEdit">
              <X :size="16" class="mr-1" /> Cancel
            </button>
            <button class="btn btn-primary !p-2 h-9 text-xs" :disabled="!editName.trim()" @click="saveEdit">
              <Check :size="16" class="mr-1" /> Save
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="criteria.length === 0"
        class="text-center py-8 text-surface-500 border border-dashed border-surface-800 rounded-xl"
      >
        No criteria defined yet.
      </div>
    </div>
  </div>
</template>
