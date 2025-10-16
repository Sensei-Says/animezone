import { defineStore } from 'pinia'
import { ref } from 'vue'

interface PlayerSettings {
  playbackSpeed: number
  volume: number
  isMuted: boolean
}

interface AnimeSaveData {
  player: number
  dubber: number
  episode: number
  time: number
}

const DEFAULT_SETTINGS: PlayerSettings = {
  playbackSpeed: 1.0,
  volume: 1.0,
  isMuted: false,
}

const SETTINGS_KEY = "player_settings"
const ANIME_PROGRESS_KEY = "anime_progress"
const HISTORY_KEY = "animeHistory"
const FAVOURITES_KEY = "favourites_list"
const ANIME_STATUS_KEY = "anime_status"

export const useSaveManagerStore = defineStore('saveManager', () => {
  const settings = ref<PlayerSettings>({ ...DEFAULT_SETTINGS })
  const animeProgress = ref<Record<string, AnimeSaveData>>({})
  const animeStatus = ref<Record<string, number>>({})
  // 0: несмотрел
  // 1: Запланированно
  // 2: смотрю
  // 3: просмотренно
  // 4: отложенно
  // 5: брошенно
  // 6: не буду смотреть
  const history = ref<string[]>([])
  const favourites = ref<string[]>([])

  const initialize = () => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_KEY)
      if (savedSettings) {
        settings.value = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) }
      }

      const savedProgress = localStorage.getItem(ANIME_PROGRESS_KEY)
      if (savedProgress) {
        animeProgress.value = JSON.parse(savedProgress)
      }

      const savedHistory = localStorage.getItem(HISTORY_KEY)
      if (savedHistory) {
        history.value = JSON.parse(savedHistory) || []
      } else {
        history.value = []
      }

      const savedFavourites = localStorage.getItem(FAVOURITES_KEY)
      if (savedFavourites) {
        favourites.value = JSON.parse(savedFavourites) || []
      } else {
        favourites.value = []
      }

      const savedAnimeStatus = localStorage.getItem(ANIME_STATUS_KEY)
      if (savedAnimeStatus) {
        animeStatus.value = JSON.parse(savedAnimeStatus)
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }

  const saveSettings = (newSettings: Partial<PlayerSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const setPlaybackSpeed = (speed: number) => {
    saveSettings({ playbackSpeed: speed })
  }

  const setVolume = (volume: number) => {
    saveSettings({ volume })
  }

  const setMuted = (isMuted: boolean) => {
    saveSettings({ isMuted })
  }

  const saveAnimeProgress = (url: string, data: AnimeSaveData) => {
    console.log("Saving anime progress for URL:", url, "Data:", data)
    animeProgress.value[url] = data
    try {
      localStorage.setItem(ANIME_PROGRESS_KEY, JSON.stringify(animeProgress.value))
    } catch (error) {
      console.error("Error saving anime progress:", error)
    }
  }

  const getAnimeProgress = (url: string): AnimeSaveData | undefined => {
    return animeProgress.value[url] || undefined
  }

  const getAllAnimeProgress = () => {
    return { ...animeProgress.value }
  }

  const clearAnimeProgress = (url: string) => {
    delete animeProgress.value[url]
    try {
      localStorage.setItem(ANIME_PROGRESS_KEY, JSON.stringify(animeProgress.value))
    } catch (error) {
      console.error("Error clearing anime progress:", error)
    }
  }

  const saveAnimeToHistory = (url: string) => {
    history.value = history.value.filter(item => item !== url)
    history.value.unshift(url)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  }

  const addAnimeToFavourites = (url: string) => {
    favourites.value = favourites.value.filter(item => item !== url)
    favourites.value.unshift(url)
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites.value))
  }

  const removeAnimeFromFavourites = (url: string) => {
    favourites.value = favourites.value.filter(item => item !== url)
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favourites.value))
  }

  const checkIsFavourite = (url: string): boolean => {
    return favourites.value.includes(url)
  }

  const setAnimeStatus = (url: string, status: number) => {
    if (status === 0) delete animeStatus.value[url]
    else animeStatus.value[url] = status
    localStorage.setItem(ANIME_STATUS_KEY, JSON.stringify(animeStatus.value))
  }

  const checkAnimeStatus = (url: string): number => {
    return animeStatus.value[url] || 0
  }

  const getFullAnimeStatus = () => {
    return animeStatus.value
  }

  // Инициализация при создании store
  initialize()

  return {
    settings,
    animeProgress,
    animeStatus,
    history,
    favourites,
    saveSettings,
    setPlaybackSpeed,
    setVolume,
    setMuted,
    saveAnimeProgress,
    getAnimeProgress,
    getAllAnimeProgress,
    clearAnimeProgress,
    saveAnimeToHistory,
    addAnimeToFavourites,
    removeAnimeFromFavourites,
    checkIsFavourite,
    setAnimeStatus,
    checkAnimeStatus,
    getFullAnimeStatus
  }
})
