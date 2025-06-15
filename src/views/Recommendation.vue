<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'

defineOptions({
  name: 'RecommendationView',
})

const router = useRouter()

const genres = ref<string[]>([])
const genresLoading = ref(true)
const genresError = ref('')

const formData = ref({
  title: '',
  author: '',
  genre: '',
  review: '',
  coverUrl: '',
})

const showModal = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  genresLoading.value = true
  genresError.value = ''
  const { data, error } = await supabase.from('gender').select('name')
  if (error) {
    genresError.value = 'Erreur lors du chargement des genres : ' + error.message
    genres.value = []
  } else {
    genres.value = ((data as { name: string }[]) || []).map((g) => g.name)
  }
  genresLoading.value = false
})

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMsg.value = ''
  const { error } = await supabase.from('recommandations').insert([
    {
      title: formData.value.title,
      author: formData.value.author,
      avis: formData.value.review,
      genre: formData.value.genre,
      cover_url: formData.value.coverUrl,
      published: false,
      likes: 0,
    },
  ])
  isSubmitting.value = false
  if (error) {
    errorMsg.value = "Erreur lors de l'envoi : " + error.message
  } else {
    showModal.value = true
  }
}

const closeModalAndRedirect = () => {
  showModal.value = false
  router.push('/')
}
</script>

<template>
  <div class="recommendation">
    <h1>Recommandations</h1>
    <div class="recommendation-content">
      <form @submit.prevent="handleSubmit" class="recommendation-form">
        <div class="form-group">
          <label for="title">Titre du livre</label>
          <input
            type="text"
            id="title"
            v-model="formData.title"
            required
            placeholder="Le titre du livre à recommander"
            :disabled="isSubmitting"
          />
        </div>

        <div class="form-group">
          <label for="author">Auteur</label>
          <input
            type="text"
            id="author"
            v-model="formData.author"
            required
            placeholder="Le nom de l'auteur ou autrice"
            :disabled="isSubmitting"
          />
        </div>

        <div class="form-group">
          <label for="genre">Genre</label>
          <select
            id="genre"
            v-model="formData.genre"
            required
            :disabled="isSubmitting || genresLoading"
          >
            <option value="" disabled>Sélectionnez un genre</option>
            <option v-if="genresLoading" disabled>Chargement...</option>
            <option v-else-if="genresError" disabled>{{ genresError }}</option>
            <option v-else v-for="genre in genres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="review">Avis / Pourquoi tu le recommandes ?</label>
          <textarea
            id="review"
            v-model="formData.review"
            required
            placeholder="Une petite critique ou avis"
            rows="5"
            :disabled="isSubmitting"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="coverUrl">Image du livre (URL)</label>
          <input
            type="url"
            id="coverUrl"
            v-model="formData.coverUrl"
            placeholder="Lien vers une image de couverture"
            :disabled="isSubmitting"
          />
        </div>
        <div class="content-button">
          <div class="button-container">
            <button type="submit" class="submit-button" :disabled="isSubmitting">
              {{ isSubmitting ? 'Envoi en cours...' : 'Recommander ce livre' }}
            </button>
          </div>
        </div>
        <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
      </form>
    </div>
    <dialog v-if="showModal" open class="confirmation-modal">
      <div>
        <h2>Merci pour ta recommandation !</h2>
        <p>Elle sera visible après validation.</p>
        <button @click="closeModalAndRedirect" class="submit-button">Retour à l'accueil</button>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.recommendation {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  box-sizing: border-box;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.recommendation-content {
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recommendation-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 0;
  padding: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #2c3e50;
}

input,
select,
textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4682b4;
  box-shadow: 0 0 0 2px rgba(70, 130, 180, 0.1);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.content-button {
  display: flex;
  justify-content: center;
}

.submit-button {
  background: linear-gradient(135deg, #4682b4 0%, #2e8b57 100%);
  color: white;
  padding: 1rem;
  border: none;
  width: fit-content;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-button:active {
  transform: translateY(0);
}

.error-message {
  color: #c0392b;
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
}

.confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  z-index: 1000;
}

.confirmation-modal > div {
  background: white;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.confirmation-modal h2 {
  margin-bottom: 1rem;
  color: #2e8b57;
}
</style>
