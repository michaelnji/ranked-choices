<script setup lang="ts">
import { Toaster } from 'vue-hot-toast'

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

// Root app
useHead({
  title: 'Ranked Choices',
  meta: [
    { name: 'description', content: 'Offline-first ranking tool' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover' },
    { name: 'theme-color', content: '#0f0f0f' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster
    v-if="isMounted" position="bottom-center" :toast-options="{
      style: {
        background: '#18181b',
        color: '#fff',
        border: '1px solid #27272a',
        borderRadius: '0.75rem',
        fontSize: '0.875rem',
      },
    }"
  />
</template>
