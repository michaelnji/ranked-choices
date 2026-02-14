declare module 'vue-hot-toast' {
  import type { Plugin } from 'vue'

  export const Toaster: any
  export const toast: {
    success: (message: string, options?: any) => void
    error: (message: string, options?: any) => void
    loading: (message: string, options?: any) => void
    dismiss: (id?: string) => void
    (message: string, options?: any): void
  }

  const plugin: Plugin
  export default plugin
}
