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
    class="absolute bottom-0 right-0 left-0 px-4 pb-[env(safe-area-inset-bottom)] pt-2 z-50 pointer-events-none"
    aria-label="Main navigation"
  >
    <div class="glass-nav mx-auto max-w-sm rounded-[24px] pointer-events-auto shadow-lg ring-1 ring-white/5 overflow-hidden flex items-center justify-around h-[68px] px-2 mb-4">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        :aria-label="tab.label"
        :aria-current="isActive(tab.to) ? 'page' : undefined"
        class="active-scale-down flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 relative"
        :class="isActive(tab.to)
          ? 'text-primary'
          : 'text-zinc-500 hover:text-zinc-300'"
      >
        <div class="relative flex items-center justify-center">
          <component
            :is="tab.icon"
            :size="24"
            :stroke-width="isActive(tab.to) ? 2.5 : 2"
            class="transition-all duration-300"
            :class="isActive(tab.to) ? '-translate-y-1' : ''"
          />
          <span
            class="absolute -bottom-3.5 w-1.5 h-1.5 rounded-full bg-primary transition-all duration-300"
            :class="isActive(tab.to) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
          />
        </div>
      </NuxtLink>
    </div>
  </nav>
</template>
