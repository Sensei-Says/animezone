<template>
  <div class="flip-card">
    <div class="flip-card-front">
      <img :src="posterUrl" :alt="ongoing.ongoingResult.title" />
    </div>
    <div class="flip-card-back">
      <div class="flip-card-back-content">
        <h3 class="title">{{ ongoing.ongoingResult.title }}</h3>
        <p class="description">{{ ongoing.ongoingResult.description }}</p>
      </div>
      <div class="small-info">
        <div class="episodes-badge">
          {{ ongoing.ongoingResult.episodes.aired }} / {{ ongoing.ongoingResult.episodes.count || "?" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Ongoing } from '@/api/source/Yumme_anime_ru'

interface Props {
  ongoing: Ongoing
}

const props = defineProps<Props>()

const posterUrl = computed(() => {
  const poster = props.ongoing.ongoingResult.poster.huge
  return poster.startsWith("http") ? poster : `https:${poster}`
})
</script>

<style>
@import '../styles/OngoingPage.css';
</style>
