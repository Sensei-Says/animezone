<template>
  <div class="iframe-player">
    <div class="player-header">
      <h2>{{ anime.animeResult.title }}</h2>
      <button @click="closePlayer" class="close-button">✕</button>
    </div>
    
    <div class="episode-selector">
      <h3>Выберите эпизод:</h3>
      <div class="episode-buttons">
        <button
          v-for="(dubber, dubberIndex) in currentPlayer?.dubbers || []"
          :key="dubberIndex"
          @click="selectDubber(dubberIndex)"
          :class="{ active: selectedDubberIndex === dubberIndex }"
          class="dubber-button"
        >
          {{ dubber.dubbing }}
        </button>
      </div>
      
      <div v-if="selectedDubber" class="episode-list">
        <button
          v-for="(episode, episodeIndex) in selectedDubber.episodes"
          :key="episodeIndex"
          @click="playEpisode(episode)"
          :class="{ active: selectedEpisodeIndex === episodeIndex }"
          class="episode-button"
        >
          {{ getEpisodeNumber(episode) }}
        </button>
      </div>
    </div>

    <div v-if="currentIframeUrl" class="video-container">
      <iframe
        :src="currentIframeUrl"
        frameborder="0"
        allowfullscreen
        class="video-iframe"
      ></iframe>
    </div>
    
    <div v-else-if="!currentPlayer" class="no-video">
      <p>Нет доступных плееров для этого аниме</p>
    </div>
    
    <div v-else class="no-video">
      <p>Выберите эпизод для просмотра</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Anime } from '@/api/source/Yumme_anime_ru'
import type { VideoInfo } from '@/api/source/yummi_anime_types'
import { useAppStore } from '@/stores/app'
import { useSaveManagerStore } from '@/stores/saveManager'

interface Props {
  anime: Anime
}

const props = defineProps<Props>()
const appStore = useAppStore()
const saveManagerStore = useSaveManagerStore()
const { closeLast } = appStore
const { saveAnimeProgress, getAnimeProgress } = saveManagerStore

const selectedDubberIndex = ref<number>(0)
const selectedEpisodeIndex = ref<number>(0)
const currentIframeUrl = ref<string>('')

const currentPlayer = computed(() => {
  return props.anime.players && props.anime.players.length > 0 ? props.anime.players[0] : null
})

const selectedDubber = computed(() => {
  return currentPlayer.value?.dubbers?.[selectedDubberIndex.value] || null
})

const selectDubber = (index: number) => {
  selectedDubberIndex.value = index
  selectedEpisodeIndex.value = 0
}

const getEpisodeNumber = (episode: any) => {
  if (episode.number) return episode.number
  if (episode.video && episode.video.number) return episode.video.number
  if (episode.data && episode.data.number) return episode.data.number
  return 'Episode'
}

const playEpisode = async (episode: any) => {
  try {
    console.log('Loading episode:', episode)
    console.log('Episode structure:', Object.keys(episode))
    
    // Проверяем разные возможные структуры данных
    let iframeUrl = null
    let episodeNumber = null
    
    if (episode.iframe_url) {
      iframeUrl = episode.iframe_url
      episodeNumber = episode.number
    } else if (episode.video && episode.video.iframe_url) {
      iframeUrl = episode.video.iframe_url
      episodeNumber = episode.video.number
    } else if (episode.data && episode.data.iframe_url) {
      iframeUrl = episode.data.iframe_url
      episodeNumber = episode.data.number
    }
    
    console.log('Episode number:', episodeNumber)
    console.log('Iframe URL:', iframeUrl)
    
    if (iframeUrl) {
      currentIframeUrl.value = iframeUrl
      
      // Сохраняем прогресс
      saveAnimeProgress(props.anime.animeResult.anime_url, {
        player: 0,
        dubber: selectedDubberIndex.value,
        episode: selectedEpisodeIndex.value,
        time: 0
      })
    } else {
      console.error('No iframe URL available for episode')
    }
  } catch (error) {
    console.error('Ошибка при загрузке эпизода:', error)
  }
}

const closePlayer = () => {
  closeLast()
}

onMounted(async () => {
  console.log('IframePlayer mounted with anime:', props.anime)
  console.log('Anime players:', props.anime.players)
  console.log('Current player:', currentPlayer.value)
  console.log('Selected dubber:', selectedDubber.value)
  
  // Загружаем сохраненный прогресс
  const progress = getAnimeProgress(props.anime.animeResult.anime_url)
  if (progress) {
    selectedDubberIndex.value = progress.dubber
    selectedEpisodeIndex.value = progress.episode
  }
  
  // Автоматически загружаем первый эпизод
  if (selectedDubber.value && selectedDubber.value.episodes && selectedDubber.value.episodes.length > 0) {
    console.log('First episode:', selectedDubber.value.episodes[0])
    await playEpisode(selectedDubber.value.episodes[0])
  }
})
</script>

<style>
.iframe-player {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.player-header h2 {
  margin: 0;
  color: #fff;
}

.close-button {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #ff6666;
}

.episode-selector {
  margin-bottom: 20px;
}

.episode-selector h3 {
  color: #fff;
  margin-bottom: 10px;
}

.episode-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.dubber-button, .episode-button {
  background: #333;
  color: #fff;
  border: 1px solid #555;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.dubber-button:hover, .episode-button:hover {
  background: #444;
}

.dubber-button.active, .episode-button.active {
  background: #007bff;
  border-color: #007bff;
}

.episode-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.video-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.no-video {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #222;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
}
</style>
