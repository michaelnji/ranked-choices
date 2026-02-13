<script setup lang="ts">
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
  <div class="space-y-6">
    <!-- Hero / Welcome -->
    <div v-if="lists.length === 0" class="k-card k-card-accent space-y-4">
      <div>
        <p class="k-section-subtitle">
          Mobile Only
        </p>
        <h1 class="k-title">
          Ranked Choices
        </h1>
      </div>
      <p class="k-muted">
        Offline-first decision making tool. Create a list to get started.
      </p>

      <NuxtLink to="/new" class="k-btn k-btn-primary w-full flex items-center justify-center gap-2">
        <Icon name="solar:add-circle-bold" class="text-xl" />
        Create First List
      </NuxtLink>
    </div>

    <!-- Header Actions -->
    <div v-else class="flex items-end justify-between gap-4">
      <div>
        <p class="k-section-subtitle">
          Dashboard
        </p>
        <h1 class="k-title">
          My Lists
        </h1>
      </div>
      <NuxtLink to="/new" class="k-btn k-btn-accent flex items-center justify-center gap-2">
        <Icon name="solar:add-circle-bold" class="text-xl" />

        New List
      </NuxtLink>
    </div>

    <div class="k-modal" :class="{ 'k-modal-open': deleteCandidateId != null }" role="dialog" aria-modal="true">
      <div class="k-modal-card space-y-4">
        <div>
          <p class="k-section-subtitle">
            Confirm
          </p>
          <h3 class="k-section-title">
            Delete List
          </h3>
        </div>

        <p class="k-muted">
          Are you sure you want to delete this list?
        </p>
        <div class="flex gap-4">
          <button class="k-btn k-btn-ghost w-full" @click="deleteCandidateId = null">
            Cancel
          </button>
          <button
            class="k-btn k-btn-accent w-full flex items-center justify-center gap-2"
            @click="confirmDelete"
          >
            <Icon name="solar:trash-bin-trash-bold" class="text-xl" />

            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Lists Grid -->
    <div v-if="lists.length > 0" class="space-y-4">
      <div v-for="list in lists" :key="list.id" class="k-card space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="k-section-title">
              {{ list.name }}
            </h2>

            <p class="k-muted">
              Created: {{ new Date(list.createdAt).toLocaleDateString() }}
            </p>
          </div>
        </div>
        <div class="flex gap-4">
          <button
            class="k-btn k-btn-ghost w-full flex items-center justify-center gap-2"
            @click="list.id && handleDelete(list.id)"
          >
            <Icon name="solar:trash-bin-trash-bold" class="text-xl" />
            Delete
          </button>

          <NuxtLink
            :to="`/lists/${list.id}`"
            class="k-btn k-btn-primary w-full flex items-center justify-center gap-2"
          >
            Open

            <Icon name="solar:arrow-right-linear" class="text-xl" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
