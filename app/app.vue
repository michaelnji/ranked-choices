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
      class="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-4"
      aria-label="Loading"
      aria-live="polite"
    >
      <div class="flex flex-col items-center gap-5">
        <!-- Logo mark — three ranked bars, tricolor -->
        <svg width="56" height="56" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
          <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
          <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
        </svg>
        <div class="text-center">
          <h1 class="text-2xl text-display text-foreground">
            Ranked Choices
          </h1>
          <p class="text-sm text-muted-foreground mt-1">
            decision made simple
          </p>
        </div>
      </div>

      <div class="absolute bottom-12 flex gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style="animation-delay: 0ms" />
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style="animation-delay: 150ms" />
        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style="animation-delay: 300ms" />
      </div>
    </div>
  </Transition>

  <!-- Toast notifications -->
  <Toaster position="bottom-center" :duration="3000" theme="dark" rich-colors />
</template>

<style>
.splash-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.splash-leave-to {
  opacity: 0;
  transform: scale(1.03);
}
</style>
