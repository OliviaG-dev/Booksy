<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page non trouvée</h2>
      <p>La page que vous recherchez n'existe pas.</p>
      <router-link to="/" class="home-link">Retour à l'accueil</router-link>
    </div>
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
  min-height: 100vh;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.not-found-content {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  font-size: 8rem;
  margin: 0;
  background: linear-gradient(135deg, #4682b4 0%, #2e8b57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

h2 {
  font-size: 2rem;
  margin: 1rem 0;
  color: #2c3e50;
  font-family: 'Great Vibes', cursive;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4682b4 0%, #2e8b57 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.home-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 600px) {
  .not-found {
    padding: 1rem;
  }

  h1 {
    font-size: 6rem;
  }

  .not-found-content {
    padding: 2rem;
  }
}
</style>
