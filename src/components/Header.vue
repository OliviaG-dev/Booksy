<template>
  <header class="header">
    <div class="header-container">
      <img src="/logo.jpg" alt="Booksy" class="header-logo" />
      <h1 class="header-title">Booksy</h1>
    </div>
    <nav class="nav">
      <router-link to="/" class="nav-link">Accueil</router-link>
      <router-link to="/recommendation" class="nav-link">Recommandations</router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppHeader',
})
</script>

<style scoped>
.header {
  width: 100%;
  padding: 1rem 3rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.header-title {
  font-size: 2rem;
  font-weight: 800;
  margin-left: 1rem;
  font-family: 'Great Vibes', cursive;
  background: linear-gradient(135deg, #4682b4 0%, #2e8b57 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

.nav {
  display: flex;
  gap: 2rem;
  justify-content: center;
  padding: 0.5rem 1rem;
}

.nav-link {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: #4682b4;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: #4682b4;
}

.nav-link:hover::after {
  width: 30%;
}

.nav-link.router-link-active {
  font-weight: 600;
  color: #2e8b57;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  height: 2px;
  background: #2e8b57;
  border-radius: 2px;
}
</style>
