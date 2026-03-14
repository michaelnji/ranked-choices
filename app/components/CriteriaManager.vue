<script setup lang="ts">
import type { Criteria } from '~/types'
import { Check, Pencil, Plus, Scale, Trash2, X } from 'lucide-vue-next'
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
const newWeight = ref([5])

const editingId = ref<number | null>(null)
const editName = ref('')
const editWeight = ref([5])

function handleAdd() {
  if (!newName.value.trim())
    return
  emit('add', newName.value, newWeight.value[0])
  newName.value = ''
  newWeight.value = [5]
}

function startEdit(c: Criteria) {
  if (!c.id)
    return
  editingId.value = c.id
  editName.value = c.name
  editWeight.value = [c.weight]
}

function cancelEdit() {
  editingId.value = null
}

function saveEdit() {
  if (editingId.value !== null && editName.value.trim()) {
    emit('update', editingId.value, editName.value, editWeight.value[0])
    cancelEdit()
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold text-foreground">
        Criteria
        <span class="text-muted-foreground font-normal ml-1">({{ criteria.length }}/20)</span>
      </h2>
      <UiBadge v-if="criteria.length >= 20" variant="destructive" class="text-xs">
        Max Reached
      </UiBadge>
    </div>

    <!-- Add Form -->
    <div class="space-y-3 bg-muted/40 p-3 rounded-lg border border-zinc-800">
      <div class="flex gap-2">
        <UiInput
          v-model="newName"
          type="text"
          placeholder="New criterion (e.g. Cost)"
          class="h-10 text-sm"
          aria-label="New criterion name"
          @keyup.enter="handleAdd"
        />
        <UiButton
          size="icon"
          class="h-10 w-10 shrink-0"
          :disabled="!newName.trim() || criteria.length >= 20"
          aria-label="Add criterion"
          @click="handleAdd"
        >
          <Plus :size="18" />
        </UiButton>
      </div>

      <div class="space-y-1.5">
        <div class="flex items-center gap-3">
          <UiLabel class="text-label shrink-0 w-12">
            Weight
          </UiLabel>
          <span
            id="new-weight-display"
            class="text-xs font-semibold tabular-nums text-foreground w-4 text-center"
            aria-live="polite"
          >
            {{ newWeight[0] }}
          </span>
          <UiSlider
            v-model="newWeight"
            :min="0"
            :max="10"
            :step="1"
            class="flex-1"
            aria-label="New criterion weight (0 = ignore, 10 = highest priority)"
          />
        </div>
        <p class="text-xs text-muted-foreground">
          Weight controls how much this criterion influences the final score (0 = ignore, 10 = critical).
        </p>
      </div>
    </div>

    <!-- List -->
    <ul v-if="criteria.length > 0" class="space-y-2">
      <li
        v-for="c in criteria"
        :key="c.id"
        class="bg-card border border-zinc-800 rounded-lg p-3 transition-all"
        :class="{ 'ring-1 ring-primary border-primary/50': editingId === c.id }"
      >
        <!-- View Mode -->
        <div v-if="editingId !== c.id" class="flex items-center gap-3">
          <span class="text-xs font-bold tabular-nums text-muted-foreground w-4 text-center shrink-0">
            {{ c.weight }}
          </span>
          <span class="text-sm font-medium text-foreground flex-1 truncate">{{ c.name }}</span>

          <div class="flex items-center gap-0.5">
            <UiButton
              variant="ghost"
              size="icon"
              class="h-9 w-9 text-muted-foreground hover:text-foreground"
              :aria-label="`Edit ${c.name}`"
              @click="startEdit(c)"
            >
              <Pencil :size="14" />
            </UiButton>
            <UiButton
              variant="ghost"
              size="icon"
              class="h-9 w-9 text-muted-foreground hover:text-destructive"
              :aria-label="`Delete ${c.name}`"
              @click="c.id && emit('remove', c.id)"
            >
              <Trash2 :size="14" />
            </UiButton>
          </div>
        </div>

        <!-- Edit Mode -->
        <div v-else class="space-y-3">
          <UiInput
            v-model="editName"
            type="text"
            class="h-9 text-sm"
            :aria-label="`Criterion name for ${c.name}`"
            @keyup.enter="saveEdit"
          />

          <div class="flex items-center gap-3">
            <UiLabel class="text-label shrink-0">
              Weight
            </UiLabel>
            <span
              class="text-xs font-semibold tabular-nums text-foreground w-4 text-center"
              aria-live="polite"
            >
              {{ editWeight[0] }}
            </span>
            <UiSlider
              v-model="editWeight"
              :min="0"
              :max="10"
              :step="1"
              class="flex-1"
              :aria-label="`Weight for ${c.name} (0 = ignore, 10 = highest priority)`"
            />
          </div>

          <div class="flex justify-end gap-2">
            <UiButton variant="ghost" size="sm" @click="cancelEdit">
              <X :size="14" class="mr-1" /> Cancel
            </UiButton>
            <UiButton size="sm" :disabled="!editName.trim()" @click="saveEdit">
              <Check :size="14" class="mr-1" /> Save
            </UiButton>
          </div>
        </div>
      </li>
    </ul>

    <!-- Empty State -->
    <div
      v-if="criteria.length === 0"
      class="flex flex-col items-center text-center py-8 text-muted-foreground border border-dashed border-zinc-800 rounded-lg"
    >
      <Scale :size="20" :stroke-width="1.5" class="mb-2 text-muted-foreground" />
      <p class="text-sm font-medium text-foreground mb-1">
        No criteria yet
      </p>
      <p class="text-xs max-w-[200px]">
        Criteria determine how items are scored and ranked.
      </p>
    </div>
  </div>
</template>
