<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const props = defineProps<{
  likes: number
  bookId: number
}>()

const emit = defineEmits<{
  'update:likes': [number]
}>()

const isHovered = ref(false)
const isLiked = ref(false)
const isAnimating = ref(false)
const isLoading = ref(false)

const handleClick = async () => {
  if (isLoading.value) return
  isLoading.value = true
  isAnimating.value = true
  isLiked.value = !isLiked.value

  try {
    const { error } = await supabase
      .from('recommandations')
      .update({ likes: props.likes + (isLiked.value ? 1 : -1) })
      .eq('id', props.bookId)

    if (error) throw error
    emit('update:likes', props.likes + (isLiked.value ? 1 : -1))
  } catch (error) {
    console.error('Erreur lors de la mise à jour des likes:', error)
    isLiked.value = !isLiked.value
  } finally {
    isLoading.value = false
    setTimeout(() => {
      isAnimating.value = false
    }, 600)
  }
}
</script>

<template>
  <div class="heart_container">
    <button
      class="heart_button"
      :class="{ 'heart_button_active': isLiked }"
      @click="handleClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :disabled="isLoading"
    >
      <svg
        class="heart_icon"
        :class="{
          'heart_icon_liked': isLiked,
          'heart_icon_hovered': isHovered && !isLiked,
          'heart_icon_animating': isAnimating,
        }"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.heart_container {
  display: inline-flex;
  align-items: center;
  padding: 4px;
  position: relative;
}

.heart_button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 24px;
  height: 24px;
  color: #e74c3c;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart_button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.heart_button_active {
  color: #e74c3c;
}

.heart_icon {
  width: 24px;
  height: 24px;
  color: #e74c3c;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  position: relative;
}

.heart_icon path {
  fill: transparent;
  transition: fill 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
}

.heart_icon_hovered path {
  fill: rgba(231, 76, 60, 0.3);
  animation: fillHeart 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.heart_icon_liked path {
  fill: #e74c3c;
  animation: fillHeart 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.heart_icon_animating {
  animation: heartBeat 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.heart_icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(231, 76, 60, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.heart_icon_animating::before {
  animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fillHeart {
  0% {
    fill: transparent;
    stroke-dashoffset: 100;
  }
  50% {
    fill: rgba(231, 76, 60, 0.3);
  }
  100% {
    fill: #e74c3c;
    stroke-dashoffset: 0;
  }
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.2);
  }
  50% {
    transform: scale(0.9);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 0.5;
  }
  100% {
    width: 40px;
    height: 40px;
    opacity: 0;
  }
}
</style>
