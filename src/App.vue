<script setup lang="ts">

</script>

<template>
  <div class="app">
    <header>
      <h1>Booksy</h1>
      <nav>
        <router-link to="/">Accueil</router-link> |
        <router-link to="/recommendation">Recommandations</router-link>
      </nav>
    </header>

    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  margin-bottom: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

nav {
  padding: 1rem 0;
}

nav a {
  color: #2c3e50;
  text-decoration: none;
  margin: 0 0.5rem;
}

nav a.router-link-active {
  color: #42b983;
  font-weight: bold;
}
</style>
