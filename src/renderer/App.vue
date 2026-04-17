<template>
    <div class="asar-explorer">
        <div class="title-bar"></div>
        <Open v-if="originalPath === ''" />
        <Explorer v-else />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAsarStore } from '@/stores/asar';
import Open from '@/components/Open.vue';
import Explorer from '@/components/Explorer.vue';
import * as fs from '@/fs';

const asar = useAsarStore();
const { originalPath } = storeToRefs(asar);

let offAsarOpened = fs.onAsarOpened((path) => {
    asar.openFromPath(path);
});
onMounted(() => {
    fs.notifyRendererReady();
});

onUnmounted(() => {
    offAsarOpened?.();
    offAsarOpened = () => { }
});
</script>

<style>
@import "minireset.css/minireset.css";

html,
body {
    background: linear-gradient(131deg, #ff0f83, #b10b5c);
    color: #fff;
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    height: 100vh;
    overflow: hidden;
}

.title-bar {
    content: '';
    background: rgba(255, 255, 255, .6);
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

#app,
.asar-explorer {
    width: 100%;
    height: 100%;
}
</style>
