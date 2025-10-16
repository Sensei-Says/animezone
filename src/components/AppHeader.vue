<template>
  <header class="header">
    <div class="logo" @click="goHome">Anime<span>Zone</span></div>
    <nav class="nav">
      <a href="#" @click.prevent="scrollToSection('ongoing')">Онгоинги</a>
      <a href="#" @click.prevent="openHistory">История</a>
      <a href="#" @click.prevent="openFavourites">Избранное</a>
    </nav>
    <div class="search">
      <input 
        type="text" 
        placeholder="Поиск аниме..." 
        v-model="searchQuery"
        @keyup.enter="performSearch"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const { openHistory, openFavourites, searchAnime, closeAll } = appStore

const searchQuery = ref('')

const performSearch = () => {
  if (searchQuery.value.trim()) {
    searchAnime(searchQuery.value.trim())
  }
}

const goHome = () => {
  closeAll()
}

const scrollToSection = (sectionId: string) => {
  // Если мы на главной странице, прокручиваем к секции
  if (!appStore.currentBody) {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    // Если мы на другой странице, переходим на главную
    closeAll()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 5%;
    background: #1a1a1a;
    position: sticky;
    top: 0;
    z-index: 10;
}

.logo {
    font-size: 1.8rem;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: color 0.3s;
}
.logo:hover {
    color: #ff0066;
}
.logo span {
    color: #ff0066;
}

.nav a {
    margin: 0 15px;
    text-decoration: none;
    color: #ccc;
    transition: color 0.3s;
    cursor: pointer;
}
.nav a:hover {
    color: #ff0066;
}

.search input {
    background: #2a2a2a;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    color: #fff;
    width: 180px;
}
.search input:focus {
    outline: 2px solid #ff0066;
}

/* 📱 Мобильная адаптация */
@media (max-width: 768px) {
    .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .nav {
        display: flex;
        flex-wrap: wrap;
    }

    .nav a {
        margin: 5px 10px;
    }

    .search input {
        width: 100%;
    }
}
</style>
