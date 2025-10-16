<template>
  <div class="header">
    <div class="header-left">
      <h1>Anime Parser</h1>
    </div>

    <div class="header-center">
      <div class="search-container">
        <input
          ref="inputRef"
          v-model="searchValue"
          class="search-input"
          type="text"
          placeholder="Поиск аниме..."
          @keydown.enter="handleSearch"
        />
        <button class="header-button" @click="handleSearch">
          <svg class="search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="header-right">
      <button class="header-button" @click="openFavourites">
        <svg class="heart-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
      <button class="header-button" @click="closeAll">
        <svg class="home-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      </button>
    </div>
    <WindowControlButtons />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import WindowControlButtons from './WindowControlButtons.vue'

const appStore = useAppStore()
const { searchAnime, openFavourites, closeAll } = appStore

const searchValue = ref('')
const inputRef = ref<HTMLInputElement>()

const handleSearch = () => {
  if (searchValue.value.length > 2) {
    searchAnime(searchValue.value)
    searchValue.value = ''
    inputRef.value?.blur()
  }
}
</script>

<style>
@import '../styles/Header.css';
</style>
