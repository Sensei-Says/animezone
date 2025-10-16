<template>
  <div id="app">
    <GetBody />
  </div>
</template>

<script setup lang="ts">
import GetBody from './components/GetBody.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

#app {
    font-family: 'Poppins', sans-serif;
    background-color: #0f0f0f;
    color: #f5f5f5;
    min-height: 100vh;
}

/* Глобальные стили для компонентов */
.body-content {
    min-height: 100vh;
}
</style>
