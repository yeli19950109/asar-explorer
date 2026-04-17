<template>
  <div id="open">
    <div class="title">Drop in an `asar` archive</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAsarStore } from '@/stores/asar'
import * as fs from '@/fs'

const asar = useAsarStore()

onMounted(() => {
  document.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) {
      handleDrop(e.dataTransfer.files)
    }
    return false
  })

  document.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })
})

async function handleDrop (files: FileList) {
  if (files.length > 1) return
  const file = files.item(0)
  if (!file || !/\.asar$/.test(file.path)) return

  try {
    await Promise.resolve(fs.pathExists(file.path))
    asar.setOriginalPath(file.path)
  } catch (err) {
    console.log(err)
  }
}
</script>

<style scoped>
#open {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  position: absolute;
  width: 100vw;
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
}
</style>
