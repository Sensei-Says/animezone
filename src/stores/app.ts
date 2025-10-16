import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Anime } from '@/api/source/Yumme_anime_ru'

export enum BodyType {
  Search,
  Anime,
  Player,
  History,
  Favourites
}

export interface BodyElement {
  type: BodyType
  value?: string | Anime
}

export const useAppStore = defineStore('app', () => {
  const opened = ref<BodyElement[]>([])

  const currentBody = computed(() => {
    return opened.value.length > 0 ? opened.value[opened.value.length - 1] : undefined
  })

  const openAnimePage = (url: string) => {
    if (
      opened.value.length < 1 ||
      opened.value[opened.value.length - 1].type !== BodyType.Anime ||
      opened.value[opened.value.length - 1].value !== url
    ) {
      opened.value.push({ type: BodyType.Anime, value: url })
    }
  }

  const closeLast = () => {
    if (opened.value.length > 0) {
      opened.value.pop()
    }
  }

  const closeAll = () => {
    opened.value = []
  }

  const playAnime = (anime: Anime) => {
    opened.value.push({ type: BodyType.Player, value: anime })
  }

  const searchAnime = (query: string) => {
    if (
      opened.value.length < 1 ||
      opened.value[opened.value.length - 1].type !== BodyType.Search ||
      opened.value[opened.value.length - 1].value !== query
    ) {
      opened.value.push({ type: BodyType.Search, value: query })
    }
  }

  const openHistory = () => {
    if (
      opened.value.length < 1 ||
      opened.value[opened.value.length - 1].type !== BodyType.History
    ) {
      opened.value.push({ type: BodyType.History })
    }
  }

  const openFavourites = () => {
    if (
      opened.value.length < 1 ||
      opened.value[opened.value.length - 1].type !== BodyType.Favourites
    ) {
      opened.value.push({ type: BodyType.Favourites })
    }
  }

  return {
    opened,
    currentBody,
    openAnimePage,
    closeLast,
    closeAll,
    playAnime,
    searchAnime,
    openHistory,
    openFavourites
  }
})
