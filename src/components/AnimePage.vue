<template>
  <div class="anime-page">
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
    </div>
    
    <div v-else-if="anime" class="anime-content">
      <div class="anime-header">
        <div class="anime-poster">
          <img :src="getPosterUrl(anime.animeResult.poster.huge)" :alt="anime.animeResult.title" />
        </div>
        <div class="anime-info">
          <h1 class="anime-title">{{ anime.animeResult.title }}</h1>
          <div class="anime-meta">
            <span class="anime-type">{{ anime.animeResult.type.name }}</span>
            <span class="anime-year">{{ anime.animeResult.year }}</span>
            <span class="anime-status" :data-status="anime.animeResult.anime_status.title">
              {{ anime.animeResult.anime_status.title }}
            </span>
          </div>
          <p class="anime-description">{{ anime.animeResult.description }}</p>
          <div class="anime-actions">
            <button class="action-button" @click="toggleFavourite">
              <svg class="heart-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              {{ isFavourite ? 'Убрать из избранного' : 'Добавить в избранное' }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="anime-episodes">
        <h2>Эпизоды</h2>
        <div v-if="anime.players.length === 0" class="no-players">
          <p>Нет доступных плееров для этого аниме</p>
        </div>
        <div v-else class="players-container">
          <div v-for="(player, playerIndex) in anime.players" :key="playerIndex" class="player-section">
            <h3>{{ player.name }}</h3>
            <div v-for="(dubber, dubberIndex) in player.dubbers" :key="dubberIndex" class="dubber-section">
              <h4>{{ dubber.dubbing }}</h4>
              <div class="episodes-list">
                <button
                  v-for="(episode, episodeIndex) in dubber.episodes"
                  :key="episodeIndex"
                  class="episode-button"
                  @click="playEpisode(episode)"
                >
                  {{ episode.number }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { YummyAnimeExtractor, Anime } from '@/api/source/Yumme_anime_ru'
import { useAppStore } from '@/stores/app'
import { useSaveManagerStore } from '@/stores/saveManager'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  url: string
}

const props = defineProps<Props>()
const appStore = useAppStore()
const saveManagerStore = useSaveManagerStore()
const { playAnime } = appStore
const { addAnimeToFavourites, removeAnimeFromFavourites, checkIsFavourite, saveAnimeToHistory } = saveManagerStore

const anime = ref<Anime | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const isFavourite = computed(() => {
  return anime.value ? checkIsFavourite(anime.value.animeResult.anime_url) : false
})

const getPosterUrl = (poster: string) => {
  return poster.startsWith("http") ? poster : `https:${poster}`
}

const toggleFavourite = () => {
  if (!anime.value) return
  
  const url = anime.value.animeResult.anime_url
  if (isFavourite.value) {
    removeAnimeFromFavourites(url)
  } else {
    addAnimeToFavourites(url)
  }
}

const playEpisode = (episode: any) => {
  if (anime.value) {
    saveAnimeToHistory(anime.value.animeResult.anime_url)
    playAnime(anime.value)
  }
}

onMounted(async () => {
  try {
    const extractor = new YummyAnimeExtractor()
    const result = await extractor.getAnime(props.url)
    anime.value = result
  } catch (err) {
    error.value = "Ошибка при загрузке аниме"
    console.error('Error loading anime:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style>
@import '../styles/AnimePage.css';
</style>
