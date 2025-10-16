<template>
  <div class="window-control-buttons">
    <button class="window-button minimize" @click="minimizeWindow">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19h12v2H6z"/>
      </svg>
    </button>
    <button class="window-button maximize" @click="toggleFullscreen">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z"/>
      </svg>
    </button>
    <button class="window-button close" @click="closeApp">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
// В веб-версии эти функции не будут работать, так как это только для Electron
// Но оставляем их для совместимости
const minimizeWindow = () => {
  console.log('Minimize window - not available in web version')
}

const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    document.documentElement.requestFullscreen()
  }
}

const closeApp = () => {
  console.log('Close app - not available in web version')
}
</script>

<style>
@import '../styles/WindowControlButtons.css';
</style>
