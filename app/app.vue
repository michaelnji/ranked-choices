<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Toaster } from 'vue-sonner'
import { db } from '~/utils/db'

// Root app
useHead({
  htmlAttrs: { lang: 'en' },
  title: 'Ranked Choices',
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png', sizes: '180x180' },
  ],
  meta: [
    { name: 'description', content: 'Offline-first ranking tool' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' },
    { name: 'theme-color', content: '#09090b' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  ],
})

const showSplash = ref(true)

onMounted(async () => {
  await Promise.all([
    db.open().catch(() => {}),
    new Promise(resolve => setTimeout(resolve, 2000)),
  ])
  showSplash.value = false
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <Transition name="splash">
    <div
      v-if="showSplash"
      class="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center"
      aria-label="Loading"
      aria-live="polite"
    >
      <div class="flex flex-col items-center gap-8 animate-fade-in-up">
        <!-- Logo Squircle -->
        <div class="w-32 h-32 rounded-[36px] bg-zinc-900 shadow-2xl shadow-black/80 border border-white/10 flex items-center justify-center relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-80 backdrop-blur-3xl" />
          <svg width="60" height="60" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="relative z-10 drop-shadow-lg">
            <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
            <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
            <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
          </svg>
        </div>

        <div class="text-center space-y-3">
          <h1 class="text-[34px] font-bold text-foreground tracking-tight leading-none">
            Ranked Choices
          </h1>
          <p class="text-[17px] font-medium text-muted-foreground tracking-wide">
            Decision making, simplified.
          </p>
        </div>
      </div>

      <!-- Organic Loader -->
      <div class="absolute bottom-16 flex flex-col items-center gap-4 animate-fade-in" style="animation-delay: 0.3s; animation-fill-mode: both;">
        <div class="flex gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-zinc-700 animate-bounce shadow-sm" style="animation-duration: 1s; animation-delay: 0ms" />
          <span class="w-2.5 h-2.5 rounded-full bg-zinc-600 animate-bounce shadow-sm" style="animation-duration: 1s; animation-delay: 150ms" />
          <span class="w-2.5 h-2.5 rounded-full bg-zinc-500 animate-bounce shadow-sm" style="animation-duration: 1s; animation-delay: 300ms" />
        </div>
      </div>
    </div>
  </Transition>

  <!-- Toast notifications -->
  <Toaster position="bottom-center" :duration="3000" theme="dark" rich-colors />
</template>

<style>
.splash-leave-active {
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.splash-leave-to {
  opacity: 0;
  transform: scale(1.08);
  filter: blur(10px);
}
</style>
