import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  components: [
    {
      path: '~/components',
      ignore: ['**/ui/**/index.ts'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  css: ['~/assets/css/app.css'],
  modules: [
    '@nuxt/fonts',
    '@vueuse/nuxt',
    '@formkit/auto-animate/nuxt',
    '@vite-pwa/nuxt',
  ],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Ranked Choices',
      short_name: 'Ranked',
      theme_color: '#09090b',
      display: 'standalone',
      background_color: '#09090b',
      lang: 'en',
      icons: [
        { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      type: 'module',
    },
  },
  fonts: {
    provider: 'local',
  },
})
