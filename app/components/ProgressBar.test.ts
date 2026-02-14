import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProgressBar from './ProgressBar.vue'

describe('progressBar', () => {
  it('renders correctly with 0% progress', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        value: 0,
        max: 100,
      },
    })
    expect(wrapper.find('[role="progressbar"]').exists()).toBe(true)
    expect(wrapper.attributes('aria-valuenow')).toBe('0')
    // Check width style - Note: computed style might not be easily testable in jsdom without getComputedStyle parsing
    // But we can check the inline style binding if possible, or the class
    const fill = wrapper.find('.bg-gradient-to-r')
    expect(fill.exists()).toBe(true)
    expect(fill.attributes('style')).toContain('width: 0%')
  })

  it('renders correctly with 50% progress', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        value: 50,
        max: 100,
      },
    })
    const fill = wrapper.find('.bg-gradient-to-r')
    expect(fill.attributes('style')).toContain('width: 50%')
  })

  it('renders correctly with 100% progress', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        value: 100,
        max: 100,
      },
    })
    const fill = wrapper.find('.bg-gradient-to-r')
    expect(fill.attributes('style')).toContain('width: 100%')
    // Check for pulse effect which is only present at >= 100%
    expect(wrapper.find('.animate-pulse').exists()).toBe(true)
  })

  it('clamps values between 0 and 100', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        value: 150,
        max: 100,
      },
    })
    const fill = wrapper.find('.bg-gradient-to-r')
    expect(fill.attributes('style')).toContain('width: 100%')

    const wrapperLow = mount(ProgressBar, {
      props: {
        value: -20,
        max: 100,
      },
    })
    const fillLow = wrapperLow.find('.bg-gradient-to-r')
    expect(fillLow.attributes('style')).toContain('width: 0%')
  })

  it('displays label when showLabel is true', () => {
    const wrapper = mount(ProgressBar, {
      props: {
        value: 75,
        max: 100,
        showLabel: true,
        label: 'Test Progress',
      },
    })
    expect(wrapper.text()).toContain('Test Progress')
    expect(wrapper.text()).toContain('75%')
  })
})
