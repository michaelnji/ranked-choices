<script setup lang="ts">
import { ArrowRight, Scale, Target, UserRound } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { db } from '~/utils/db'

const isOpen = ref(false)
const currentStep = ref(0)
const direction = ref(1)
const username = ref('')
const saving = ref(false)

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
    description: 'Set a username so we can personalise your experience.',
    bgClass: 'bg-muted/60',
    iconClass: 'text-muted-foreground',
    dotClass: 'bg-foreground',
  },
]

const step = computed(() => infoSteps[currentStep.value]!)
const isLastStep = computed(() => currentStep.value === infoSteps.length - 1)
const isUsernameStep = computed(() => currentStep.value === infoSteps.length - 1)
const transitionName = computed(() => direction.value > 0 ? 'slide-fwd' : 'slide-bk')

onMounted(async () => {
  try {
    const count = await db.profile.count()
    if (count === 0) {
      isOpen.value = true
    }
  }
  catch {
    // DB not ready yet — show onboarding to be safe
    isOpen.value = true
  }
})

function goToStep(i: number) {
  direction.value = i > currentStep.value ? 1 : -1
  currentStep.value = i
}

function next() {
  if (!isLastStep.value) {
    direction.value = 1
    currentStep.value++
  }
}

// Skip info screens → go straight to username step
function skip() {
  direction.value = 1
  currentStep.value = infoSteps.length - 1
}

async function complete() {
  if (saving.value)
    return
  saving.value = true
  try {
    await db.profile.add({
      username: username.value.trim() || 'User',
      createdAt: new Date(),
    })
  }
  catch {
    // If save fails, still close so the user isn't stuck
  }
  finally {
    saving.value = false
    isOpen.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="onboard">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9998] bg-background flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to Ranked Choices"
      >
        <!-- Top bar: Skip (info steps only) -->
        <div class="flex justify-end items-center px-5 pt-5 shrink-0 h-14">
          <button
            v-if="!isUsernameStep"
            class="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 -mr-3"
            @click="skip"
          >
            Skip
          </button>
        </div>

        <!-- Slide content -->
        <Transition :name="transitionName" mode="out-in">
          <div
            :key="currentStep"
            class="flex-1 flex flex-col items-center justify-center px-8 pb-4"
          >
            <!-- Visual hero -->
            <div
              class="w-44 h-44 rounded-[2.5rem] flex items-center justify-center mb-12 transition-colors duration-500"
              :class="step.bgClass"
            >
              <!-- Step 0: brand logo mark -->
              <template v-if="currentStep === 0">
                <svg width="88" height="88" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="0" y="0" width="32" height="7" rx="3.5" fill="#3b82f6" />
                  <rect x="0" y="11" width="23" height="7" rx="3.5" fill="#10b981" />
                  <rect x="0" y="22" width="14" height="7" rx="3.5" fill="#d97706" />
                </svg>
              </template>
              <component
                :is="step.icon"
                v-else
                :size="68"
                :stroke-width="1.25"
                :class="step.iconClass"
              />
            </div>

            <!-- Copy -->
            <h2 class="text-[2rem] text-display font-bold text-foreground text-center mb-3 leading-tight px-2">
              {{ step.title }}
            </h2>
            <p class="text-base text-muted-foreground text-center leading-relaxed max-w-[300px]">
              {{ step.description }}
            </p>

            <!-- Username input — only on last step -->
            <div v-if="isUsernameStep" class="w-full max-w-[300px] mt-6">
              <UiInput
                v-model="username"
                placeholder="Enter your name…"
                class="text-center text-base h-12"
                maxlength="32"
                autofocus
                @keydown.enter="complete"
              />
            </div>
          </div>
        </Transition>

        <!-- Bottom controls -->
        <div class="shrink-0 px-6 pb-10 space-y-5">
          <!-- Step dots -->
          <div class="flex justify-center gap-2">
            <button
              v-for="(s, i) in infoSteps"
              :key="i"
              class="rounded-full transition-all duration-300"
              :class="[
                i === currentStep
                  ? `w-6 h-2 ${s.dotClass}`
                  : i < currentStep
                    ? `w-2 h-2 ${s.dotClass} opacity-50`
                    : 'w-2 h-2 bg-muted',
              ]"
              :aria-label="`Go to step ${i + 1}`"
              @click="goToStep(i)"
            />
          </div>

          <UiButton
            class="w-full h-12 text-base"
            :disabled="saving"
            @click="isLastStep ? complete() : next()"
          >
            {{ isLastStep ? 'Get Started' : 'Continue' }}
            <ArrowRight v-if="!isLastStep" :size="18" class="ml-2" />
          </UiButton>
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
</style>
