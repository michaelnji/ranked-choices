<script setup lang="ts">
import { vConfetti } from '@neoconfetti/vue'
import { ArrowRight, Scale, Smartphone, Target, UserRound } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { db } from '~/utils/db'

const isOpen = ref(false)
const currentStep = ref(0)
const direction = ref(1)
const username = ref('')
const savedUsername = ref('')
const saving = ref(false)

const USERNAME_STEP = 3
const WELCOME_STEP = 4
const INSTALL_STEP = 5

const { canInstall, promptInstall } = usePwaInstall()

const infoSteps = [
  {
    icon: null,
    title: 'Make Better Decisions',
    description: 'Create ranked lists for any choice — laptops, vacation spots, job offers. Let the data guide you.',
    bgClass: 'bg-primary/10',
    dotClass: 'bg-primary',
    iconClass: '',
  },
  {
    icon: Scale,
    title: 'Define What Matters',
    description: 'Set criteria like cost, quality, and design. Assign weights to prioritize what you actually care about.',
    bgClass: 'bg-success/10',
    iconClass: 'text-success',
    dotClass: 'bg-success',
  },
  {
    icon: Target,
    title: 'See the Winner',
    description: 'Score your options against each criterion. The weighted ranking reveals the clear winner.',
    bgClass: 'bg-warning/10',
    iconClass: 'text-warning',
    dotClass: 'bg-warning',
  },
  {
    icon: UserRound,
    title: 'What should we call you?',
    description: '',
    bgClass: 'bg-muted/60',
    iconClass: 'text-muted-foreground',
    dotClass: 'bg-foreground',
  },
  {
    icon: null,
    title: '',
    description: 'You\'re all set to start making smarter decisions.',
    bgClass: 'bg-primary/10',
    iconClass: '',
    dotClass: 'bg-primary',
  },
  {
    icon: Smartphone,
    title: 'One tap away',
    description: 'Add Ranked Choices to your home screen. Works offline, loads instantly — no app store needed.',
    bgClass: 'bg-primary/10',
    iconClass: 'text-primary',
    dotClass: 'bg-primary',
  },
]

const step = computed(() => infoSteps[currentStep.value]!)
const isUsernameStep = computed(() => currentStep.value === USERNAME_STEP)
const isWelcomeStep = computed(() => currentStep.value === WELCOME_STEP)
const isInstallStep = computed(() => currentStep.value === INSTALL_STEP)
const isLastStep = computed(() => currentStep.value === INSTALL_STEP)
const transitionName = computed(() => direction.value > 0 ? 'slide-fwd' : 'slide-bk')

const confettiOptions = {
  particleCount: 180,
  force: 0.55,
  duration: 5000,
  colors: ['#3b82f6', '#10b981', '#d97706', '#f59e0b', '#bfdbfe', '#ffffff'],
  particleShape: 'mix' as const,
  stageWidth: 520,
  stageHeight: 960,
}

onMounted(async () => {
  try {
    const count = await db.profile.count()
    if (count === 0) {
      isOpen.value = true
    }
  }
  catch {
    isOpen.value = true
  }
})

function goToStep(i: number) {
  if (i === WELCOME_STEP || i === INSTALL_STEP)
    return // these steps only reachable via saveAndContinue / next
  direction.value = i > currentStep.value ? 1 : -1
  currentStep.value = i
}

function next() {
  if (!isUsernameStep.value && !isLastStep.value) {
    direction.value = 1
    currentStep.value++
  }
}

function skip() {
  direction.value = 1
  currentStep.value = USERNAME_STEP
}

async function saveAndContinue() {
  if (saving.value)
    return
  saving.value = true
  try {
    const name = username.value.trim() || 'User'
    if (!savedUsername.value) {
      await db.profile.add({ username: name, createdAt: new Date() })
    }
    savedUsername.value = name
    direction.value = 1
    currentStep.value = WELCOME_STEP
  }
  catch {
    savedUsername.value = username.value.trim() || 'User'
    direction.value = 1
    currentStep.value = WELCOME_STEP
  }
  finally {
    saving.value = false
  }
}

