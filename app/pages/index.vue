<script setup lang="ts">
import { Calendar1, Download, Layers, LayoutList, Plus, Scale, Target, TrendingUp } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useLists } from '~/composables/useLists'
import { db } from '~/utils/db'

const { lists, fetchLists, deleteList } = useLists()
const deleteCandidateId = ref<number | null>(null)
const showDeleteDialog = ref(false)
const showInstallConfirm = ref(false)

const { canInstall, isInstalled, promptInstall } = usePwaInstall()

async function doInstall() {
  showInstallConfirm.value = false
  await promptInstall()
}

const username = ref<string>('')
const isLoadingProfile = ref(true)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12)
    return 'Good morning'
  if (hour < 17)
    return 'Good afternoon'
  return 'Good evening'
})

const totalItems = computed(() =>
  lists.value.reduce((sum, l) => sum + l.itemCount, 0),
)

const avgPerList = computed(() =>
  lists.value.length > 0 ? Math.round(totalItems.value / lists.value.length) : 0,
)

// Count-up animated display values
const animatedLists = ref(0)
const animatedItems = ref(0)
const animatedAvg = ref(0)

function countUp(target: { value: number }, to: number, duration = 650) {
  if (to === 0) {
    target.value = 0
    return
  }
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - (1 - t) ** 4 // ease-out-quart
    target.value = Math.round(eased * to)
    if (t < 1)
      requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

let statsAnimated = false
watch(lists, (newLists) => {
  if (newLists.length > 0 && !statsAnimated) {
    statsAnimated = true
    countUp(animatedLists, newLists.length, 500)
    countUp(animatedItems, totalItems.value, 700)
    countUp(animatedAvg, avgPerList.value, 550)
  }
})

onMounted(async () => {
  fetchLists()
  const profiles = await db.profile.toArray()
  if (profiles[0])
    username.value = profiles[0].username
  isLoadingProfile.value = false
})

function _handleDelete(id: number) {
  deleteCandidateId.value = id
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (deleteCandidateId.value == null)
    return
  try {
    await deleteList(deleteCandidateId.value)
    deleteCandidateId.value = null
    showDeleteDialog.value = false
  }
  catch {
    // silent
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

  if (diffInSeconds < 60)
    return 'Just now'
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`

  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div class="p-5 space-y-12 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center justify-between pt-1">
      <div class="flex items-center gap-2.5">
        <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
          <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
          <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
        </svg>
        <h1 class="text-lg font-medium! text-display text-foreground">
          Ranked Choices
        </h1>
      </div>

      <!-- Install button — hidden once app is installed -->
      <UiButton
        v-if="canInstall && !isInstalled"
        variant="outline"
        size="sm"
        class="gap-1.5 h-8 text-xs border-primary/30 text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/50 shrink-0"
        @click="showInstallConfirm = true"
      >
        <Download :size="16" />
        Install
      </UiButton>
    </div>

    <!-- Greeting + Stats -->
    <div class="space-y-6">
      <div>
        <template v-if="isLoadingProfile">
          <div class="h-6 w-44 rounded-lg bg-muted animate-pulse" />
        </template>
        <template v-else>
          <p class="text-2xl font-medium text-foreground">
            {{ greeting }}{{ username ? `, ${username}` : '' }} 👋
          </p>
        </template>
      </div>

      <!-- Stats Grid -->
      <div v-if="lists.length > 0" class="grid grid-cols-3 gap-2">
        <div class="animate-fade-in-up stagger-1 bg-card border border-border rounded-xl p-3 flex flex-col gap-2">
          <div class="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
            <LayoutList :size="16" class="text-primary" />
          </div>
          <div>
            <p class="text-2xl font-bold text-display text-foreground tabular-nums leading-none">
              {{ animatedLists }}
            </p>
            <p class="text-xs text-muted-foreground mt-1 leading-tight">
              {{ lists.length === 1 ? 'list' : 'lists' }}
            </p>
          </div>
        </div>

        <div class="animate-fade-in-up stagger-2 bg-card border border-border rounded-xl p-3 flex flex-col gap-2">
          <div class="w-7 h-7 rounded-lg bg-success/15 flex items-center justify-center shrink-0">
            <Layers :size="16" class="text-success" />
          </div>
          <div>
            <p class="text-2xl font-bold text-display text-foreground tabular-nums leading-none">
              {{ animatedItems }}
            </p>
            <p class="text-xs text-muted-foreground mt-1 leading-tight">
              {{ totalItems === 1 ? 'item' : 'items' }}
            </p>
          </div>
        </div>

        <div class="animate-fade-in-up stagger-3 bg-card border border-border rounded-xl p-3 flex flex-col gap-2">
          <div class="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center shrink-0">
            <TrendingUp :size="16" class="text-warning" />
          </div>
          <div>
            <p class="text-2xl font-bold text-display text-foreground tabular-nums leading-none">
              {{ animatedAvg }}
            </p>
            <p class="text-xs text-muted-foreground mt-1 leading-tight">
              avg per list
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State with Inline Onboarding -->
    <div v-if="lists.length === 0" class="space-y-6">
      <div class="space-y-4">
        <p class="text-label">
          How it works
        </p>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary shrink-0 mt-0.5">
              <LayoutList :size="16" />
            </span>
            <div>
              <p class="text-sm font-semibold text-foreground">
                Create a list
              </p>
              <p class="text-xs text-muted-foreground mt-0.5">
                Name your decision — "Best Laptops", "Vacation Spots"
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-success/10 text-success shrink-0 mt-0.5">
              <Scale :size="16" />
            </span>
            <div>
              <p class="text-sm font-semibold text-foreground">
                Define criteria
              </p>
              <p class="text-xs text-muted-foreground mt-0.5">
                Set what matters: cost, quality, fit. Give each a weight.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="flex items-center justify-center w-6 h-6 rounded-md bg-warning/10 text-warning shrink-0 mt-0.5">
              <Target :size="16" />
            </span>
            <div>
              <p class="text-sm font-semibold text-foreground">
                Score &amp; rank
              </p>
              <p class="text-xs text-muted-foreground mt-0.5">
                Add options and see which one wins based on your criteria.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NuxtLink to="/new">
        <UiButton class="w-full" size="lg">
          <Plus :size="16" class="mr-2" />
          Create your first list
        </UiButton>
      </NuxtLink>
    </div>

    <!-- List Items -->
    <ul v-else class="space-y-2 mt-8">
      <li v-for="list in lists" :key="list.id">
        <NuxtLink :to="`/lists/${list.id}`">
          <div
            class="group flex items-center gap-3 bg-card border border-zinc-800 rounded-lg px-4 py-3 hover:border-primary/30 transition-all"
          >
            <div class="flex-1 min-w-0">
              <h2 class="text-base font-medium text-foreground truncate">
                {{ list.name }}
              </h2>
              <div class="flex items-center gap-2 mt-1">
                <span class="flex items-center gap-1 text-xs text-muted-foreground">
                  <LayoutList :size="11" />
                  {{ list.itemCount }} items
                </span>
                <span class="text-muted-foreground/40">·</span>
                <span class="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar1 :size="11" />
                  {{ formatTimeAgo(list.createdAt) }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <!-- Install Confirm Dialog -->
    <UiDialog :open="showInstallConfirm" @update:open="showInstallConfirm = $event">
      <UiDialogContent class="max-w-[90vw] rounded-2xl">
        <UiDialogHeader>
          <UiDialogTitle>Install Ranked Choices?</UiDialogTitle>
          <UiDialogDescription>
            Add the app to your home screen for instant access. Works offline, loads fast — no app store required.
          </UiDialogDescription>
        </UiDialogHeader>
        <UiDialogFooter>
          <UiButton variant="outline" class="flex-1" @click="showInstallConfirm = false">
            Cancel
          </UiButton>
          <UiButton class="flex-1" @click="doInstall">
            <Download :size="15" class="mr-1.5" />
            Install
          </UiButton>
        </UiDialogFooter>
      </UiDialogContent>
    </UiDialog>

    <!-- Delete Confirmation Dialog -->
    <UiAlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <UiAlertDialogContent>
        <UiAlertDialogHeader>
          <UiAlertDialogTitle>Delete list?</UiAlertDialogTitle>
          <UiAlertDialogDescription>
            This cannot be undone. The list and all its rankings will be permanently deleted.
          </UiAlertDialogDescription>
        </UiAlertDialogHeader>
        <UiAlertDialogFooter>
          <UiAlertDialogCancel @click="showDeleteDialog = false">
            Cancel
          </UiAlertDialogCancel>
          <UiAlertDialogAction class="bg-destructive text-destructive-foreground hover:bg-destructive/90" @click="confirmDelete">
            Delete
          </UiAlertDialogAction>
        </UiAlertDialogFooter>
      </UiAlertDialogContent>
    </UiAlertDialog>
  </div>

  <!-- FAB — outside the animated wrapper so position:fixed isn't broken by transform -->
  <NuxtLink v-if="lists.length > 0" to="/new" class="fixed bottom-22 right-4 z-40" aria-label="Create new list">
    <UiButton size="icon-lg" class="size-12 rounded-full shadow-lg shadow-primary/20">
      <Plus :size="48" />
    </UiButton>
  </NuxtLink>
</template>
