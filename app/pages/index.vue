<script setup lang="ts">
import { ChevronRight, Download, Layers, LayoutList, Plus, Scale, Target, TrendingUp } from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useLists } from '~/composables/useLists'
import { db } from '~/utils/db'

const { lists, fetchLists, deleteList } = useLists()
const deleteCandidateId = ref<number | null>(null)
const showDeleteDialog = ref(false)
const showInstallConfirm = ref(false)
const showIOSInstructions = ref(false)

const { canInstall, canShowIOSInstructions, canShowInstallUI, isInstalled, promptInstall } = usePwaInstall()

async function doInstall() {
  showInstallConfirm.value = false
  await promptInstall()
}

function showInstallDialog() {
  if (canInstall.value) {
    showInstallConfirm.value = true
  }
  else if (canShowIOSInstructions.value) {
    showIOSInstructions.value = true
  }
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
  <div class="px-5 pt-2 min-h-full flex flex-col gap-8 animate-fade-in-up">
    <!-- Native Large Title Header -->
    <header class="flex items-end justify-between pt-4">
      <div class="space-y-1">
        <!-- Optional smaller brand label above the large title -->
        <div class="flex items-center gap-2 mb-2 opacity-80">
          <svg width="14" height="14" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
            <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
            <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
          </svg>
          <span class="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Ranked</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-foreground">
          <template v-if="isLoadingProfile">
            <div class="h-9 w-44 rounded-lg bg-zinc-800 animate-pulse mt-1" />
          </template>
          <template v-else>
            <div class="flex items-center flex-wrap gap-3">
              {{ greeting }}<span v-if="username" class="text-primary">{{ username }}</span>
            </div>
          </template>
        </h1>
      </div>

      <!-- Install button — positioned naturally -->
      <button
        v-if="canShowInstallUI && !isInstalled"
        class="active-scale-down-sm flex items-center justify-center size-10 rounded-full bg-zinc-800 text-primary shrink-0 relative overflow-hidden"
        aria-label="Install App" @click="showInstallDialog"
      >
        <div class="absolute inset-0 bg-primary/10 rounded-full" />
        <Download :size="18" class="relative z-10" />
      </button>
    </header>

    <!-- Stats Grid -->
    <div v-if="lists.length > 0" class="grid grid-cols-3 gap-3">
      <div
        class="active-scale-down-sm animate-fade-in-up stagger-1 relative overflow-hidden rounded-[20px] bg-zinc-900/80 p-3.5 ring-1 ring-white/5 flex flex-col gap-3 group"
      >
        <div
          class="absolute -top-6 -right-6 w-16 h-16 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-colors"
        />
        <div class="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <LayoutList :size="16" class="text-primary" />
        </div>
        <div>
          <p class="text-2xl font-bold text-foreground tabular-nums tracking-tight">
            {{ animatedLists }}
          </p>
          <p class="text-[11px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wide">
            {{ lists.length === 1 ? 'List' : 'Lists' }}
          </p>
        </div>
      </div>

      <div
        class="active-scale-down-sm animate-fade-in-up stagger-2 relative overflow-hidden rounded-[20px] bg-zinc-900/80 p-3.5 ring-1 ring-white/5 flex flex-col gap-3 group"
      >
        <div
          class="absolute -top-6 -right-6 w-16 h-16 bg-success/20 blur-xl rounded-full group-hover:bg-success/30 transition-colors"
        />
        <div class="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center shrink-0">
          <Layers :size="16" class="text-success" />
        </div>
        <div>
          <p class="text-2xl font-bold text-foreground tabular-nums tracking-tight">
            {{ animatedItems }}
          </p>
          <p class="text-[11px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wide">
            {{ totalItems === 1 ? 'Item' : 'Items' }}
          </p>
        </div>
      </div>

      <div
        class="active-scale-down-sm animate-fade-in-up stagger-3 relative overflow-hidden rounded-[20px] bg-zinc-900/80 p-3.5 ring-1 ring-white/5 flex flex-col gap-3 group"
      >
        <div
          class="absolute -top-6 -right-6 w-16 h-16 bg-warning/20 blur-xl rounded-full group-hover:bg-warning/30 transition-colors"
        />
        <div class="w-8 h-8 rounded-full bg-warning/15 flex items-center justify-center shrink-0">
          <TrendingUp :size="16" class="text-warning" />
        </div>
        <div>
          <p class="text-2xl font-bold text-foreground tabular-nums tracking-tight">
            {{ animatedAvg }}
          </p>
          <p class="text-[11px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wide">
            Avg / List
          </p>
        </div>
      </div>
    </div>

    <!-- Empty State with Inline Onboarding -->
    <div v-if="lists.length === 0" class="flex-1 flex flex-col justify-center space-y-8 pb-32 animate-fade-in">
      <div class="space-y-6 bg-zinc-900/60 backdrop-blur-xl rounded-[24px] p-6 ring-1 ring-white/5">
        <h2 class="text-lg font-semibold text-foreground">
          How it works
        </h2>
        <div class="space-y-5">
          <div class="flex items-start gap-4">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0 ring-1 ring-primary/20"
            >
              <LayoutList :size="20" stroke-width="2.5" />
            </div>
            <div class="pt-0.5">
              <p class="text-sm font-semibold text-foreground">
                Create a list
              </p>
              <p class="text-[13px] text-muted-foreground mt-0.5 leading-snug">
                Name your decision — "Best Laptops", "Vacation Spots"
              </p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-success/10 text-success shrink-0 ring-1 ring-success/20"
            >
              <Scale :size="20" stroke-width="2.5" />
            </div>
            <div class="pt-0.5">
              <p class="text-sm font-semibold text-foreground">
                Define criteria
              </p>
              <p class="text-[13px] text-muted-foreground mt-0.5 leading-snug">
                Set what matters: cost, quality. Give each a weight.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-4">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full bg-warning/10 text-warning shrink-0 ring-1 ring-warning/20"
            >
              <Target :size="20" stroke-width="2.5" />
            </div>
            <div class="pt-0.5">
              <p class="text-sm font-semibold text-foreground">
                Score &amp; rank
              </p>
              <p class="text-[13px] text-muted-foreground mt-0.5 leading-snug">
                Add options and see which one wins based on your criteria.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NuxtLink to="/new" class="active-scale-down block">
        <UiButton
          class="w-full h-14 rounded-2xl text-[15px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 border-0"
        >
          <Plus :size="20" class="mr-2" stroke-width="2.5" />
          Create your first list
        </UiButton>
      </NuxtLink>
    </div>

    <!-- List Items -->
    <div v-else class="space-y-3 animate-fade-in-up stagger-4">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-[15px] font-semibold text-foreground tracking-tight">
          Your Lists
        </h2>
      </div>

      <div class="ios-list">
        <NuxtLink v-for="list in lists" :key="list.id" :to="`/lists/${list.id}`" class="ios-list-item group">
          <div class="flex-1 min-w-0 py-1">
            <h3 class="text-[15px] font-medium text-foreground truncate tracking-tight">
              {{ list.name }}
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span class="flex items-center gap-1 text-[13px] text-muted-foreground">
                {{ list.itemCount }} items
              </span>
              <span class="text-zinc-600">·</span>
              <span class="flex items-center gap-1 text-[13px] text-muted-foreground">
                {{ formatTimeAgo(list.createdAt) }}
              </span>
            </div>
          </div>
          <ChevronRight
            :size="18"
            class="text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 translate-x-1 group-hover:translate-x-0"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- Install Confirm Dialog -->
    <UiDialog :open="showInstallConfirm" @update:open="showInstallConfirm = $event">
      <UiDialogContent>
        <UiDialogHeader>
          <UiDialogTitle class="text-[22px] font-bold tracking-tight text-foreground">
            Install Ranked Choices?
          </UiDialogTitle>
          <UiDialogDescription class="text-[15px] text-muted-foreground mt-2 leading-relaxed">
            Add the app to your home screen for instant access. Works offline, loads fast — no app store required.
          </UiDialogDescription>
        </UiDialogHeader>

        <div class="flex gap-3 mt-4">
          <button class="flex-1 py-3.5 rounded-[14px] bg-zinc-800 text-foreground font-semibold active-scale-down-sm transition-colors hover:bg-zinc-700" @click="showInstallConfirm = false">
            Cancel
          </button>
          <button class="flex-1 py-3.5 flex items-center justify-center gap-2 rounded-[14px] bg-primary text-primary-foreground font-semibold active-scale-down-sm transition-colors hover:bg-primary/90 shadow-md shadow-primary/20" @click="doInstall">
            <Download :size="18" stroke-width="2.5" />
            Install
          </button>
        </div>
      </UiDialogContent>
    </UiDialog>

    <!-- iOS Install Instructions Dialog -->
    <UiDialog :open="showIOSInstructions" @update:open="showIOSInstructions = $event">
      <UiDialogContent>
        <UiDialogHeader>
          <UiDialogTitle class="text-[22px] font-bold tracking-tight text-foreground">
            Install on iOS
          </UiDialogTitle>
          <UiDialogDescription class="text-[15px] text-muted-foreground mt-2">
            To install this app on your iPhone or iPad:
          </UiDialogDescription>
        </UiDialogHeader>

        <div class="ios-list p-0 my-5 shadow-sm overflow-hidden border border-white/5">
          <div class="p-4 flex items-start gap-4 border-b border-white/5">
            <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
              <span class="text-[14px] font-bold text-foreground">1</span>
            </div>
            <p class="text-[16px] text-foreground leading-snug">
              Tap the <strong class="font-semibold text-primary">Share button</strong> (square with arrow) at the bottom of Safari.
            </p>
          </div>
          <div class="p-4 flex items-start gap-4 border-b border-white/5">
            <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
              <span class="text-[14px] font-bold text-foreground">2</span>
            </div>
            <p class="text-[16px] text-foreground leading-snug">
              Scroll down and tap <strong class="font-semibold text-primary">Add to Home Screen</strong>.
            </p>
          </div>
          <div class="p-4 flex items-start gap-4">
            <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10 mt-0.5">
              <span class="text-[14px] font-bold text-foreground">3</span>
            </div>
            <p class="text-[16px] text-foreground leading-snug">
              Tap <strong class="font-semibold text-primary">Add</strong> in the top right corner.
            </p>
          </div>
        </div>

        <p class="text-[14px] text-center text-zinc-500 mb-6 font-medium">
          The app will appear on your home screen and work fully offline!
        </p>

        <button class="w-full h-14 rounded-[16px] bg-primary text-primary-foreground text-[17px] font-semibold active-scale-down transition-colors hover:bg-primary/90 shadow-md shadow-primary/20 tracking-wide" @click="showIOSInstructions = false">
          Got it
        </button>
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
  <NuxtLink
    v-if="lists.length > 0" to="/new" class="fixed bottom-[90px] right-5 z-40 active-scale-down block"
    aria-label="Create new list"
  >
    <button
      class="flex items-center justify-center size-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-white/10 hover:bg-primary/90 transition-all"
    >
      <Plus :size="28" stroke-width="2.5" />
    </button>
  </NuxtLink>
</template>
