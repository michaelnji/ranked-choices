<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLists } from '~/composables/useLists'

const router = useRouter()
const { createList } = useLists()
const name = ref('')

async function handleCreate() {
  if (!name.value.trim())
    return

  await createList(name.value.trim())
  router.push('/')
}
</script>

<template>
  <div class="space-y-6 pb-20">
    <!-- Header -->
    <div class="k-card space-y-4">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="k-btn k-btn-ghost">
          <Icon name="solar:arrow-left-bold" class="text-xl" />
        </NuxtLink>
        <div>
          <p class="k-section-subtitle">
            Dashboard
          </p>
          <h1 class="k-title">
            New List
          </h1>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="k-card space-y-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text font-bold">List Name</span>
        </label>
        <input
          v-model="name"
          type="text"
          placeholder="e.g. Summer Vacation Spots"
          class="k-input"
          autofocus
          @keyup.enter="handleCreate"
        >
      </div>

      <div class="pt-2">
        <button
          class="k-btn k-btn-primary w-full flex items-center justify-center gap-2"
          :disabled="!name.trim()"
          @click="handleCreate"
        >
          <Icon name="solar:add-circle-bold" class="text-xl" />
          Create List
        </button>
      </div>
    </div>
  </div>
</template>
