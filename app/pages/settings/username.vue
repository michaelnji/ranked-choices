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
  <div class="animate-fade-in-up">
    <AppHeader
      title="Edit Username"
      back="/settings"
      back-label="Back to settings"
    />

    <div class="px-5 pt-5 pb-8 space-y-6">
      <UiCard>
        <UiCardContent class="space-y-5 pt-6">
          <div class="space-y-2">
            <UiLabel for="username-input" class="text-label ml-1">
              Your name
            </UiLabel>
            <UiInput
              id="username-input"
              v-model="username"
              type="text"
              placeholder="e.g. Alex"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="words"
              @keydown.enter="saveUsername"
            />
            <p class="text-xs text-muted-foreground px-1">
              This is how we'll greet you across the app.
            </p>
          </div>

          <!-- Live preview -->
          <div class="rounded-xl bg-primary/5 border border-primary/15 px-4 py-3 text-center">
            <p class="text-base font-bold text-display text-foreground">
              Hello, {{ username.trim() || '…' }} 👋
            </p>
          </div>

          <UiButton
            class="w-full"
            :disabled="!username.trim() || isSaving"
            @click="saveUsername"
          >
            {{ isSaving ? 'Saving…' : 'Save Username' }}
          </UiButton>
        </UiCardContent>
      </UiCard>
    </div>
  </div>
</template>
