<script setup lang="ts">
type CriteriaType = import('~/types').Criteria
type ItemType = import('~/types').Item

defineProps<{
  items: ItemType[]
  criteria: CriteriaType[]
}>()

const emit = defineEmits<{
  (e: 'add', name: string): void
  (e: 'remove', id: number): void
  (e: 'updateScores', itemId: number, scores: Record<number, number>): void
}>()

const newItemName = ref('')

function handleAdd() {
  if (!newItemName.value.trim())
    return
  emit('add', newItemName.value)
  newItemName.value = ''
}
</script>

<template>
  <div class="card bg-base-100 shadow border border-base-200">
    <div class="card-body">
      <h2 class="card-title text-lg">
        <span class="i-solar-box-bold" />
        Items ({{ items.length }}/100)
      </h2>
      <p class="text-sm text-base-content/70">
        Add options and score them.
      </p>

      <!-- Add Form -->
      <div class="flex gap-2 mt-2">
        <input
          v-model="newItemName"
          type="text"
          placeholder="New Item (e.g. Paris)"
          class="input input-bordered input-sm flex-1"
          @keyup.enter="handleAdd"
        >
        <button
          class="btn btn-sm btn-primary"
          :disabled="!newItemName.trim() || items.length >= 100"
          @click="handleAdd"
        >
          Add
        </button>
      </div>

      <!-- List -->
      <div class="mt-4 space-y-4">
        <div
          v-for="item in items"
          :key="item.id"
          class="collapse collapse-arrow bg-base-200 border border-base-300"
        >
          <input type="checkbox">
          <div class="collapse-title font-medium flex justify-between items-center pr-12">
            <span>{{ item.name }}</span>
            <button
              class="btn btn-ghost btn-xs text-error z-10"
              @click.stop="item.id && emit('remove', item.id)"
            >
              Delete
            </button>
          </div>
          <div class="collapse-content bg-base-100 pt-4">
            <div v-if="criteria.length === 0" class="text-sm text-warning">
              Add criteria to score this item.
            </div>
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="c in criteria" :key="c.id" class="form-control">
                <label class="label pb-0">
                  <span class="label-text text-xs font-bold">{{ c.name }} (Wt: {{ c.weight }})</span>
                  <span class="label-text-alt">{{ item.scores[c.id!] || 0 }}/10</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  class="range range-xs range-accent"
                  :value="item.scores[c.id!] || 0"
                  @input="(e) => {
                    const next = { ...item.scores, [c.id!]: Number((e.target as HTMLInputElement).value) }
                    if (item.id)
                      emit('updateScores', item.id, next)
                  }"
                >
              </div>
            </div>
          </div>
        </div>
        <div v-if="items.length === 0" class="text-center py-4 text-sm text-base-content/50 italic">
          No items added yet.
        </div>
      </div>
    </div>
  </div>
</template>
