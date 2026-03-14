<script setup lang="ts">
import { ArrowRight, LayoutList, Scale, Target } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'

const isOpen = ref(false)
const currentStep = ref(0)

const steps = [
  {
    icon: LayoutList,
    title: 'Create a List',
    description: 'Give your decision a name — like "Best Laptops" or "Vacation Spots".',
    iconClass: 'bg-primary/10 text-primary',
    dotClass: 'bg-primary',
  },
  {
    icon: Scale,
    title: 'Add Criteria',
    description: 'Define what matters most: cost, quality, design. Set weights to prioritize.',
    iconClass: 'bg-success/10 text-success',
    dotClass: 'bg-success',
  },
  {
    icon: Target,
    title: 'Score & Rank',
    description: 'Add your options, check which criteria they meet, and see the winner.',
    iconClass: 'bg-warning/10 text-warning',
    dotClass: 'bg-warning',
  },
]

const step = computed(() => steps[currentStep.value]!)

onMounted(() => {
  if (typeof localStorage !== 'undefined') {
    const seen = localStorage.getItem('ranked-welcome-seen')
    if (!seen) {
      isOpen.value = true
    }
  }
})

function next() {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
  else {
    dismiss()
  }
}

function dismiss() {
  isOpen.value = false
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ranked-welcome-seen', 'true')
  }
}
</script>

<template>
  <UiDialog :open="isOpen" @update:open="dismiss">
    <UiDialogContent class="sm:max-w-[380px] gap-0 p-0 overflow-hidden">
      <!-- Step Indicator -->
      <div class="flex gap-1.5 px-6 pt-6">
        <div
          v-for="(s, i) in steps" :key="i"
          class="h-1 flex-1 rounded-full transition-all duration-300"
          :class="i <= currentStep ? s.dotClass : 'bg-muted'"
        />
      </div>

      <!-- Step Content -->
      <Transition name="step" mode="out-in">
        <div :key="currentStep" class="px-6 pt-8 pb-6 text-center">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" :class="[step.iconClass]">
            <component :is="step.icon" :size="32" :stroke-width="1.5" />
          </div>

          <h2 class="text-xl font-display font-bold text-foreground mb-2">
            {{ step.title }}
          </h2>
          <p class="text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
            {{ step.description }}
          </p>
        </div>
      </Transition>

      <!-- Actions -->
      <div class="px-6 pb-6 space-y-2">
        <UiButton class="w-full" @click="next">
          {{ currentStep < steps.length - 1 ? 'Next' : 'Get Started' }}
          <ArrowRight v-if="currentStep < steps.length - 1" :size="18" class="ml-2" />
        </UiButton>
        <UiButton
          v-if="currentStep < steps.length - 1"
          variant="ghost"
          class="w-full text-muted-foreground"
          @click="dismiss"
        >
          Skip intro
        </UiButton>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>

<style scoped>
.step-enter-active {
  transition: opacity 0.2s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.step-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.step-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.step-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
