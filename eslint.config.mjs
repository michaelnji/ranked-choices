import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: 'dprint',
  ignores: [
    '.agents/**',
    '.agent/**',
    '.claude/**',
    '.crush/**',
    '.gemini/**',
    '.trae/**',
  ],
})
