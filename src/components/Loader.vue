<template>
  <div class="loader">
    <div class="loader_circles">
      <div class="loader_circle loader_circle--outer"></div>
      <div class="loader_circle loader_circle--middle"></div>
      <div class="loader_circle loader_circle--inner"></div>
    </div>
    <p class="loader_text">
      <span class="loader_word">Chargement</span>
      <span class="loader_dot">.</span>
      <span class="loader_dot">.</span>
      <span class="loader_dot">.</span>
    </p>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Loader'
})
</script>

<style scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  gap: 1rem;
}

.loader_circles {
  position: relative;
  width: 60px;
  height: 60px;
}

.loader_circle {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
}

.loader_circle--outer {
  width: 100%;
  height: 100%;
  border-top-color: #4682b4;
  border-right-color: #2e8b57;
  animation: spin 2s linear infinite;
}

.loader_circle--middle {
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
  border-left-color: #4682b4;
  border-bottom-color: #2e8b57;
  animation: spin 1.5s linear infinite reverse;
}

.loader_circle--inner {
  width: 40%;
  height: 40%;
  top: 30%;
  left: 30%;
  border-top-color: #2e8b57;
  border-right-color: #4682b4;
  animation: spin 1s linear infinite;
}

.loader_text {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
}

.loader_word {
  background: linear-gradient(135deg, #4682b4 0%, #2e8b57 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradientShift 3s ease infinite;
}

.loader_dot {
  opacity: 0;
  animation: dotFade 1.5s infinite;
  color: #4682b4;
}

.loader_dot:nth-child(1) {
  animation-delay: 0s;
}

.loader_dot:nth-child(2) {
  animation-delay: 0.5s;
}

.loader_dot:nth-child(3) {
  animation-delay: 1s;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dotFade {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
</style>
