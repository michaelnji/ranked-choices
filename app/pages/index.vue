<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLists } from '~/composables/useLists'

const { lists, fetchLists, createList, deleteList } = useLists()
const newListName = ref('')
const isCreating = ref(false)
const deleteCandidateId = ref<number | null>(null)

onMounted(() => {
  fetchLists()
})

async function handleCreate() {
  if (!newListName.value.trim())
    return
  await createList(newListName.value)
  newListName.value = ''
  isCreating.value = false
}

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
  <div class="space-y-8">
    <!-- Hero / Welcome -->
    <div v-if="lists.length === 0" class="hero min-h-[50vh] bg-base-200 rounded-box">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">
            Ranked Choices
          </h1>
          <p class="py-6">
            Offline-first decision making tool. Create a list to get started.
          </p>
          <button class="btn btn-primary" @click="isCreating = true">
            Create First List
          </button>
        </div>
      </div>
    </div>

    <!-- Header Actions -->
    <div v-else class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">
        My Lists
      </h1>
      <button class="btn btn-primary" @click="isCreating = true">
        <span class="i-solar-add-circle-bold text-xl" />
        New List
      </button>
    </div>

    <!-- Create Modal/Form -->
    <dialog class="modal" :class="{ 'modal-open': isCreating }">
      <div class="modal-box">
        <h3 class="font-bold text-lg">
          Create New List
        </h3>
        <div class="py-4">
          <input
            v-model="newListName"
            type="text"
            placeholder="List Name (e.g., Summer Vacation Spots)"
            class="input input-bordered w-full"
            autofocus
            @keyup.enter="handleCreate"
          >
        </div>
        <div class="modal-action">
          <button class="btn" @click="isCreating = false">
            Cancel
          </button>
          <button class="btn btn-primary" :disabled="!newListName.trim()" @click="handleCreate">
            Create
          </button>
        </div>
      </div>
    </dialog>

    <dialog class="modal" :class="{ 'modal-open': deleteCandidateId != null }">
      <div class="modal-box">
        <h3 class="font-bold text-lg">
          Delete List
        </h3>
        <p class="py-4">
          Are you sure you want to delete this list?
        </p>
        <div class="modal-action">
          <button class="btn" @click="deleteCandidateId = null">
            Cancel
          </button>
          <button class="btn btn-error" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
    </dialog>

    <!-- Lists Grid -->
    <div v-if="lists.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="list in lists" :key="list.id" class="card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition-colors">
        <div class="card-body">
          <h2 class="card-title justify-between">
            {{ list.name }}
            <div class="badge badge-secondary badge-outline text-xs">
              {{ list.rankingMode }}
            </div>
          </h2>
          <p class="text-sm text-base-content/70">
            Created: {{ new Date(list.createdAt).toLocaleDateString() }}
          </p>
          <div class="card-actions justify-end mt-4">
            <button class="btn btn-ghost btn-sm text-error" @click="list.id && handleDelete(list.id)">
              Delete
            </button>
            <NuxtLink :to="`/lists/${list.id}`" class="btn btn-primary btn-sm">
              Open
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
