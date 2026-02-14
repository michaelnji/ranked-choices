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
    { id: 1, listId: 1, name: 'C1', weight: 5 }, // 50%
    { id: 2, listId: 1, name: 'C2', weight: 5 }, // 50%
  ]

  const items = [
    { id: 1, listId: 1, name: 'Item 1', manualRankIndex: 0, scores: { 1: 10, 2: 10 } }, // Score: 100
    { id: 2, listId: 1, name: 'Item 2', manualRankIndex: 1, scores: { 1: 5, 2: 5 } }, // Score: 50
  ]

  const nuxtLinkStub = {
    name: 'NuxtLink',
    template: '<a><slot /></a>',
    props: ['to'],
  }

  it('calculates relative percentage correctly', () => {
    const wrapper = mount(RankingView, {
      props: { items, criteria, mode: 'weighted', listId: 1 },
      global: {
        stubs: {
          NuxtLink: nuxtLinkStub,
          Trophy: true,
          Star: true,
          GripVertical: true,
        },
      },
    })

    const progressBars = wrapper.findAllComponents({ name: 'ProgressBar' })
    expect(progressBars.length).toBe(2)
    expect(progressBars[0]?.props('value')).toBeCloseTo(66.666, 2)
    expect(progressBars[1]?.props('value')).toBeCloseTo(33.333, 2)
  })

  it('handles zero total score correctly', () => {
    const zeroItems = [
      { id: 1, listId: 1, name: 'Item 1', manualRankIndex: 0, scores: { 1: 0, 2: 0 } },
    ]

    const wrapper = mount(RankingView, {
      props: { items: zeroItems, criteria, mode: 'weighted', listId: 1 },
      global: {
        stubs: {
          NuxtLink: nuxtLinkStub,
          Trophy: true,
          Star: true,
          GripVertical: true,
        },
      },
    })

    const progressBars = wrapper.findAllComponents({ name: 'ProgressBar' })
    expect(progressBars[0]?.props('value')).toBe(0)
  })

  it('displays percentage text correctly', () => {
    const wrapper = mount(RankingView, {
      props: { items, criteria, mode: 'weighted', listId: 1 },
      global: {
        stubs: {
          NuxtLink: nuxtLinkStub,
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

  it('renders navigation links correctly', () => {
    const wrapper = mount(RankingView, {
      props: { items, criteria, mode: 'weighted', listId: 1 },
      global: {
        stubs: {
          NuxtLink: nuxtLinkStub,
          Trophy: true,
          Star: true,
          GripVertical: true,
        },
      },
    })

    const links = wrapper.findAllComponents({ name: 'NuxtLink' })
    // 2 manual (hidden) + 2 weighted (visible) = 4
    expect(links.length).toBe(4)
    // Weighted items are the last 2
    expect(links[2]?.props('to')).toBe('/lists/1/items/1')
  })

  it('renders navigation links in manual mode', () => {
    const wrapper = mount(RankingView, {
      props: { items, criteria, mode: 'manual', listId: 1 },
      global: {
        stubs: {
          NuxtLink: nuxtLinkStub,
          Trophy: true,
          Star: true,
          GripVertical: true,
        },
      },
    })

    const links = wrapper.findAllComponents({ name: 'NuxtLink' })
    // 2 manual (visible) + 0 weighted (removed by v-if) = 2
    expect(links.length).toBe(2)
    // Manual items are the first 2
    expect(links[0]?.props('to')).toBe('/lists/1/items/1')
  })
})
