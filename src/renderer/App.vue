<template>
  <div id="app">
    <div class="title-bar"></div>
    <Open v-if="originalPath === ''" />
    <Explorer v-else />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAsarStore } from '@/stores/asar'
import Open from '@/components/Open.vue'
import Explorer from '@/components/Explorer.vue'

const { originalPath } = storeToRefs(useAsarStore())
</script>

<style>
@import "minireset.css/minireset.css";
@import url('https://fonts.googleapis.com/css?family=Roboto');

html,
body {
  background: linear-gradient(131deg, #ff0f83, #b10b5c);
  color: #fff;
  font-family: 'Roboto', sans-serif;
  height: 100vh;
  overflow: hidden;
}

.title-bar {
  content: '';
  background: rgba(255,255,255,.6);
  display: block;
  height: 22px;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-app-region: drag;
}

::-webkit-scrollbar {
  background: rgba(255, 255, 255, .4);
  width: 10px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, .65);
}
</style>
