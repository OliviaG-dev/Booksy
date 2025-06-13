<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page non trouvée</h2>
    <p>La page que vous recherchez n'existe pas.</p>
    <router-link to="/" class="home-link">Retour à l'accueil</router-link>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #e74c3c;
}

h2 {
  font-size: 2rem;
  margin: 1rem 0;
}

.home-link {
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.home-link:hover {
  background-color: #2980b9;
}
</style>
