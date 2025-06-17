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
    <h1>Recommande un livre qui t'a marqué : un titre, un avis, et c'est partagé !</h1>
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
  font-size: 2rem;
  color: #1a1a1a;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  font-family: 'Great Vibes', cursive;
  font-weight: 400;
  margin-bottom: 2rem;
}

.recommendation_content {
  padding: 1rem;
  margin: 1rem 8rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.content_button {
  display: flex;
  justify-content: center;
}

.submit_button {
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

.submit_button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit_button:active {
  transform: translateY(0);
}

.error_message {
  color: #c0392b;
  font-weight: 500;
  margin-top: 1rem;
  text-align: center;
}

.confirmation_modal {
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

.confirmation_modal > div {
  background: white;
  border-radius: 16px;
  padding: 2rem 2.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  text-align: center;
}

.confirmation_modal h2 {
  margin-bottom: 1rem;
  color: #2e8b57;
}

@media (max-width: 600px) {
  .recommendation {
    padding: 1rem;
  }
  .h1 {
    margin-bottom: 1rem;
  }
  .recommendation_content {
    margin: 1rem 0;
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
  background-color: white;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

select:disabled {
  background-color: #f8fafc;
  cursor: not-allowed;
  opacity: 0.7;
}

select option {
  padding: 0.5rem;
}
</style>
