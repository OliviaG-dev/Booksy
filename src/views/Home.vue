<script setup lang="ts">

import { ref } from 'vue'


const title = ref('Bienvenue sur Booksy')
</script>

<template>
  <div class="home">
    <h1>{{ title }}</h1>
    <div class="content">
      <p>Bienvenue sur Booksy</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
