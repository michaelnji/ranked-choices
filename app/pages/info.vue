<script setup lang="ts">
import { ChevronLeft, ExternalLink } from 'lucide-vue-next'

useHead({
  title: 'Info - Ranked Choices',
})
</script>

<template>
  <div class="p-6 space-y-8 pb-6 animate-fade-in-up">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink
        to="/"
        class="btn btn-ghost rounded-full !p-3 hover:bg-surface-800 text-surface-400 hover:text-white transition-colors"
      >
        <ChevronLeft :size="24" stroke-width="2.5" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl text-display text-white">
          Info
        </h1>
        <p class="text-surface-400 font-medium">
          About this app
        </p>
      </div>
    </div>

    <div class="card space-y-4">
      <h2 class="text-xl font-bold text-white">
        What is Ranked Choices?
      </h2>
      <p class="text-surface-300 leading-relaxed">
        Ranked Choices is an offline-first decision making tool designed to help you make better choices through structured ranking. Create lists, define criteria, and score your options to see what comes out on top.
      </p>
    </div>

    <div class="card space-y-6">
      <h2 class="text-xl font-bold text-white">
        About the Creator
      </h2>

      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-surface-800 overflow-hidden border border-surface-700 shadow-lg">
          <img
            src="https://www.michaelnji.codes/_vercel/image?url=%2Fimages%2Fme.png&w=1024&q=100" alt="Michael Nji"
            class="w-full h-full object-cover"
          >
        </div>
        <div>
          <h3 class="font-bold text-lg text-white">
            Michael Nji
          </h3>
          <p class="text-sm text-primary-400 font-medium uppercase tracking-wider">
            Full Stack Developer
          </p>
        </div>
      </div>

      <div class="space-y-4 text-surface-300 leading-relaxed">
        <p>
          I am a Full stack web developer with a passion for building beautiful and robust web projects. Over the years
          I have contributed to open source, including the documentation of Biome, a fast javascript linter and
          formatter.
        </p>
        <p>
          I have been building projects with web technologies for over 3 years now, gaining valuable experience through
          practice & consistent learning. I have experience with technologies like Vue.js, React.js, Next.js, Nuxt.js,
          TypeScript, Supabase, and TailwindCSS.
        </p>
      </div>

      <a
        href="https://michaelnji.codes" target="_blank"
        class="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
      >
        Visit Portfolio
        <ExternalLink :size="18" />
      </a>
    </div>
  </div>
</template>
