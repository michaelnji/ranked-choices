<script setup lang="ts">
// Basic layout
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content font-sans">
    <header class="navbar bg-base-100 border-b border-base-200">
      <div class="flex-1">
        <NuxtLink to="/" class="btn btn-ghost text-xl">
          Ranked Choices
        </NuxtLink>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal px-1">
          <li>
            <NuxtLink to="/">
              Dashboard
            </NuxtLink>
          </li>
        </ul>
      </div>
    </header>
    <main class="container mx-auto p-4">
      <slot />
    </main>
  </div>
</template>
