<script setup lang="ts">
import { Plus } from 'lucide-vue-next'

const router = useRouter()
const { createList } = useLists()
const name = ref('')

async function handleCreate() {
  if (!name.value.trim())
    return

  try {
    await createList(name.value.trim())
    router.push('/')
  }
  catch {
    // silent
  }
}
</script>

<template>
  <div class="space-y-6 pt-4 min-h-full animate-fade-in-up">
    <!-- Header -->
    <header class="px-5! flex items-center justify-between">
      <NuxtLink
        to="/"
        class="active-scale-down-sm size-10 flex items-center justify-center  text-primary"
      >
        <span class="text-[17px] font-medium tracking-tight">Cancel</span>
      </NuxtLink>
    </header>

    <div class="px-5 space-y-8">
      <h1 class="text-3xl font-bold tracking-tight text-foreground">
        New List
      </h1>

      <form class="space-y-8" @submit.prevent="handleCreate">
        <div class="ios-list">
          <div class="p-4 bg-transparent flex items-center">
            <input
              id="list-name" v-model="name" type="text" placeholder="e.g. Summer Vacation Spots" autofocus
              class="w-full bg-transparent border-0 text-[17px] focus:ring-0 placeholder:text-muted-foreground/60 text-foreground outline-none"
            >
          </div>
        </div>

        <button
          type="submit"
          class="active-scale-down flex items-center justify-center w-full h-[54px] rounded-[18px] text-[17px] font-semibold transition-all duration-300"
          :class="name.trim() ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'"
          :disabled="!name.trim()"
        >
          <Plus v-if="name.trim()" :size="20" class="mr-2" stroke-width="2.5" />
          Create List
        </button>
      </form>
    </div>
  </div>
</template>
