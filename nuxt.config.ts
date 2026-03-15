import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  ssr: false,
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
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
    manifest: {
      name: 'Ranked Choices',
      short_name: 'Ranked',
      description: 'Make better decisions with weighted criteria ranking',
      theme_color: '#09090b',
      display: 'standalone',
      background_color: '#09090b',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      id: '/',
      lang: 'en',
      icons: [
        { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
      categories: ['productivity', 'utilities'],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          urlPattern: /^https:\/\/www\.michaelnji\.codes\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'external-images-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600, // Check for updates every hour
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
