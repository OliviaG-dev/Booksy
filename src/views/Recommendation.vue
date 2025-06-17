<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Loader from '@/components/Loader.vue'

defineOptions({
  name: 'RecommendationView',
})

const router = useRouter()

const genres = ref<{ id: number; name: string }[]>([])
const genresLoading = ref(true)
const genresError = ref('')

const formData = ref({
  title: '',
  author: '',
  gender: '',
  review: '',
  coverUrl: '',
})

const showModal = ref(false)
const isSubmitting = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  genresLoading.value = true
  genresError.value = ''
  const { data, error } = await supabase.from('gender').select('id, name')
  if (error) {
    genresError.value = 'Erreur lors du chargement des genres : ' + error.message
    genres.value = []
  } else {
    genres.value = (data as { id: number; name: string }[]) || []
  }
  genresLoading.value = false
})

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMsg.value = ''

  if (!formData.value.gender) {
    errorMsg.value = 'Le champ genre est obligatoire.'
    isSubmitting.value = false
    return
  }

  const genderId = Number(formData.value.gender)
  if (isNaN(genderId)) {
    errorMsg.value = 'Le genre sélectionné est invalide.'
    isSubmitting.value = false
    return
  }

  const { error } = await supabase.from('recommandations').insert([
    {
      title: formData.value.title,
      author: formData.value.author,
      avis: formData.value.review,
      gender_id: genderId,
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
    <h1>Recommande un livre : un <span class="gradient-text">titre</span>, un <span class="gradient-text">avis</span>, et c'est <span class="gradient-text">partagé</span> !</h1>
    <div class="recommendation_content">
      <form @submit.prevent="handleSubmit" class="recommendation_form">
        <div class="form_group">
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

        <div class="form_group">
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

        <div class="form_group">
          <label for="genre">Genre</label>
          <div class="select_container">
            <select
              id="genre"
              v-model="formData.gender"
              required
              :disabled="isSubmitting || genresLoading"
            >
              <option value="" disabled>Sélectionnez un genre</option>
              <template v-if="genresError">
                <option disabled>{{ genresError }}</option>
              </template>
              <template v-else>
                <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                  {{ genre.name }}
                </option>
              </template>
            </select>
            <Loader v-if="genresLoading" class="select_loader" />
          </div>
        </div>

        <div class="form_group">
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

        <div class="form_group">
          <label for="coverUrl">Image du livre (URL)</label>
          <input
            type="url"
            id="coverUrl"
            v-model="formData.coverUrl"
            placeholder="Lien vers une image de couverture"
            :disabled="isSubmitting"
          />
        </div>
        <div class="content_button">
          <div class="button_container">
            <button type="submit" class="submit_button" :disabled="isSubmitting">
              {{ isSubmitting ? 'Envoi en cours...' : 'Recommander ce livre' }}
            </button>
          </div>
        </div>
        <p v-if="errorMsg" class="error_message">{{ errorMsg }}</p>
      </form>
    </div>
    <dialog v-if="showModal" open class="confirmation_modal">
      <div>
        <h2>Merci pour ta recommandation !</h2>
        <button @click="closeModalAndRedirect" class="submit_button">Retour à l'accueil</button>
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
  font-size: 2.5rem;
  color: #2c3e50;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  font-family: 'Playfair Display', serif;
  font-weight: 500;
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.gradient-text {
  background: linear-gradient(135deg, #4682b4 0%, #2e8b57 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
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

.recommendation_content {
  padding: 2rem;
  margin: 1rem 8rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.recommendation_form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-radius: 0;
  padding: 0;
}

.form_group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
}

input,
select,
textarea {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #4682b4;
  box-shadow: 0 0 0 3px rgba(70, 130, 180, 0.1);
  background-color: white;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

.content_button {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.submit_button {
  background: linear-gradient(135deg, #4682b4 0%, #2e8b57 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  width: fit-content;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.submit_button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.submit_button:active {
  transform: translateY(0);
}

.error_message {
  color: #e74c3c;
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
  padding: 1rem;
  background-color: #fef2f2;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.confirmation_modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.confirmation_modal > div {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.confirmation_modal h2 {
  margin-bottom: 1.5rem;
  color: #2e8b57;
  font-family: 'Great Vibes', cursive;
  font-size: 2rem;
}

@media (max-width: 768px) {
  .recommendation {
    padding: 1rem;
  }

  .recommendation_content {
    margin: 1rem;
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  .form_group {
    gap: 0.5rem;
  }

  input,
  select,
  textarea {
    padding: 0.75rem;
  }
}

.select_container {
  position: relative;
  width: 100%;
}

.select_loader {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

select {
  width: 100%;
  appearance: none;
  background-color: #f8fafc;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234682b4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

select:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.7;
}

select option {
  padding: 0.75rem;
  background-color: white;
}
</style>
