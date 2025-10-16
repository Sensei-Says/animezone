<template>
  <div class="history-page">
    <div class="page-header">
      <h2>История просмотров</h2>
    </div>
    
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
    </div>
    
    <div v-else-if="historyAnime.length === 0" class="no-history">
      <p>История просмотров пуста</p>
    </div>
    
    <div v-else class="history-list">
      <div
        v-for="(anime, index) in historyAnime"
        :key="index"
        class="history-item"
        @click="openAnime(anime)"
      >
        <div class="history-poster">
          <img
            :src="getPosterUrl(anime.animeResult.poster.huge)"
            :alt="anime.animeResult.title"
          />
        </div>
        <div class="history-info">
          <h3 class="history-title">{{ anime.animeResult.title }}</h3>
          <div class="history-meta">
            <span class="history-type">{{ anime.animeResult.type.name }}</span>
            <span class="history-year">{{ anime.animeResult.year }}</span>
          </div>
          <p class="history-description">{{ anime.animeResult.description }}</p>
        </div>
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
const { history } = saveManagerStore

const historyAnime = ref<Anime[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const getPosterUrl = (poster: string) => {
  return poster.startsWith("http") ? poster : `https:${poster}`
}

const openAnime = (anime: Anime) => {
  openAnimePage(anime.animeResult.anime_url)
}

onMounted(async () => {
  try {
    const extractor = new YummyAnimeExtractor()
    const animePromises = history.value.map(url => extractor.getAnime(url))
    const results = await Promise.all(animePromises)
    historyAnime.value = results
  } catch (err) {
    error.value = "Ошибка при загрузке истории"
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style>
@import '../styles/HistoryPage.css';
</style>
