<script setup lang="ts">
// Info / About page
useHead({
  title: 'Info - Ranked Choices',
})
</script>

<template>
  <div class="space-y-6 pb-20">
    <div class="k-card space-y-4">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="k-btn k-btn-ghost">
          <Icon name="solar:arrow-left-bold" class="text-xl" />
        </NuxtLink>
        <div>
          <p class="k-section-subtitle">
            About
          </p>
          <h1 class="k-title">
            Info
          </h1>
        </div>
      </div>
    </div>

    <div class="k-card space-y-4">
      <h2 class="k-section-title">
        What is Ranked Choices?
      </h2>
      <p>
        Ranked Choices is an offline-first decision making tool designed to help you make better choices through structured ranking. Create lists, define criteria, and score your options to see what comes out on top.
      </p>
    </div>

    <div class="k-card space-y-4">
      <h2 class="k-section-title">
        About the Creator
      </h2>
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-neutral-200 overflow-hidden border-[3px] border-(--color-text)">
          <img src="https://michaelnji.codes/avatar.png" alt="Michael Nji" class="w-full h-full object-cover" onerror="this.style.display='none'">
        </div>
        <div>
          <h3 class="font-bold text-lg">
            Michael Nji
          </h3>
          <p class="text-sm text-(--color-text-muted)">
            Full Stack Web Developer
          </p>
        </div>
      </div>
      <p>
        I am a Full stack web developer with a passion for building beautiful and robust web projects. Over the years I have contributed to open source, including the documentation of Biome, a fast javascript linter and formatter.
      </p>
      <p>
        I have been building projects with web technologies for over 3 years now, gaining valuable experience through practice & consistent learning. I have experience with technologies like Vue.js, React.js, Next.js, Nuxt.js, TypeScript, Supabase, and TailwindCSS.
      </p>
      <div class="pt-2">
        <a href="https://michaelnji.codes" target="_blank" class="k-btn k-btn-primary w-full flex items-center justify-center gap-2">
          Visit Portfolio
          <Icon name="solar:link-bold" />
        </a>
      </div>
    </div>
  </div>
</template>
