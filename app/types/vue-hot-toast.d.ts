declare module 'vue-hot-toast' {
  import type { Component } from 'vue'

  interface ToastOptions {
    duration?: number
    position?: string
    [key: string]: unknown
  }

  interface ToastFunction {
    (message: string, options?: ToastOptions): string
    success: (message: string, options?: ToastOptions) => string
    error: (message: string, options?: ToastOptions) => string
    loading: (message: string, options?: ToastOptions) => string
    dismiss: (id?: string) => void
  }

  export const toast: ToastFunction
  export const Toaster: Component
}
