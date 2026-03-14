<script setup lang="ts">
import { Home, Info, PlusCircle } from 'lucide-vue-next'

const route = useRoute()

const tabs = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/new', icon: PlusCircle, label: 'New' },
  { to: '/info', icon: Info, label: 'Info' },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav class="glass-nav px-2 pb-[env(safe-area-inset-bottom)]" aria-label="Main navigation">
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
          :size="tab.to === '/new' ? 26 : 20"
          :stroke-width="isActive(tab.to) ? 2.5 : 1.75"
        />
        <span class="text-xs font-medium tracking-wide">{{ tab.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
