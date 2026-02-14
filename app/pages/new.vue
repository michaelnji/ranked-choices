<script setup lang="ts">
import { ChevronLeft, Plus } from 'lucide-vue-next'
import { ref } from 'vue'
import { toast } from 'vue-hot-toast'
import { useRouter } from 'vue-router'
import { useLists } from '~/composables/useLists'

const router = useRouter()
const { createList } = useLists()
const name = ref('')

async function handleCreate() {
  if (!name.value.trim())
    return

  try {
    await createList(name.value.trim())
    toast.success('List created successfully')
    router.push('/')
  }
  catch {
    toast.error('Failed to create list')
  }
}
</script>

<template>
  <div class="p-6 space-y-8 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink
        to="/"
        class="btn btn-ghost rounded-full !p-3 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors"
      >
        <ChevronLeft :size="24" stroke-width="2.5" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl text-display text-white">
          New List
        </h1>
        <p class="text-surface-400 font-medium">
          Create a new ranking project
        </p>
      </div>
    </div>

    <!-- Form -->
    <div class="card space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-bold uppercase tracking-wider text-surface-400 ml-1">List Name</label>
        <input
          v-model="name"
          type="text"
          placeholder="e.g. Summer Vacation Spots"
          class="input bg-surface-950 border-surface-800 focus:border-primary-500 focus:ring-primary-500/20 placeholder:text-surface-600"
          autofocus
          @keyup.enter="handleCreate"
        >
      </div>

      <button
        class="btn btn-primary w-full flex items-center justify-center gap-2 mt-4" :disabled="!name.trim()"
        @click="handleCreate"
      >
        <Plus :size="20" stroke-width="2.5" />
        Create List
      </button>
    </div>
  </div>
</template>
