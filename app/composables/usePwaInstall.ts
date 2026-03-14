import { computed, onMounted, onUnmounted, ref } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePwaInstall() {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isInstalled = ref(false)
  const canInstall = computed(() => deferredPrompt.value !== null && !isInstalled.value)

  function checkInstalled() {
    if (
      window.matchMedia('(display-mode: standalone)').matches
      || ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
    ) {
      isInstalled.value = true
    }
  }

  function onBeforeInstallPrompt(e: Event) {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
  }

  function onAppInstalled() {
    isInstalled.value = true
    deferredPrompt.value = null
  }

  onMounted(() => {
    checkInstalled()
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.removeEventListener('appinstalled', onAppInstalled)
  })

  async function promptInstall(): Promise<boolean> {
    if (!deferredPrompt.value)
      return false
    await deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    deferredPrompt.value = null
    if (outcome === 'accepted') {
      isInstalled.value = true
      return true
    }
    return false
  }

  return { canInstall, isInstalled, promptInstall }
}
