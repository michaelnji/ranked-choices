<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import { toast } from 'vue-hot-toast'

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
  <div class="space-y-8 animate-fade-in-up">
    <AppHeader title="New List" back="/" />

    <!-- Form -->
    <div class="px-6">
      <UiCard>
        <UiCardContent class="space-y-6 pt-6">
          <form class="space-y-6" @submit.prevent="handleCreate">
            <div class="space-y-2">
              <UiLabel for="list-name" class="text-sm font-bold uppercase tracking-wider text-muted-foreground ml-1">
                List Name
              </UiLabel>
              <UiInput
                id="list-name" v-model="name" type="text" placeholder="e.g. Summer Vacation Spots"
                autofocus
              />
            </div>

            <UiButton type="submit" class="w-full mt-4" :disabled="!name.trim()">
              <Plus :size="20" stroke-width="2.5" />
              Create List
            </UiButton>
          </form>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
