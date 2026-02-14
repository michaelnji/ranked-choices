import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import RankingView from './RankingView.vue'

// Mock sub-components to avoid rendering issues
vi.mock('~/components/ProgressBar.vue', () => ({
  default: {
    name: 'ProgressBar',
    props: ['value', 'max', 'colorClass'],
    template: '<div class="mock-progress-bar" :data-value="value">{{ value }}%</div>',
  },
}))

// Mock drag and drop
vi.mock('@formkit/drag-and-drop/vue', () => ({
  useDragAndDrop: (initialItems: any[]) => [ref(null), ref(initialItems)],
}))

// Mock NuxtLink
vi.mock('#app/components/nuxt-link', () => ({
  default: {
    name: 'NuxtLink',
    props: ['to'],
    template: '<a><slot /></a>',
  },
}))

describe('rankingView', () => {
  const criteria = [
    { id: 1, name: 'C1', weight: 5 }, // 50%
    { id: 2, name: 'C2', weight: 5 }, // 50%
  ]

  const items = [
    { id: 1, name: 'Item 1', scores: { 1: 10, 2: 10 } }, // Score: 100
    { id: 2, name: 'Item 2', scores: { 1: 5, 2: 5 } }, // Score: 50
  ]
  // Total Score: 150
  // Item 1 %: 100/150 = 66.67%
  // Item 2 %: 50/150 = 33.33%

  it('calculates relative percentage correctly', () => {
    const wrapper = mount(RankingView, {
      props: {
        items,
        criteria,
        mode: 'weighted',
        listId: 1,
      },
      global: {
        stubs: {
          NuxtLink: true,
          Trophy: true,
          Star: true,
          GripVertical: true,
        },
      },
    })

    // Wait for initial render
    const progressBars = wrapper.findAllComponents({ name: 'ProgressBar' })
    expect(progressBars.length).toBe(2)

    // Check values passed to ProgressBar
    // Item 1 (Sorted first)
    expect(progressBars[0].props('value')).toBeCloseTo(66.666, 2)

    // Item 2
    expect(progressBars[1].props('value')).toBeCloseTo(33.333, 2)
  })

  it('handles zero total score correctly', () => {
    const zeroItems = [
      { id: 1, name: 'Item 1', scores: { 1: 0, 2: 0 } },
    ]

    const wrapper = mount(RankingView, {
      props: {
        items: zeroItems,
        criteria,
        mode: 'weighted',
        listId: 1,
      },
      global: {
        stubs: {
          NuxtLink: true,
          Trophy: true,
          Star: true,
          GripVertical: true,
        },
      },
    })

    const progressBars = wrapper.findAllComponents({ name: 'ProgressBar' })
    expect(progressBars[0].props('value')).toBe(0)
  })

  it('displays percentage text correctly', () => {
    const wrapper = mount(RankingView, {
      props: {
        items,
        criteria,
        mode: 'weighted',
        listId: 1,
      },
      global: {
        stubs: {
          NuxtLink: true,
          Trophy: true,
          Star: true,
          GripVertical: true,
        },
      },
    })

    const text = wrapper.text()
    expect(text).toContain('66.7%')
    expect(text).toContain('33.3%')
  })
})
