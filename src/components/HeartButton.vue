<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

const props = defineProps<{
  likes: number
  bookId: number
}>()

const emit = defineEmits<{
  (e: 'update:likes', value: number): void
}>()

const isHovered = ref(false)
const isLiked = ref(false)
const isAnimating = ref(false)

const handleClick = async () => {
  if (isAnimating.value) return

  isAnimating.value = true
  isLiked.value = !isLiked.value

  try {
    const newLikes = isLiked.value ? props.likes + 1 : props.likes - 1
    const { error } = await supabase
      .from('recommandations')
      .update({ likes: newLikes })
      .eq('id', props.bookId)

    if (error) throw error
    emit('update:likes', newLikes)
  } catch (error) {
    console.error('Erreur lors de la mise à jour des likes:', error)
    isLiked.value = !isLiked.value // Revert on error
  } finally {
    isAnimating.value = false
  }
}
</script>

<template>
  <div
    class="heart-container"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleClick"
  >
    <svg
      class="heart-icon"
      :class="{
        'is-liked': isLiked,
        'is-hovered': isHovered && !isLiked,
        'is-animating': isAnimating,
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
  </div>
</template>

<style scoped>
.heart-container {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  position: relative;
}

.heart-icon {
  width: 24px;
  height: 24px;
  color: #e74c3c;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  position: relative;
}

.heart-icon path {
  fill: transparent;
  transition: fill 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
}

.heart-icon.is-hovered path {
  fill: rgba(231, 76, 60, 0.3);
  animation: fillHeart 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.heart-icon.is-liked path {
  fill: #e74c3c;
  animation: fillHeart 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.heart-icon.is-animating {
  animation: heartBeat 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.heart-icon::before {
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

.heart-icon.is-animating::before {
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
