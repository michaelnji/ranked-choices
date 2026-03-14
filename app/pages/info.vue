<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'

useHead({
  title: 'Info - Ranked Choices',
})
</script>

<template>
  <div class="p-6 space-y-8 animate-fade-in-up">
    <!-- Page Title -->
    <div class="flex items-center gap-3">
      <svg width="36" height="36" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
        <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
        <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
      </svg>
      <div>
        <h1 class="text-2xl text-display text-foreground leading-none">
          Ranked Choices
        </h1>
        <p class="text-xs text-muted-foreground mt-0.5 tracking-wide">
          decision made simple
        </p>
      </div>
    </div>

    <UiCard>
      <UiCardContent class="space-y-8 pt-6">
        <!-- About Section -->
        <div class="space-y-3">
          <h2 class="text-xl font-bold text-foreground">
            What is Ranked Choices?
          </h2>
          <p class="text-muted-foreground leading-relaxed">
            An offline-first decision tool. Create lists, define criteria, and score your options to see what comes out on top.
          </p>
        </div>

        <UiSeparator />

        <!-- Creator Section -->
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-muted overflow-hidden border border-zinc-800">
              <img
                src="https://www.michaelnji.codes/_vercel/image?url=%2Fimages%2Fme.png&w=1024&q=100"
                alt="Michael Nji"
                loading="lazy"
                class="w-full h-full object-cover"
              >
            </div>
            <div>
              <h3 class="font-bold text-lg text-foreground">
                Michael Nji
              </h3>
              <p class="text-sm text-primary font-medium uppercase tracking-wider">
                Full Stack Developer
              </p>
            </div>
          </div>

          <p class="text-muted-foreground leading-relaxed">
            Full stack developer with a passion for building beautiful and robust web projects. Contributor to open source including the Biome documentation. Building with Vue.js, Nuxt.js, TypeScript, and TailwindCSS.
          </p>

          <UiButton as-child class="w-full">
            <a
              href="https://michaelnji.codes"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Michael Nji's portfolio (opens in new tab)"
              class="flex items-center justify-center gap-2"
            >
              Visit Portfolio
              <ExternalLink :size="16" />
            </a>
          </UiButton>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
