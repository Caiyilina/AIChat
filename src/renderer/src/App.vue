<script setup lang="ts">
import AppBar from "./components/AppBar.vue"


</script>

<template>
  <div class="flex flex-col h-screen">
    <app-bar />
    <div class="flex flex-row h-0 flex-grow">
      <!-- 侧边导航栏 -->
      <!-- <SideBar v-show="route.name !== 'welcome'" v-model:model-value="activeTab" class="h-full" /> -->

      <!-- 主内容区域 -->
      <div class="flex-1 w-0 h-full">
        <RouterView />
      </div>
    </div>
  </div>
</template>
