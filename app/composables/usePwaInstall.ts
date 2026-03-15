import { computed, onMounted, onUnmounted, ref } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePwaInstall() {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isInstalled = ref(false)
  const isIOS = ref(false)
  const isStandalone = ref(false)

  // Can show automatic install prompt (Chrome/Edge)
  const canInstall = computed(() => deferredPrompt.value !== null && !isInstalled.value)

  // Can show manual install instructions (iOS Safari)
  const canShowIOSInstructions = computed(() =>
    isIOS.value && !isStandalone.value && !isInstalled.value,
  )

  // Show any install UI
  const canShowInstallUI = computed(() =>
    canInstall.value || canShowIOSInstructions.value,
  )

  function checkInstalled() {
    // Check if already running as installed PWA
    if (
      window.matchMedia('(display-mode: standalone)').matches
      || ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
    ) {
      isInstalled.value = true
      isStandalone.value = true
      return
    }

    // Detect iOS
    const ua = window.navigator.userAgent
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    isIOS.value = isIOSDevice

    // Log for debugging (helpful in production)
    if (import.meta.dev) {
      console.warn('[PWA] Install status:', {
        isInstalled: isInstalled.value,
        isIOS: isIOS.value,
        isStandalone: isStandalone.value,
        hasPrompt: !!deferredPrompt.value,
      })
    }
  }

  function onBeforeInstallPrompt(e: Event) {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt.value = e as BeforeInstallPromptEvent

    if (import.meta.dev) {
      console.warn('[PWA] beforeinstallprompt event fired')
    }
  }

  function onAppInstalled() {
    isInstalled.value = true
    isStandalone.value = true
    deferredPrompt.value = null

    if (import.meta.dev) {
      console.warn('[PWA] App installed')
    }
  }

  onMounted(() => {
    // Add small delay to ensure proper detection
    setTimeout(() => {
      checkInstalled()
    }, 100)

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)

    // Re-check on visibility change (helps catch state changes)
    document.addEventListener('visibilitychange', checkInstalled)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.removeEventListener('appinstalled', onAppInstalled)
    document.removeEventListener('visibilitychange', checkInstalled)
  })

  async function promptInstall(): Promise<boolean> {
    if (!deferredPrompt.value)
      return false

    try {
      // Show the install prompt
      await deferredPrompt.value.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.value.userChoice

      if (import.meta.dev) {
        console.warn('[PWA] User choice:', outcome)
      }

      // Clear the deferredPrompt
      deferredPrompt.value = null

      if (outcome === 'accepted') {
        isInstalled.value = true
        return true
      }

      return false
    }
    catch (error) {
      if (import.meta.dev) {
        console.error('[PWA] Install prompt error:', error)
      }
      return false
    }
  }

  return {
    canInstall,
    canShowIOSInstructions,
    canShowInstallUI,
    isInstalled,
    isIOS,
    isStandalone,
    promptInstall,
  }
}
