<template>
    <div
        id="open"
        ref="openRef"
        @click="selectAsarFile"
        @drop.prevent="onDrop"
        @dragover.prevent
    >
        <div class="title">Drop an <code>.asar</code> here</div>
        <div class="hint">or click anywhere to choose a file</div>
    </div>
</template>

<script setup lang="ts">
import { useAsarStore } from '@/stores/asar';
import * as fs from '@/fs';

const asar = useAsarStore();

async function selectAsarFile() {
    const p = await fs.selectAsarFile();
    if (p) await asar.openFromPath(p);
}

function onDrop(e: DragEvent) {
    const file = e.dataTransfer?.files?.item(0);
    if (!file?.path) return;
    asar.openFromPath(file.path);
}
</script>

<style scoped>
#open {
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    width: 100vw;
    position: absolute;
    top: 22px;
    height: calc(100% - 22px);
}

#open:after {
    content: '';
    background: transparent;
    border: 6px dashed rgba(255, 255, 255, .9);
    border-radius: 6px;
    bottom: 20px;
    display: block;
    left: 20px;
    position: absolute;
    right: 20px;
    top: 39px;
    pointer-events: none;
}

.title {
    font-size: 20px;
    user-select: none;
}

.title code {
    font-size: inherit;
}

.hint {
    font-size: 15px;
    opacity: .92;
    user-select: none;
}
</style>
