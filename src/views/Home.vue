<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import { ref, onMounted, computed, watch } from 'vue'
import HeartButton from '@/components/HeartButton.vue'

defineOptions({
  name: 'HomeView',
})

type Recommandation = {
  id: number
  title: string
  author: string
  avis: string
  cover_url: string
  likes: number
  published: boolean
  gender: {
    id: number
    name: string
  } | null
}

const recommandations = ref<Recommandation[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedGenre = ref<string | null>(null)
const sortOption = ref<'likes-desc' | 'likes-asc' | 'name-asc' | 'name-desc'>('likes-desc')
const currentPage = ref(1)
const itemsPerPage = 6

const genres = computed(() => {
  const all = recommandations.value
    .map((rec) => rec.gender && rec.gender.name)
    .filter((g): g is string => !!g)
  return Array.from(new Set(all))
})

const filteredRecommandations = computed(() => {
  let recs = selectedGenre.value
    ? recommandations.value.filter((rec) => rec.gender && rec.gender.name === selectedGenre.value)
    : recommandations.value

  // Tri
  switch (sortOption.value) {
    case 'likes-asc':
      recs = [...recs].sort((a, b) => a.likes - b.likes)
      break
    case 'likes-desc':
      recs = [...recs].sort((a, b) => b.likes - a.likes)
      break
    case 'name-asc':
      recs = [...recs].sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'name-desc':
      recs = [...recs].sort((a, b) => b.title.localeCompare(a.title))
      break
  }
  return recs
})

const totalPages = computed(() => Math.ceil(filteredRecommandations.value.length / itemsPerPage))
const paginatedRecommandations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRecommandations.value.slice(start, start + itemsPerPage)
})
watch(filteredRecommandations, () => {
  currentPage.value = 1
})

