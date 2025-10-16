<template>
  <div class="favourites-page">
    <div class="page-header">
      <h2>Избранное</h2>
    </div>
    
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
    </div>
    
    <div v-else-if="favouriteAnime.length === 0" class="no-favourites">
      <p>Список избранного пуст</p>
    </div>
    
    <div v-else class="favourites-list">
      <div
        v-for="(anime, index) in favouriteAnime"
        :key="index"
        class="favourite-item"
        @click="openAnime(anime)"
      >
        <div class="favourite-poster">
          <img
            :src="getPosterUrl(anime.animeResult.poster.huge)"
            :alt="anime.animeResult.title"
          />
        </div>
        <div class="favourite-info">
          <h3 class="favourite-title">{{ anime.animeResult.title }}</h3>
          <div class="favourite-meta">
            <span class="favourite-type">{{ anime.animeResult.type.name }}</span>
            <span class="favourite-year">{{ anime.animeResult.year }}</span>
          </div>
          <p class="favourite-description">{{ anime.animeResult.description }}</p>
        </div>
        <button class="remove-favourite" @click.stop="removeFromFavourites(anime)">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { YummyAnimeExtractor, Anime } from '@/api/source/Yumme_anime_ru'
import { useAppStore } from '@/stores/app'
import { useSaveManagerStore } from '@/stores/saveManager'
import LoadingSpinner from './LoadingSpinner.vue'

const appStore = useAppStore()
const saveManagerStore = useSaveManagerStore()
const { openAnimePage } = appStore
const { favourites, removeAnimeFromFavourites } = saveManagerStore

const favouriteAnime = ref<Anime[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const getPosterUrl = (poster: string) => {
  return poster.startsWith("http") ? poster : `https:${poster}`
}

const openAnime = (anime: Anime) => {
  openAnimePage(anime.animeResult.anime_url)
}

const removeFromFavourites = (anime: Anime) => {
  removeAnimeFromFavourites(anime.animeResult.anime_url)
  // Обновляем список после удаления
  favouriteAnime.value = favouriteAnime.value.filter(a => a.animeResult.anime_url !== anime.animeResult.anime_url)
}

onMounted(async () => {
  try {
    const extractor = new YummyAnimeExtractor()
    const animePromises = favourites.map(url => extractor.getAnime(url))
    const results = await Promise.all(animePromises)
    favouriteAnime.value = results
  } catch (err) {
    error.value = "Ошибка при загрузке избранного"
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style>
@import '../styles/FavouritesPage.css';
</style>
