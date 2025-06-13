<script setup lang="ts">

import { ref } from 'vue'


const title = ref('Recommandations')
</script>

<template>
  <div class="recommendation">
    <h1>{{ title }}</h1>
    <div class="content">
      <p>Recommandations</p>
    </div>
  </div>
</template>

<style scoped>
.recommendation {
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
