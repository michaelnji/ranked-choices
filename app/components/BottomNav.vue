<script setup lang="ts">
import { Home, Plus, User } from 'lucide-vue-next'

const route = useRoute()

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/new', icon: Plus, label: 'New' },
  { to: '/settings', icon: User, label: 'Settings' },
]

function isActive(path: string) {
  if (path === '/')
    return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav
    class="glass-nav fixed bottom-0 right-0 left-0 px-2 pb-[env(safe-area-inset-bottom)]"
    aria-label="Main navigation"
  >
    <div class="flex items-center justify-around h-16">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        :aria-label="tab.label"
        :aria-current="isActive(tab.to) ? 'page' : undefined"
        class="flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors"
        :class="isActive(tab.to)
          ? 'text-primary'
          : 'text-muted-foreground hover:text-foreground'"
      >
        <component
          :is="tab.icon"
          :size="tab.to === '/new' ? 32 : 28"
        />
        <!-- <span class="text-xs font-medium tracking-wide">{{ tab.label }}</span> -->
      </NuxtLink>
    </div>
  </nav>
</template>
