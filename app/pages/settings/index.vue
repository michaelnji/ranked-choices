<script setup lang="ts">
import { ChevronRight, User } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import { db } from '~/utils/db'

useHead({ title: 'Settings — Ranked Choices' })

interface Profile {
  id?: number
  username: string
  createdAt: Date
}

const profile = ref<Profile | null>(null)
const isLoading = ref(true)

const showClearDialog = ref(false)
const showDeleteDialog = ref(false)
const clearConfirmInput = ref('')
const deleteConfirmInput = ref('')
const isClearing = ref(false)
const isDeleting = ref(false)

const initials = computed(() => profile.value?.username?.charAt(0).toUpperCase() ?? '')
const clearConfirmValid = computed(() => clearConfirmInput.value.trim().toUpperCase() === 'CLEAR')
const deleteConfirmValid = computed(() => deleteConfirmInput.value === profile.value?.username)

const memberSince = computed(() => {
  if (!profile.value?.createdAt)
    return ''
  return new Date(profile.value.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
})

onMounted(async () => {
  const profiles = await db.profile.toArray()
  if (profiles.length > 0) {
    profile.value = profiles[0]!
  }
  isLoading.value = false
})

function openClearDialog() {
  clearConfirmInput.value = ''
  showClearDialog.value = true
}

function openDeleteDialog() {
  deleteConfirmInput.value = ''
  showDeleteDialog.value = true
}

async function clearAllLists() {
  if (!clearConfirmValid.value || isClearing.value)
    return
  isClearing.value = true
  try {
    await Promise.all([
      db.lists.clear(),
      db.criteria.clear(),
      db.items.clear(),
    ])
    showClearDialog.value = false
    clearConfirmInput.value = ''
    toast.success('All lists cleared.')
  }
  catch {
    toast.error('Something went wrong. Please try again.')
  }
  finally {
    isClearing.value = false
  }
}

async function deleteAccount() {
  if (!deleteConfirmValid.value || isDeleting.value)
    return
  isDeleting.value = true
  try {
    await Promise.all([
      db.profile.clear(),
      db.lists.clear(),
      db.criteria.clear(),
      db.items.clear(),
    ])
    window.location.href = '/'
  }
  catch {
    toast.error('Something went wrong. Please try again.')
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="animate-fade-in-up">
    <!-- Page header -->
    <div class="px-6 pt-8 pb-4 flex items-center gap-4">
      <!-- Avatar -->
      <div
        class="size-18 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <template v-if="isLoading">
          <div class="w-7 h-7 rounded-full bg-primary/20 animate-pulse" />
        </template>
        <span v-else class="text-2xl font-bold text-primary">{{ initials }}</span>
      </div>
      <!-- Name + context -->
      <div class="min-w-0 flex-1">
        <template v-if="isLoading">
          <div class="h-6 w-32 rounded bg-muted animate-pulse mb-1.5" />
          <div class="h-3.5 w-20 rounded bg-muted/60 animate-pulse" />
        </template>
        <template v-else>
          <h1 class="text-2xl font-bold text-foreground text-display truncate leading-tight">
            {{ profile?.username }}
          </h1>
          <p class="text-sm text-muted-foreground mt-0.5">
            Member since {{ memberSince }}
          </p>
        </template>
      </div>
    </div>

    <div class="px-5 pb-8 space-y-3">
      <!-- Profile section -->
      <div class="space-y-1.5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          Profile
        </h2>
        <NuxtLink to="/settings/username" class="block">
          <UiCard class="hover:border-primary/30 transition-colors">
            <UiCardContent class="flex items-center gap-4 py-4 px-5">
              <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <User :size="16" class="text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-foreground">
                  Username
                </p>
                <p class="text-xs text-muted-foreground mt-0.5 truncate">
                  {{ isLoading ? '…' : profile?.username ?? '—' }}
                </p>
              </div>
              <ChevronRight :size="16" class="text-muted-foreground shrink-0" />
            </UiCardContent>
          </UiCard>
        </NuxtLink>
      </div>

      <!-- About section -->
      <div class="space-y-1.5">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">
          About
        </h2>
        <NuxtLink to="/info" class="block">
          <UiCard class="hover:border-primary/30 transition-colors">
            <UiCardContent class="flex items-center gap-4 py-4 px-5">
              <div class="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
                  <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
                  <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-foreground">
                  About Ranked Choices
                </p>
                <p class="text-xs text-muted-foreground mt-0.5">
                  What it is and who made it
                </p>
              </div>
              <ChevronRight :size="16" class="text-muted-foreground shrink-0" />
            </UiCardContent>
          </UiCard>
        </NuxtLink>
      </div>

      <!-- Danger Zone — visually separated, no section label -->
      <div class="pt-4">
        <UiCard class="border-destructive/30 bg-destructive/5">
          <UiCardContent class="space-y-4 pt-5 pb-5">
            <div>
              <h2 class="text-base font-bold text-destructive">
                Danger Zone
              </h2>
              <p class="text-xs text-muted-foreground mt-1">
                These actions can't be undone — just making sure you know! 🙂
              </p>
            </div>
            <div class="flex flex-col gap-2.5">
              <UiButton
                variant="outline"
                class="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                @click="openClearDialog"
              >
                Clear All Lists
              </UiButton>
              <UiButton
                variant="destructive"
                class="w-full"
                @click="openDeleteDialog"
              >
                Delete Account
              </UiButton>
            </div>
          </UiCardContent>
        </UiCard>
      </div>
    </div>

    <!-- Clear All Lists Dialog -->
    <UiDialog :open="showClearDialog" @update:open="(val) => { showClearDialog = val; if (!val) clearConfirmInput = '' }">
      <UiDialogContent class="max-w-[90vw] rounded-2xl">
        <UiDialogHeader>
          <UiDialogTitle>Clear all lists?</UiDialogTitle>
          <UiDialogDescription>
            All your lists, items, and scores will be gone. Your profile stays safe.
          </UiDialogDescription>
        </UiDialogHeader>

        <div class="space-y-2 py-1">
          <UiLabel id="clear-confirm-label" for="clear-confirm" class="text-xs text-muted-foreground">
            Type <span class="font-semibold text-foreground tracking-widest">CLEAR</span> to confirm
          </UiLabel>
          <UiInput
            id="clear-confirm"
            v-model="clearConfirmInput"
            placeholder="CLEAR"
            autocomplete="off"
            @keydown.enter="clearAllLists"
          />
        </div>

        <UiDialogFooter>
          <UiButton
            variant="outline"
            class="flex-1"
            @click="showClearDialog = false; clearConfirmInput = ''"
          >
            Cancel
          </UiButton>
          <UiButton
            variant="destructive"
            class="flex-1 transition-opacity"
            :class="clearConfirmValid ? 'opacity-100' : 'opacity-40'"
            :disabled="!clearConfirmValid || isClearing"
            aria-describedby="clear-confirm-label"
            @click="clearAllLists"
          >
            {{ isClearing ? 'Clearing…' : 'Clear All Lists' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>

    <!-- Delete Account Dialog -->
    <UiDialog :open="showDeleteDialog" @update:open="(val) => { showDeleteDialog = val; if (!val) deleteConfirmInput = '' }">
      <UiDialogContent class="max-w-[90vw] rounded-2xl">
        <UiDialogHeader>
          <UiDialogTitle>Delete your account?</UiDialogTitle>
          <UiDialogDescription>
            Ready for a fresh start? This removes everything — your profile, all lists, and all data.
          </UiDialogDescription>
        </UiDialogHeader>

        <div class="space-y-2 py-1">
          <UiLabel id="delete-confirm-label" for="delete-confirm" class="text-xs text-muted-foreground">
            Type <span class="font-semibold text-foreground tracking-widest">{{ profile?.username }}</span> to confirm
          </UiLabel>
          <UiInput
            id="delete-confirm"
            v-model="deleteConfirmInput"
            :placeholder="profile?.username ?? 'your username'"
            autocomplete="off"
            @keydown.enter="deleteAccount"
          />
        </div>

        <UiDialogFooter>
          <UiButton
            variant="outline"
            class="flex-1"
            @click="showDeleteDialog = false; deleteConfirmInput = ''"
          >
            Cancel
          </UiButton>
          <UiButton
            variant="destructive"
            class="flex-1 transition-opacity"
            :class="deleteConfirmValid ? 'opacity-100' : 'opacity-40'"
            :disabled="!deleteConfirmValid || isDeleting"
            aria-describedby="delete-confirm-label"
            @click="deleteAccount"
          >
            {{ isDeleting ? 'Deleting…' : 'Delete Account' }}
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>
  </div>
</template>
