<template>
  <a
    class="anime-plate"
    href="#"
    @click.prevent="openAnime"
  >
    <div class="thumbnail">
      <img
        class="thumbnail-img"
        :src="posterUrl"
        :alt="anime.animeResult.title"
      />
    </div>
    <div class="anime-data">
      <h3 class="title">{{ anime.animeResult.title }}</h3>
      <div class="small-info">
        <div
          class="small-info-el anime-status"
          :data-status="anime.animeResult.anime_status.title"
        >
          {{ anime.animeResult.anime_status.title }}
        </div>
        <div class="small-info-el">
          {{ anime.animeResult.type.name }}
        </div>
        <div class="small-info-el">{{ anime.animeResult.year }}</div>
      </div>
      <p class="description">{{ anime.animeResult.description }}</p>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Anime } from '@/api/source/Yumme_anime_ru'
import { useAppStore } from '@/stores/app'

interface Props {
  anime: Anime
}

const props = defineProps<Props>()
const appStore = useAppStore()
const { openAnimePage } = appStore

const posterUrl = computed(() => {
  const poster = props.anime.animeResult.poster.huge
  return poster.startsWith("http") ? poster : `https:${poster}`
})

const openAnime = () => {
  openAnimePage(props.anime.animeResult.anime_url)
}
</script>

<style>
@import '../styles/OngoingPage.css';
</style>
