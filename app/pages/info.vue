<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'

useHead({
  title: 'Info - Ranked Choices',
})
</script>

<template>
  <div class="px-5 pt-12 pb-32 animate-fade-in-up flex flex-col gap-10">
    <!-- App Hero Section -->
    <div class="flex flex-col items-center justify-center text-center space-y-5 animate-fade-in-up stagger-1">
      <div class="w-24 h-24 rounded-[28px] bg-zinc-900 shadow-xl shadow-black/50 border border-white/10 flex items-center justify-center -rotate-3 overflow-hidden relative group">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <svg width="48" height="48" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="group-hover:rotate-6 transition-transform duration-500">
          <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
          <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
          <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
        </svg>
      </div>

      <div class="space-y-2">
        <h1 class="text-3xl font-black text-display text-foreground tracking-tight">
          Ranked Choices
        </h1>
        <p class="text-[17px] text-muted-foreground font-medium">
          Decision making, simplified.
        </p>
      </div>

      <div class="px-6 mx-auto">
        <p class="text-[15px] text-muted-foreground leading-relaxed">
          An offline-first tool to create lists, define distinct criteria, and score options to objectively find what comes out on top.
        </p>
      </div>
    </div>

    <!-- Creator Details -->
    <div class="space-y-4 animate-fade-in-up stagger-2">
      <h2 class="text-[13px] font-semibold uppercase tracking-wider text-muted-foreground ml-2">
        Created By
      </h2>

      <div class="ios-list shadow-md p-5 pb-0 space-y-6">
        <div class="flex items-center gap-5">
          <div class="w-[72px] h-[72px] rounded-full overflow-hidden border border-white/10 shrink-0 shadow-inner">
            <img
              src="https://www.michaelnji.codes/_vercel/image?url=%2Fimages%2Fme.png&w=1024&q=100"
              alt="Michael Nji"
              loading="lazy"
              class="w-full h-full object-cover"
            >
          </div>
          <div class="space-y-0.5">
            <h3 class="font-bold text-[22px] text-foreground tracking-tight">
              Michael Nji
            </h3>
            <p class="text-[15px] text-primary font-medium">
              Full Stack Developer
            </p>
          </div>
        </div>

        <p class="text-[15px] text-muted-foreground leading-relaxed border-t border-white/5 pt-5 pb-5">
          Passionate about building beautiful, robust web projects. Contributor to open source, currently building with Vue.js, TypeScript, Nuxt, and Tailwind.
        </p>

        <div class="border-t border-white/5">
          <a
            href="https://michaelnji.codes"
            target="_blank"
            rel="noopener noreferrer"
            class="ios-list-item flex items-center justify-between w-full h-[60px] active-scale-down-sm px-0 group"
          >
            <span class="text-[17px] font-medium text-foreground">Visit Portfolio</span>
            <ExternalLink :size="20" class="text-zinc-600 group-hover:text-primary transition-colors" />
          </a>
        </div>
      </div>
    </div>

    <!-- App Meta Info -->
    <div class="flex flex-col items-center gap-1 mt-auto pb-4 animate-fade-in-up stagger-3">
      <p class="text-[13px] text-zinc-600 font-medium">
        Version 1.0.0
      </p>
    </div>
  </div>
</template>
