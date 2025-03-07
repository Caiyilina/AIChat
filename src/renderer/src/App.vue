<script setup lang="ts">
import AppBar from "./components/AppBar.vue"


const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <div class="flex flex-col h-screen">
    <app-bar />
  </div>
</template>
