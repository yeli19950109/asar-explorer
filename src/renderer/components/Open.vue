<template>
    <div id="open" ref="openRef" @drop="onDrop" @dragover.prevent.stop @click="onclick()">
        <div class="title">Drop in an `asar` archive</div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAsarStore } from '@/stores/asar';
import * as fs from '@/fs';

const asar = useAsarStore();
const openRef = ref<HTMLDivElement>();

// ['dragover', 'drop'].forEach(type => {
//     window.addEventListener(type, (e) => {
//         console.log(type, e);
//     });
// });

function onclick() {
    console.log('onclick');
}

function onDrop(e: DragEvent) {
    console.debug(e);
    e.preventDefault();
    // e.stopPropagation();
    // if (e.dataTransfer) {
    //     handleDrop(e.dataTransfer.files);
    // }
    // return false;
}

async function handleDrop(files: FileList) {
    if (files.length > 1) return;
    const file = files.item(0);
    if (!file || !/\.asar$/.test(file.path)) return;

    try {
        await Promise.resolve(fs.pathExists(file.path));
        asar.setOriginalPath(file.path);
    } catch (err) {
        console.log(err);
    }
}
</script>

<style scoped>
#open {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100vw;
    position: absolute;
    top: 22px;
    height: calc(100% - 22px);
}

//#open:after {
//    content: '';
//    background: transparent;
//    border: 6px dashed rgba(255, 255, 255, .9);
//    border-radius: 6px;
//    bottom: 20px;
//    display: block;
//    left: 20px;
//    position: absolute;
//    right: 20px;
//    top: 39px;
//    pointer-events: none;
//}

.title {
    user-select: none;
}
</style>
