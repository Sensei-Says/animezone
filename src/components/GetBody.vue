<template>
  <div>
    <AppHeader />
    <div v-if="currentBody" class="body-content">
      <component :is="currentBodyComponent" v-bind="currentBodyProps" />
    </div>
    <HomePage v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore, BodyType } from '@/stores/app'
import AppHeader from './AppHeader.vue'
import HomePage from './HomePage.vue'
import OngoingPage from './OngoingPage.vue'
import AnimePage from './AnimePage.vue'
import AnimeSearchPage from './AnimeSearchPage.vue'
import IframePlayer from './player/IframePlayer.vue'
import HistoryPage from './HistoryPage.vue'
import FavouritesPage from './FavouritesPage.vue'

const appStore = useAppStore()
const { currentBody } = storeToRefs(appStore)
const { closeLast } = appStore

const currentBodyComponent = computed(() => {
  if (!currentBody.value) {
    return null
  }
  
  switch (currentBody.value.type) {
    case BodyType.Player:
      return IframePlayer // Основной плеер с iframe
    case BodyType.Search:
      return AnimeSearchPage
    case BodyType.Anime:
      return AnimePage
    case BodyType.History:
      return HistoryPage
    case BodyType.Favourites:
      return FavouritesPage
    default:
      return null
  }
})

const currentBodyProps = computed(() => {
  if (!currentBody.value) return {}
  
  switch (currentBody.value.type) {
    case BodyType.Player:
      return { anime: currentBody.value.value }
    case BodyType.Search:
      return { query: currentBody.value.value }
    case BodyType.Anime:
      return { url: currentBody.value.value }
    default:
      return {}
  }
})

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeLast()
  }
}


onMounted(() => {
  window.addEventListener("keydown", handleKeyDown, true)
  // Сброс прокрутки при изменении текущего компонента
  window.scrollTo(0, 0)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown, true)
})
</script>

<style>
@import '../styles/body.css';
</style>
