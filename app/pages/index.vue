<script setup lang="ts">
import { ArrowRight, LayoutList, PlusCircle, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useLists } from '~/composables/useLists'

const { lists, fetchLists, deleteList } = useLists()
const deleteCandidateId = ref<number | null>(null)

onMounted(() => {
  fetchLists()
})

async function handleDelete(id: number) {
  deleteCandidateId.value = id
}

async function confirmDelete() {
  if (deleteCandidateId.value == null)
    return
  await deleteList(deleteCandidateId.value)
  deleteCandidateId.value = null
}
</script>

<template>
  <div class="p-6 space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl text-display text-white">
          My Lists
        </h1>
        <p class="text-surface-400 font-medium mt-1">
          Manage your rankings
        </p>
      </div>
      <NuxtLink v-if="lists.length > 0" to="/new" class="btn btn-primary rounded-full !p-3 aspect-square flex items-center justify-center">
        <PlusCircle :size="24" stroke-width="2.5" />
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-if="lists.length === 0" class="card flex flex-col items-center text-center py-12 space-y-6">
      <div class="w-20 h-20 rounded-full bg-surface-800 flex items-center justify-center text-primary-500 mb-2 shadow-inner">
        <LayoutList :size="40" stroke-width="1.5" />
      </div>
      <div class="space-y-2">
        <h2 class="text-xl font-bold text-white">
          No lists yet
        </h2>
        <p class="text-surface-400 max-w-[200px] mx-auto leading-relaxed">
          Create your first list to start ranking items.
        </p>
      </div>
      <NuxtLink to="/new" class="btn btn-primary w-full max-w-xs">
        <PlusCircle :size="20" class="mr-2" />
        Create New List
      </NuxtLink>
    </div>

    <!-- List Grid -->
    <div v-else class="grid gap-5">
      <div v-for="list in lists" :key="list.id" class="card group hover:border-primary-500/30 transition-all hover:-translate-y-1">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h3 class="text-xl font-bold text-white mb-2 leading-tight">
              {{ list.name }}
            </h3>
            <p class="text-xs font-bold uppercase tracking-wider text-surface-400 bg-surface-950/50 inline-block px-3 py-1.5 rounded-lg border border-surface-800">
              {{ new Date(list.createdAt).toLocaleDateString() }}
            </p>
          </div>
          <button class="text-surface-500 hover:text-red-400 transition-colors p-2 -mr-2 -mt-2 rounded-full hover:bg-surface-800" @click="list.id && handleDelete(list.id)">
            <Trash2 :size="20" />
          </button>
        </div>

        <NuxtLink :to="`/lists/${list.id}`" class="btn btn-secondary w-full justify-between group-hover:bg-secondary-400 transition-colors">
          <span>Open List</span>
          <ArrowRight :size="20" />
        </NuxtLink>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="deleteCandidateId != null" class="fixed inset-0 z-50 flex items-center justify-center px-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" @click="deleteCandidateId = null" />

      <!-- Modal Content -->
      <div class="card w-full max-w-sm relative z-10 animate-fade-in-up border-red-500/20 shadow-[0_0_50px_-20px_rgba(239,68,68,0.5)]">
        <h3 class="text-xl font-bold text-white mb-2">
          Delete List?
        </h3>
        <p class="text-surface-400 mb-8 leading-relaxed">
          This action cannot be undone. The list and all its rankings will be lost forever.
        </p>

        <div class="grid grid-cols-2 gap-4">
          <button class="btn bg-surface-800 text-white hover:bg-surface-700" @click="deleteCandidateId = null">
            Cancel
          </button>
          <button class="btn bg-red-500 text-white hover:bg-red-600 shadow-none border-0" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
