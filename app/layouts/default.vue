<script setup lang="ts">
const isMobile = ref(true)
const isReady = ref(false)

function updateViewport() {
  const width = window.innerWidth
  isMobile.value = width >= 320 && width <= 768
  isReady.value = true
}

onMounted(() => {
  updateViewport()
  window.addEventListener('resize', updateViewport)
  window.addEventListener('orientationchange', updateViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateViewport)
  window.removeEventListener('orientationchange', updateViewport)
})
</script>

<template>
  <div class="k-app pb-0!">
    <div class="k-shell pb-0!" :class="{ 'k-disabled': isReady && !isMobile }">
      <header class="k-topbar">
        <NuxtLink to="/" class="k-brand">
          Ranked Choices
        </NuxtLink>
        <NuxtLink to="/info" class="k-top-link flex items-center gap-1">
          <Icon name="solar:info-circle-bold" class="text-xl" />
        </NuxtLink>
      </header>

      <main class="k-main pb-0! m-0!">
        <slot />
      </main>
    </div>
    <div v-if="isReady && !isMobile" class="k-desktop-block bg-(--color-bg)!">
      <div class="k-card bg-(--color-bg)!">
        <h1 class="k-title text-(--color-text)">
          Mobile Only
        </h1>
        <p class="k-muted">
          This experience is designed for phones between 320px and 768px wide.
        </p>
      </div>
    </div>
  </div>
</template>
