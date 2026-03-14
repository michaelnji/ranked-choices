<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'

useHead({
  title: 'Info - Ranked Choices',
})
</script>

<template>
  <div class="p-6 space-y-8 pb-6 animate-fade-in-up">
    <!-- Page Title -->
    <div>
      <h1 class="text-3xl text-display text-foreground">
        Info
      </h1>
    </div>

    <!-- About Section -->
    <UiCard>
      <UiCardContent class="space-y-4 pt-6">
        <h2 class="text-xl font-bold text-foreground">
          What is Ranked Choices?
        </h2>
        <p class="text-muted-foreground leading-relaxed">
          Ranked Choices is an offline-first decision making tool designed to help you make better choices through
          structured ranking. Create lists, define criteria, and score your options to see what comes out on top.
        </p>
      </UiCardContent>
    </UiCard>

    <UiSeparator />

    <!-- Creator Section -->
    <UiCard>
      <UiCardContent class="space-y-6 pt-6">
        <h2 class="text-xl font-bold text-foreground">
          About the Creator
        </h2>

        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-muted overflow-hidden border border-zinc-800 shadow-lg">
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

        <div class="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            I am a Full stack web developer with a passion for building beautiful and robust web projects. Over the
            years
            I have contributed to open source, including the documentation of Biome, a fast javascript linter and
            formatter.
          </p>
          <p>
            I have been building projects with web technologies for over 3 years now, gaining valuable experience
            through
            practice & consistent learning. I have experience with technologies like Vue.js, React.js, Next.js, Nuxt.js,
            TypeScript, Supabase, and TailwindCSS.
          </p>
        </div>

        <UiButton as-child class="w-full mt-4">
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
      </UiCardContent>
    </UiCard>
  </div>
</template>
