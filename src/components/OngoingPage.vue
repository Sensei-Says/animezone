<template>
  <div>
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-text">{{ error }}</p>
    </div>
    
    <div v-else>
      <div v-if="latestAnime" class="history-Background">
        <h2 class="continue-watching">Продолжение просмотра</h2>
        <AnimePlate :anime="latestAnime" />
        <button class="full-history-button" @click="openHistory">вся история</button>
      </div>
      
      <div class="flip-cards-container">
        <div
          v-for="(ongoing, index) in ongoings"
          :key="index"
          class="flip-card-wrapper"
          @click="openOngoing(ongoing)"
        >
          <OngoingPlate :ongoing="ongoing" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { YummyAnimeExtractor, Ongoing, Anime } from '@/api/source/Yumme_anime_ru'
import { useAppStore } from '@/stores/app'
import { useSaveManagerStore } from '@/stores/saveManager'
import LoadingSpinner from './LoadingSpinner.vue'
import OngoingPlate from './OngoingPlate.vue'
import AnimePlate from './AnimePlate.vue'

const appStore = useAppStore()
const saveManagerStore = useSaveManagerStore()
const { openAnimePage, openHistory } = appStore
const { history } = saveManagerStore

const ongoings = ref<Ongoing[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const latestAnime = ref<Anime | null>(null)

const openOngoing = (ongoing: Ongoing) => {
  openAnimePage(ongoing.ongoingResult.anime_url)
}

onMounted(async () => {
  try {
    const extractor = new YummyAnimeExtractor()
    const result = await extractor.getOngoings()
    ongoings.value = result

    if (history.value && history.value.length > 0) {
      const anime = await extractor.getAnime(history.value[0])
      latestAnime.value = anime
    }
  } catch (err) {
    error.value = "Ошибка при загрузке данных"
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style>
@import '../styles/OngoingPage.css';
</style>
