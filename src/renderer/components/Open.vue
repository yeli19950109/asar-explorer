<template>
  <div id="open">
    <div class="title">Drop in an `asar` archive</div>
  </div>
</template>

<script setup>
import { onMounted, inject } from 'vue'
import { useAsarStore } from '@/stores/asar'

const asar = useAsarStore()
const $fs = inject('fs')

onMounted(() => {
  document.addEventListener('drop', (e) => {
    e.preventDefault()
    e.stopPropagation()
    handleDrop(e.dataTransfer.files)
    return false
  })

  document.addEventListener('dragover', (e) => {
    e.preventDefault()
    e.stopPropagation()
  })
})

async function handleDrop (files) {
  if (files.length > 1) return
  if (!/\.asar$/.test(files[0].path)) return

  try {
    await Promise.resolve($fs.pathExists(files[0].path))
    asar.setOriginalPath(files[0].path)
  } catch (e) {
    console.log(e)
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
