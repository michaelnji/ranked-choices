<script setup lang="ts">
import type { Criteria } from '~/types'
import { Plus, Scale, Trash2 } from 'lucide-vue-next'
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
const showAddModal = ref(false)

const editingId = ref<number | null>(null)
const editName = ref('')
const editWeight = ref([5])

function handleAdd() {
  if (!newName.value.trim())
    return
  emit('add', newName.value, newWeight.value[0] ?? 5)
  newName.value = ''
  newWeight.value = [5]
  showAddModal.value = false
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
    emit('update', editingId.value, editName.value, editWeight.value[0] ?? 5)
    cancelEdit()
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between px-2">
      <h2 class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
        Criteria <span class="font-normal opacity-70">({{ criteria.length }}/20)</span>
      </h2>
      <span v-if="criteria.length >= 20" class="text-[11px] font-semibold text-destructive uppercase tracking-widest bg-destructive/10 px-2 py-0.5 rounded-full">
        Max Reached
      </span>
    </div>

    <!-- Active List -->
    <TransitionGroup v-if="criteria.length > 0" tag="ul" name="criteria-item" class="ios-list shadow-md">
      <li
        v-for="(c, index) in criteria"
        :key="c.id"
        class="bg-transparent transition-all overflow-hidden relative"
        :class="[
          editingId === c.id ? 'bg-zinc-800/80 z-10 scale-[1.02] shadow-xl rounded-xl my-2' : '',
          index > 0 && editingId !== c.id && editingId !== criteria[index - 1]?.id ? 'border-t border-white/5' : '',
        ]"
      >
        <!-- View Mode -->
        <div v-if="editingId !== c.id" class="flex items-center justify-between px-4 py-3.5 group">
          <div class="flex items-center gap-4 flex-1 min-w-0 pr-4" role="button" tabindex="0" @click="startEdit(c)">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2"
              :class="
                c.weight >= 8 ? 'bg-warning/20 border-warning/30 text-warning'
                : c.weight >= 4 ? 'bg-zinc-800 border-zinc-700 text-foreground'
                  : 'bg-zinc-900 border-zinc-800 text-muted-foreground'
              "
            >
              <span class="text-[13px] font-bold tabular-nums">
                {{ c.weight }}
              </span>
            </div>
            <span class="text-[17px] font-medium text-foreground truncate">{{ c.name }}</span>
          </div>

          <button
            class="active-scale-down-sm p-2 -mr-2 text-zinc-500 hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
            :aria-label="`Delete ${c.name}`"
            @click="c.id && emit('remove', c.id)"
          >
            <Trash2 :size="18" />
          </button>
        </div>

        <!-- Edit Mode -->
        <div v-else class="p-4 space-y-5">
          <div class="flex items-center gap-3">
            <input
              v-model="editName"
              v-focus
              type="text"
              class="flex-1 bg-zinc-950/50 border-0 rounded-xl px-4 py-3 text-[17px] text-foreground focus:ring-1 focus:ring-primary outline-none"
              :aria-label="`Criterion name for ${c.name}`"
              @keyup.enter="saveEdit"
            >
          </div>

          <div class="space-y-4 px-2">
            <div class="flex items-center justify-between">
              <span class="text-[15px] font-medium text-foreground">Importance Weight</span>
              <span class="text-[17px] font-bold tabular-nums text-primary">{{ editWeight[0] }}</span>
            </div>
            <UiSlider
              v-model="editWeight"
              :min="0"
              :max="10"
              :step="1"
              class="w-full py-2"
              :aria-label="`Weight for ${c.name}`"
            />
            <div class="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button class="flex-1 py-3 rounded-[14px] bg-zinc-800 text-foreground font-semibold active-scale-down-sm transition-colors hover:bg-zinc-700" @click="cancelEdit">
              Cancel
            </button>
            <button class="flex-1 py-3 rounded-[14px] bg-primary text-primary-foreground font-semibold active-scale-down-sm transition-colors hover:bg-primary/90 shadow-md shadow-primary/20" :disabled="!editName.trim()" @click="saveEdit">
              Save
            </button>
          </div>
        </div>
      </li>
    </TransitionGroup>

    <!-- Empty State -->
    <div
      v-if="criteria.length === 0"
      class="flex flex-col items-center text-center py-10 text-muted-foreground bg-zinc-900/30 rounded-[24px] ring-1 ring-white/5 backdrop-blur-md"
    >
      <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
        <Scale :size="24" :stroke-width="1.5" class="text-zinc-400" />
      </div>
      <p class="text-[17px] font-semibold text-foreground mb-1 tracking-tight">
        No criteria yet
      </p>
      <p class="text-[14px] text-muted-foreground max-w-[200px] leading-snug">
        Criteria determine how items are scored and ranked.
      </p>
    </div>

    <!-- Add Criterion Button -->
    <button
      v-if="criteria.length < 20"
      class="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary h-[54px] rounded-[18px] font-semibold text-[17px] active-scale-down transition-colors hover:bg-primary/20 mt-6"
      @click="showAddModal = true; newName = ''; newWeight = [5]"
    >
      <Plus :size="20" stroke-width="2.5" />
      Add Criterion
    </button>
  </div>

  <!-- Add Criterion Modal -->
  <UiDialog v-model:open="showAddModal">
    <UiDialogContent>
      <UiDialogHeader>
        <UiDialogTitle class="text-[20px] font-semibold tracking-tight text-foreground">
          Add Criterion
        </UiDialogTitle>
        <UiDialogDescription class="text-[15px] text-muted-foreground">
          Define a new factor to score items against.
        </UiDialogDescription>
      </UiDialogHeader>

      <div class="space-y-6 py-4">
        <div class="space-y-2">
          <label class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">Criterion Name</label>
          <div class="ios-list p-1 shadow-sm">
            <input
              v-model="newName"
              type="text"
              placeholder="e.g. Cost, Quality, Time..."
              class="w-full bg-transparent border-0 px-4 py-3.5 text-[19px] font-medium text-foreground focus:ring-0 outline-none placeholder:text-zinc-600"
              @keyup.enter="handleAdd"
            >
          </div>
        </div>

        <div class="space-y-4 px-1">
          <div class="flex items-center justify-between">
            <span class="text-[15px] font-medium text-foreground">Importance Weight</span>
            <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
              <span class="text-[15px] font-bold tabular-nums text-foreground">{{ newWeight[0] }}</span>
            </div>
          </div>
          <UiSlider
            v-model="newWeight"
            :min="0"
            :max="10"
            :step="1"
            class="w-full py-2"
          />
          <div class="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pt-2">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>

      <UiDialogFooter class="sm:justify-stretch">
        <button
          class="w-full flex items-center justify-center h-14 bg-primary text-primary-foreground rounded-[16px] text-[17px] font-semibold active-scale-down transition-all disabled:opacity-50 shadow-md shadow-primary/25"
          :disabled="!newName.trim()"
          @click="handleAdd"
        >
          Add Criterion
        </button>
      </UiDialogFooter>
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped>
.criteria-item-enter-active {
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.criteria-item-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
  position: absolute;
  width: 100%;
}
.criteria-item-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.criteria-item-leave-to {
  opacity: 0;
  transform: scaleY(0.9);
}
.criteria-item-move {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
