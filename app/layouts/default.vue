<script setup lang="ts">
import { Info } from 'lucide-vue-next'

// We don't need the strict mobile check anymore as we'll use a responsive container
</script>

<template>
  <div class="min-h-screen bg-black flex justify-center items-start sm:py-8 transition-colors duration-300">
    <!-- Mobile Container -->
    <div class="w-full max-w-[480px] min-h-screen sm:min-h-[calc(100vh-4rem)] bg-surface-950 sm:rounded-[40px] flex flex-col relative shadow-2xl overflow-hidden border border-surface-900 ring-8 ring-surface-900/50">
      <!-- Top Bar -->
      <header
        class="fixed w-full top-0 z-50 flex items-center justify-between px-6 py-5 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50"
      >
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-primary-950 font-black text-lg shadow-[0_0_15px_-3px_var(--color-primary-500)] group-hover:scale-110 transition-transform">
            R
          </div>
          <span class="font-display font-bold text-lg tracking-tight text-white group-hover:text-primary-400 transition-colors">Ranked</span>
        </NuxtLink>

        <NuxtLink to="/info" class="p-2 -mr-2 rounded-full hover:bg-surface-800 text-surface-400 hover:text-white transition-colors">
          <Info :size="24" stroke-width="2.5" />
        </NuxtLink>
      </header>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col pt-24 relative w-full overflow-x-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for the app container */
div::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>
