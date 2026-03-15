<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { db } from '~/utils/db'

useHead({ title: 'Edit Username — Ranked Choices' })

const router = useRouter()

const profileId = ref<number | undefined>(undefined)
const username = ref('')
const isSaving = ref(false)

onMounted(async () => {
  const profiles = await db.profile.toArray()
  if (profiles.length > 0 && profiles[0]) {
    profileId.value = profiles[0].id
    username.value = profiles[0].username
  }
})

async function saveUsername() {
  if (!username.value.trim() || isSaving.value)
    return
  isSaving.value = true
  try {
    if (profileId.value !== undefined) {
      await db.profile.update(profileId.value, { username: username.value.trim() })
    }
    toast.success('Name updated! 👋')
    router.push('/settings')
  }
  catch {
    toast.error('Could not save. Please try again.')
  }
  finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="animate-fade-in-up pb-24">
    <AppHeader
      title="Edit Username"
      back="/settings"
      back-label="Done"
    />

    <div class="px-5 pt-6 space-y-8">
      <!-- Input Group -->
      <div class="space-y-2">
        <label for="username-input" class="text-[13px] font-medium text-muted-foreground uppercase tracking-wider ml-4">
          Your Name
        </label>
        <div class="ios-list">
          <div class="ios-list-item h-14">
            <input
              id="username-input"
              v-model="username"
              type="text"
              placeholder="e.g. Alex"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="words"
              class="w-full h-full bg-transparent border-none outline-none text-[17px] text-foreground placeholder:text-muted-foreground/50 px-2"
              @keydown.enter="saveUsername"
            >
          </div>
        </div>
        <p class="text-[13px] text-muted-foreground ml-4 mt-2">
          This is how we'll greet you across the app.
        </p>
      </div>

      <!-- Live preview -->
      <div v-if="username.trim()" class="flex flex-col items-center justify-center p-8 bg-secondary/30 rounded-[32px] border border-border/50 backdrop-blur-md animate-fade-in">
        <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span class="text-2xl">👋</span>
        </div>
        <p class="text-xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent text-center">
          Hello, {{ username.trim() }}
        </p>
      </div>

      <!-- Action Button -->
      <button
        class="w-full h-14 bg-primary text-primary-foreground font-semibold text-[17px] rounded-[20px] active-scale-down transition-all flex items-center justify-center disabled:opacity-50 disabled:active:scale-100 shadow-sm"
        :disabled="!username.trim() || isSaving"
        @click="saveUsername"
      >
        <span v-if="isSaving" class="i-ph-spinner animate-spin mr-2 text-xl" />
        {{ isSaving ? 'Saving…' : 'Save Username' }}
      </button>
    </div>
  </div>
</template>
