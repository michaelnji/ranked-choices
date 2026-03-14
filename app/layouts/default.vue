<script setup lang="ts">
const route = useRoute()

// Show bottom nav only on root-level pages
const showBottomNav = computed(() => {
  const rootPages = ['/', '/info', '/new']
  return rootPages.includes(route.path)
})
</script>

<template>
  <div class="h-dvh bg-zinc-950 flex justify-center sm:py-8 sm:items-start transition-colors duration-300">
    <!-- Mobile Container -->
    <div
      class="w-full max-w-[480px] h-dvh sm:h-[calc(100dvh-4rem)] bg-background sm:rounded-[32px] flex flex-col relative shadow-2xl border border-zinc-800 overflow-hidden"
    >
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto flex flex-col relative w-full overflow-x-hidden">
        <slot />
      </main>

      <!-- Bottom Navigation -->
      <BottomNav v-if="showBottomNav" />
    </div>
  </div>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
