<template>
  <header class="header">
    <div class="header-container">
      <img src="/logo.jpg" alt="Booksy" class="header-logo" />
      <h1 class="header-title">Booksy</h1>
      <button
        class="burger"
        @click="isNavOpen = !isNavOpen"
        aria-label="Ouvrir le menu"
        :aria-expanded="isNavOpen"
      >
        <span :class="{ open: isNavOpen }"></span>
        <span :class="{ open: isNavOpen }"></span>
        <span :class="{ open: isNavOpen }"></span>
      </button>
    </div>
    <nav class="nav" :class="{ 'nav-open': isNavOpen }">
      <router-link to="/" class="nav-link" @click="closeNav">Accueil</router-link>
      <router-link to="/recommendation" class="nav-link" @click="closeNav"
        >Recommandations</router-link
      >
    </nav>
    <div v-if="isNavOpen" class="nav-overlay" @click="closeNav"></div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'AppHeader',
})

const isNavOpen = ref(false)
const closeNav = () => {
  isNavOpen.value = false
}
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
  position: relative;
  z-index: 10;
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

.burger {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 1rem;
  z-index: 30;
}
.burger span {
  display: block;
  width: 28px;
  height: 4px;
  margin: 4px 0;
  background: #4682b4;
  border-radius: 2px;
  transition: 0.3s;
}
.burger span.open:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}
.burger span.open:nth-child(2) {
  opacity: 0;
}
.burger span.open:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

.nav {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
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

.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.15);
  z-index: 20;
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    align-items: stretch;
    padding: 0.5rem 0.5rem;
    gap: 0.5rem;
  }
  .header-container {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }
  .header-logo {
    width: 36px;
    height: 36px;
  }
  .header-title {
    font-size: 1.3rem;
    margin-left: 0.5rem;
    margin-top: 0;
    text-align: left;
  }
  .burger {
    position: relative;
    width: 40px;
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 30;
  }
  .burger span {
    position: absolute;
    left: 6px;
    width: 28px;
    height: 4px;
    background: #4682b4;
    border-radius: 2px;
    transition: 0.3s;
  }
  .burger span:nth-child(1) {
    top: 12px;
  }
  .burger span:nth-child(2) {
    top: 18px;
  }
  .burger span:nth-child(3) {
    top: 24px;
  }
  .burger span.open:nth-child(1) {
    transform: translateY(6px) rotate(45deg);
  }
  .burger span.open:nth-child(2) {
    opacity: 0;
  }
  .burger span.open:nth-child(3) {
    transform: translateY(-6px) rotate(-45deg);
  }
  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    flex-direction: column;
    background: white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    gap: 0;
    align-items: stretch;
    padding: 0.5rem 0;
    z-index: 25;
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
  }
  .nav.nav-open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }
  .nav-link {
    width: 100%;
    text-align: center;
    padding: 1rem 0;
    font-size: 1.1rem;
    border-radius: 0;
    border-bottom: 1px solid #e4e8f0;
  }
  .nav-link:last-child {
    border-bottom: none;
  }
}
</style>
