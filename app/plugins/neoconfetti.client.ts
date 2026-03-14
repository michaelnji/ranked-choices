import { vConfetti } from '@neoconfetti/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('confetti', vConfetti)
})