function finish() {
  isOpen.value = false
}

async function installAndFinish() {
  await promptInstall()
  finish()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="onboard">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9998] bg-zinc-950/70 backdrop-blur-2xl flex flex-col supports-[backdrop-filter]:bg-background/80"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Ranked Choices"
      >
        <!-- Confetti — fires from top-center on welcome step -->
        <div
          v-if="isWelcomeStep"
          v-confetti="confettiOptions"
          class="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-50"
          aria-hidden="true"
        />

        <!-- Top bar: Skip (info steps only) -->
        <div class="flex justify-end items-center px-6 pt-12 shrink-0 h-20">
          <button
            v-if="!isUsernameStep && !isWelcomeStep"
            class="text-[17px] font-medium text-muted-foreground hover:text-foreground active-scale-down-sm transition-colors py-2 px-4 rounded-full bg-zinc-800/50 backdrop-blur-md border border-white/5"
            @click="skip"
          >
            Skip
          </button>
        </div>

        <!-- Slide content -->
        <Transition :name="transitionName" mode="out-in">
          <div
            :key="currentStep"
            class="flex-1 flex flex-col items-center justify-center px-8 pb-10 mt-[-5vh]"
          >
            <!-- Welcome step -->
            <template v-if="isWelcomeStep">
              <div class="emoji-pop text-[120px] mb-8 select-none filter drop-shadow-2xl" aria-hidden="true">
                🎊
              </div>
              <h2 class="text-[36px] font-bold text-foreground text-center mb-4 leading-tight tracking-tight px-2">
                Hey, {{ savedUsername }}!
              </h2>
              <p class="text-[17px] text-muted-foreground text-center leading-relaxed max-w-[320px] font-medium">
                {{ step.description }}
              </p>
            </template>

            <!-- Install step -->
            <template v-else-if="isInstallStep">
              <div
                class="w-40 h-40 rounded-[40px] flex items-center justify-center mb-10 bg-primary/20 shadow-2xl shadow-primary/20 border border-primary/20 ring-1 ring-primary/10 relative overflow-hidden group"
              >
                <div class="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent" />
                <Smartphone :size="64" class="text-primary relative z-10 drop-shadow-md" />
              </div>
              <h2 class="text-[36px] font-bold text-foreground text-center mb-4 leading-tight tracking-tight px-2">
                {{ canInstall ? 'One tap away' : 'You\'re all set!' }}
              </h2>
              <p class="text-[17px] text-muted-foreground text-center leading-relaxed max-w-[320px] font-medium">
                {{ canInstall
                  ? 'Add Ranked Choices to your home screen. Works offline, loads instantly — no app store needed.'
                  : 'Ranked Choices is ready to use. Make your first decision.' }}
              </p>
            </template>

            <!-- Info + username steps -->
            <template v-else>
              <!-- Visual hero -->
              <div
                class="w-40 h-40 rounded-[40px] flex items-center justify-center mb-10 transition-colors duration-500 shadow-2xl border relative overflow-hidden"
                :class="[
                  step.bgClass,
                  currentStep === 0 ? 'border-primary/20 shadow-primary/20'
                  : currentStep === 1 ? 'border-success/20 shadow-success/20'
                    : currentStep === 2 ? 'border-warning/20 shadow-warning/20'
                      : 'border-white/5 shadow-white/5 bg-zinc-800',
                ]"
              >
                <!-- Subtle gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent mix-blend-overlay" />

                <template v-if="currentStep === 0">
                  <svg
                    width="80" height="80" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                    class="relative z-10 drop-shadow-md"
                  >
                    <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
                    <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
                    <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
                  </svg>
                </template>
                <component
                  :is="step.icon"
                  v-else
                  :size="64" class="relative z-10 drop-shadow-md"
                  :class="step.iconClass"
                />
              </div>

              <h2 class="text-[32px] font-bold text-foreground text-center mb-4 leading-tight tracking-tight px-2">
                {{ step.title }}
              </h2>
              <p class="text-[17px] text-muted-foreground text-center leading-relaxed max-w-[320px] font-medium">
                {{ step.description }}
              </p>

              <!-- Username input -->
              <div v-if="isUsernameStep" class="w-full max-w-[320px] mt-8">
                <div class="ios-list p-1 shadow-lg border border-white/5">
                  <input
                    v-model="username" placeholder="Enter your name…"
                    class="w-full h-[56px] text-center text-[19px] font-medium bg-transparent border-0 focus:ring-0 outline-none text-foreground placeholder:text-zinc-600 rounded-xl"
                    maxlength="32" autofocus @keydown.enter="saveAndContinue"
                  >
                </div>
              </div>
            </template>
          </div>
        </Transition>

        <!-- Bottom controls -->
        <div
          class="shrink-0 px-6 pb-12 pt-6 space-y-8 bg-gradient-to-t from-background via-background/95 to-transparent relative z-20"
        >
          <!-- Step dots -->
          <div class="flex justify-center gap-2.5">
            <button
              v-for="(s, i) in infoSteps"
              :key="i"
              class="rounded-full transition-all duration-300"
              :class="[
                i === currentStep
                  ? `w-8 h-2.5 ${s.dotClass} shadow-md`
                  : i < currentStep
                    ? `w-2.5 h-2.5 ${s.dotClass} opacity-60`
                    : 'w-2.5 h-2.5 bg-zinc-800 border border-white/5',
                i === WELCOME_STEP || i === INSTALL_STEP ? 'cursor-default' : 'cursor-pointer',
              ]"
              :aria-label="i < WELCOME_STEP ? `Go to step ${i + 1}` : undefined"
              :disabled="i === WELCOME_STEP || i === INSTALL_STEP"
              @click="goToStep(i)"
            />
          </div>

          <div class="space-y-4 max-w-sm mx-auto w-full">
            <button
              class="w-full h-[56px] rounded-[18px] bg-primary text-primary-foreground text-[19px] font-semibold active-scale-down flex items-center justify-center gap-2 shadow-lg shadow-primary/25 disabled:opacity-50 transition-all duration-300"
              :disabled="saving || (isUsernameStep && !username.trim())"
              @click="isInstallStep ? (canInstall ? installAndFinish() : finish()) : isUsernameStep ? saveAndContinue() : next()"
            >
              <template v-if="isInstallStep">
                <Smartphone :size="22" stroke-width="2.5" />
                {{ canInstall ? 'Install App' : 'Get Started' }}
              </template>
              <template v-else-if="saving">
                Saving…
              </template>
              <template v-else>
                Continue
                <ArrowRight :size="22" stroke-width="2.5" />
              </template>
            </button>

            <!-- Maybe Later — install step only -->
            <div v-if="isInstallStep && canInstall" class="h-[40px] flex items-center justify-center">
              <button
                class="text-[17px] font-medium text-muted-foreground hover:text-foreground transition-colors active-scale-down-sm px-6 py-2 rounded-full"
                @click="finish"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.onboard-enter-active {
  transition: opacity 0.35s ease;
}
.onboard-leave-active {
  transition: opacity 0.25s ease;
}
.onboard-enter-from,
.onboard-leave-to {
  opacity: 0;
}

.slide-fwd-enter-active {
  transition: opacity 0.3s ease, transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fwd-leave-active {
  transition: opacity 0.2s ease, transform 0.22s ease;
}
.slide-fwd-enter-from {
  opacity: 0;
  transform: translateX(52px);
}
.slide-fwd-leave-to {
  opacity: 0;
  transform: translateX(-36px);
}

.slide-bk-enter-active {
  transition: opacity 0.3s ease, transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-bk-leave-active {
  transition: opacity 0.2s ease, transform 0.22s ease;
}
.slide-bk-enter-from {
  opacity: 0;
  transform: translateX(-52px);
}
.slide-bk-leave-to {
  opacity: 0;
  transform: translateX(36px);
}

/* Emoji pop-in — no bounce, smooth ease-out-expo */
@keyframes emoji-pop {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-12deg);
  }
  70% {
    transform: scale(1.18) rotate(4deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.emoji-pop {
  display: inline-block;
  animation: emoji-pop 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
