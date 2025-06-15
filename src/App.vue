<script setup lang="ts">
import AppHeader from './components/Header.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

main {
  margin-top: 2rem;
}

@media (max-width: 600px) {
  .app {
    padding: 0;
  }
}
</style>
