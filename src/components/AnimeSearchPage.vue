<template>
  <div class="search-page">
    <div class="search-header">
      <h2>Результаты поиска: "{{ query }}"</h2>
    </div>
    
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
    </div>
    
    <div v-else-if="searchResults.length === 0" class="no-results">
      <p>Ничего не найдено по запросу "{{ query }}"</p>
    </div>
    
    <div v-else class="search-results">
      <div
        v-for="(result, index) in searchResults"
        :key="index"
        class="search-result-item"
        @click="openAnime(result)"
      >
        <div class="result-poster">
          <img
            :src="getPosterUrl(result.poster.huge)"
            :alt="result.title"
          />
        </div>
        <div class="result-info">
          <h3 class="result-title">{{ result.title }}</h3>
          <div class="result-meta">
            <span class="result-type">{{ result.type.name }}</span>
            <span class="result-year">{{ result.year }}</span>
            <span class="result-status" :data-status="result.anime_status.title">
              {{ result.anime_status.title }}
            </span>
          </div>
          <p class="result-description">{{ result.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { YummyAnimeExtractor, Search } from '@/api/source/Yumme_anime_ru'
import { useAppStore } from '@/stores/app'
import LoadingSpinner from './LoadingSpinner.vue'

interface Props {
  query: string
}

const props = defineProps<Props>()
const appStore = useAppStore()
const { openAnimePage } = appStore

const searchResults = ref<Search[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const getPosterUrl = (poster: string) => {
  return poster.startsWith("http") ? poster : `https:${poster}`
}

const openAnime = (search: Search) => {
  openAnimePage(search.searchResult.anime_url)
}

onMounted(async () => {
  try {
    const extractor = new YummyAnimeExtractor()
    const results = await extractor.Search(props.query)
    searchResults.value = results
  } catch (err) {
    error.value = "Ошибка при поиске"
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style>
@import '../styles/AnimeSearchPage.css';
</style>