const fetchRecommandations = async () => {
  try {
    const { data, error: fetchError } = await supabase
      .from('recommandations')
      .select(
        `
        id,
        title,
        author,
        avis,
        cover_url,
        likes,
        published,
        gender:gender!left (
          id,
          name
        )
      `,
      )
      .order('created_at', { ascending: false })

    if (fetchError) {
      error.value = fetchError.message
    } else {
      recommandations.value = data as unknown as Recommandation[]
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Une erreur inattendue est survenue'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecommandations()
})

const updateLikes = (bookId: number, newLikes: number) => {
  const book = recommandations.value.find((rec) => rec.id === bookId)
  if (book) {
    book.likes = newLikes
  }
}
</script>

<template>
  <div class="home-view">
    <h1>Bienvenue sur <span class="title-h1">Booksy</span></h1>
    <div class="home-content">
      <div class="container-title">
        <h2 class="title-h2">Un bon livre, ça se partage.</h2>
        <span class="title-span">Explore les coups de cœur des autres — et ajoute le tien !</span>
      </div>
      <p class="title-text">
        Ici, on partage les livres qui nous ont fait vibrer, réfléchir, pleurer ou rêver. Pas
        d'algorithme, pas de pub, juste des recommandations authentiques d'êtres humains qui aiment
        lire.
      </p>
      <div class="home-text-icone">
        <img src="@/assets/icons/joyaux.svg" alt="home-icone" class="home-icone" />
        <p class="home-text">Tu as un coup de cœur littéraire ? Propose-le !</p>
      </div>
      <div class="home-text-icone">
        <img src="@/assets/icons/loupe.svg" alt="home-icone" class="home-icone" />
        <p class="home-text">En quête d'inspiration ? Explore les lectures des autres.</p>
      </div>

      <!-- Filtre par genre -->
      <div class="genre-filter">
        <button :class="{ active: selectedGenre === null }" @click="selectedGenre = null">
          Tous
        </button>
        <button
          v-for="genre in genres"
          :key="genre"
          :class="{ active: selectedGenre === genre }"
          @click="selectedGenre = genre"
        >
          {{ genre }}
        </button>
      </div>
      <!-- Filtre de tri -->
      <div class="sort-filter">
        <label for="sort-select">Trier par :</label>
        <select id="sort-select" v-model="sortOption">
          <option value="likes-desc">Likes décroissants</option>
          <option value="likes-asc">Likes croissants</option>
          <option value="name-asc">Nom (A → Z)</option>
          <option value="name-desc">Nom (Z → A)</option>
        </select>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="text-center">
        <p class="text-lg">Chargement des recommandations...</p>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="text-center">
        <p class="text-lg">Erreur : {{ error }}</p>
      </div>

      <!-- Aucune donnée -->
      <div v-else-if="!filteredRecommandations.length" class="text-center">
        <p class="text-lg">Aucune recommandation disponible</p>
      </div>

      <!-- Liste des recommandations -->
      <div v-else class="home-books">
        <div v-for="rec in paginatedRecommandations" :key="rec.id" class="book-container">
          <div class="book-header">
            <div class="book-gender-container">
              <p class="book-gender">
                {{ rec.gender && rec.gender.name ? rec.gender.name : 'Inconnu' }}
              </p>
            </div>
            <div class="likes-container">
              <HeartButton
                :likes="rec.likes"
                :book-id="rec.id"
                @update:likes="(newLikes) => updateLikes(rec.id, newLikes)"
              />
              <span class="book-likes">{{ rec.likes }}</span>
            </div>
          </div>
          <img :src="rec.cover_url" :alt="rec.title" class="book-image" />
          <h2 class="book-title">{{ rec.title }}</h2>
          <p class="book-author">par {{ rec.author }}</p>
          <p class="book-avis">"{{ rec.avis }}"</p>
        </div>
      </div>
      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="currentPage === 1" @click="currentPage--">Précédent</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">Suivant</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

h1 {
  color: #2c3e50;
  margin-top: 1rem;
  font-size: 2.5rem;
  text-align: center;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.home-content {
  padding: 1rem;
}

.home-text-icone {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.home-icone {
  width: 2rem;
  height: 2rem;
}

.container-title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-h1 {
  background: linear-gradient(135deg, #4682b4 0%, #2e8b57 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 700;
}

.title-h2 {
  font-size: 2rem;
  color: #1a1a1a;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  font-family: 'Great Vibes', cursive;
  font-weight: 400;
}

.title-span {
  font-size: 1.2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
  font-weight: 300;
  font-style: italic;
}

.home-books {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 1rem;
  margin-top: 1rem;
}

.book-header {
  width: 100%;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.book-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.book-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 1);
}

.book-image {
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.book-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.book-author {
  color: #666;
  font-size: 1rem;
  margin: 0.25rem 0;
}

.book-gender-container {
  display: inline-block;
  padding: 0.25em 0.8em;
  background: #e6f4ea;
  color: #217a4a;
  border-radius: 16px;
  font-size: 0.95em;
  font-weight: 600;
  margin: 0.2em 0.3em 0.2em 0;
  letter-spacing: 0.03em;
  box-shadow: 0 1px 3px rgba(46, 139, 87, 0.07);
  transition: background 0.2s;
  align-items: center;
  min-width: 60px;
  justify-content: center;
}

.book-gender {
  color: inherit;
  font-size: inherit;
  margin: 0;
  font-weight: inherit;
  text-align: center;
}

.book-avis {
  font-style: italic;
  color: #555;
  margin: 1rem 0;
  line-height: 1.5;
  font-size: 0.95rem;
}

.likes-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.book-likes {
  color: #e74c3c;
  font-weight: 600;
}

.text-center {
  text-align: center;
  color: #dc2626;
  font-size: 2rem;
}

.genre-filter {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0 0.5rem 0;
  flex-wrap: wrap;
  justify-content: center;
}
.genre-filter button {
  background: #e6f4ea;
  color: #217a4a;
  border: none;
  border-radius: 16px;
  padding: 0.3em 1em;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.genre-filter button.active,
.genre-filter button:hover {
  background: #217a4a;
  color: #fff;
}

.sort-filter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0 0 0;
  justify-content: end;
}
.sort-filter label {
  font-weight: 600;
  color: #217a4a;
}
.sort-filter select {
  border-radius: 8px;
  border: 1px solid #e6f4ea;
  padding: 0.3em 1em;
  font-size: 1em;
  color: #217a4a;
  background: #e6f4ea;
  font-weight: 600;
  cursor: pointer;
  transition: border 0.2s;
}
.sort-filter select:focus {
  outline: none;
  border: 1.5px solid #217a4a;
}

@media (max-width: 768px) {
  .title-span,
  .title-text {
    margin: 1rem 0;
  }

  .home-text-icone {
    margin: 0.5rem 0;
  }
  .genre-filter {
    margin: 2rem 0;
  }
  .sort-filter {
    justify-content: center;
    margin-bottom: 1rem;
  }
  .home-books {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  .home-view {
    padding: 0;
  }

  .book-image {
    width: 160px;
    height: 240px;
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0 1rem 0;
}
.pagination button {
  background: #e6f4ea;
  color: #217a4a;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1.2em;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.pagination button:disabled {
  background: #f0f0f0;
  color: #aaa;
  cursor: not-allowed;
}
.pagination span {
  font-weight: 600;
  color: #217a4a;
}
</style>
