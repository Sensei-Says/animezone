<template>
  <div class="home-page">
    <main class="main">
      <!-- Онгоинги -->
      <section id="ongoing" class="section">
        <h2 class="section-title">Онгоинги</h2>
        <div v-if="ongoings.length > 0" class="anime-grid">
          <div 
            v-for="(ongoing, index) in ongoings" 
            :key="ongoing.ongoingResult?.anime_id || `ongoing-${index}`"
            class="card"
            @click="openAnime(ongoing.ongoingResult?.anime_id || ongoing.ongoingResult?.title)"
          >
            <img :src="getPosterUrl(ongoing)" :alt="ongoing.ongoingResult?.title || 'Аниме'" />
            <div class="card-info">
              <h3>{{ ongoing.ongoingResult?.title || 'Без названия' }}</h3>
              <p>{{ ongoing.ongoingResult?.description || 'Описание отсутствует' }}</p>
            </div>
          </div>
        </div>
        <div v-else class="loading-message">
          <p>Загрузка онгоингов...</p>
        </div>
      </section>
    </main>

    <footer class="footer">
      <p>© 2025 AnimeZone — made by ./dot</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { YummyAnimeExtractor } from '@/api/source/Yumme_anime_ru'

const appStore = useAppStore()
const { openAnimePage } = appStore

const ongoings = ref<any[]>([])

const openAnime = (url: string) => {
  openAnimePage(url)
}

const getPosterUrl = (ongoing: any) => {
  if (ongoing.ongoingResult?.poster?.huge) {
    const poster = ongoing.ongoingResult.poster.huge
    return poster.startsWith("http") ? poster : `https:${poster}`
  }
  return 'https://via.placeholder.com/300x400/333/fff?text=No+Image'
}

const loadData = async () => {
  try {
    const extractor = new YummyAnimeExtractor()
    
    // Загружаем онгоинги
    console.log('Загружаем онгоинги...')
    const ongoingData = await extractor.getOngoings()
    console.log('Онгоинги загружены:', ongoingData.length)
    
    // Проверяем структуру первого элемента
    if (ongoingData.length > 0) {
      console.log('Первый онгоинг:', ongoingData[0].ongoingResult?.title || 'Без названия')
    }
    
    // Проверяем каждый онгоинг
    const validOngoings: any[] = []
    const invalidOngoings: any[] = []
    
    ongoingData.forEach((ongoing, index) => {
      if (ongoing.ongoingResult && ongoing.ongoingResult.title) {
        validOngoings.push(ongoing)
      } else {
        invalidOngoings.push({ index, ongoing })
        console.log(`Невалидный онгоинг ${index}:`, ongoing)
      }
    })
    
    console.log(`Всего онгоингов: ${ongoingData.length}`)
    console.log(`Валидных онгоингов: ${validOngoings.length}`)
    console.log(`Невалидных онгоингов: ${invalidOngoings.length}`)
    
    ongoings.value = validOngoings // Показываем все валидные онгоинги
    
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.home-page {
    font-family: 'Poppins', sans-serif;
    background-color: #0f0f0f;
    color: #f5f5f5;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}


.main {
    flex: 1;
    padding: 40px 5%;
}

.section {
    margin-bottom: 60px;
}

.section-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
    border-left: 4px solid #ff0066;
    padding-left: 10px;
}

.anime-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
}

.card {
    background: #1a1a1a;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
}
.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.4);
}

.card img {
    width: 100%;
    height: 320px;
    object-fit: cover;
}

.card-info {
    padding: 10px 15px;
}
.card-info h3 {
    color: #fff;
    margin-bottom: 5px;
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.card-info p {
    font-size: 0.9rem;
    color: #aaa;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.footer {
    text-align: center;
    padding: 15px;
    background: #111;
    color: #777;
}

.loading-message {
    text-align: center;
    padding: 40px;
    color: #aaa;
    font-size: 1.1rem;
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

    .anime-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }

    .card img {
        height: 240px;
    }
}
</style>
