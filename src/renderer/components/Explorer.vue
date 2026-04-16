<template>
  <div>
    <header>
      <div>{{ asarName }}</div>
      <div style="cursor:pointer;" @click="asar.clearAsar()">
        <svg width="22" height="22" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z" fill="#fff"/></svg>
      </div>
    </header>
    <main :class="{ 'alt': sortedContents.length === 0 && inSubFolder }">
      <div class="item" @dblclick="navigateUp" v-if="inSubFolder">
        <div class="file-name">..</div>
      </div>
      <template v-if="sortedContents.length > 0">
        <Item v-for="item in sortedContents" :key="item.name" :item="item" />
      </template>
      <template v-else>
        <div class="no-contents">
          <span>No Contents</span>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import Item from '@/components/Item.vue'
import { useAsarStore } from '@/stores/asar'
import * as fs from '@/fs'

const asar = useAsarStore()
const { asarName, currentPath: filePath, contents } = storeToRefs(asar)

const inSubFolder = computed(() =>
  new RegExp(`${asarName.value}.+`).test(filePath.value)
)

const sortedContents = computed(() => [
  ...contents.value.filter(({ stat }) => stat.isDirectory === true),
  ...contents.value.filter(({ stat }) => stat.isFile === true)
])

function navigateUp () {
  const segments = filePath.value.split(/\\|\//g)
  segments.pop()
  const pwd = fs.joinPath(...segments)
  asar.setCurrentPath(pwd)
  asar.fetchContents(pwd)
}

onMounted(() => {
  asar.fetchContents(filePath.value)
})
</script>

<style scoped>
header {
  align-items: center;
  border-bottom: 2px solid rgba(255, 255, 255, .3);
  display: flex;
  font-size: 26px;
  justify-content: space-between;
  padding: 39px 20px 20px;
  user-select: none;
}

main {
  height: calc(100vh - 89px);
  overflow-y: auto;
}

main.alt {
  height: calc(100vh - 152px);
  overflow: hidden;
}

.no-contents {
  align-items: center;
  border-top: 2px solid rgba(255, 255, 255, .4);
  display: flex;
  font-size: 22px;
  height: 100%;
  justify-content: center;
  width: 100%;
}
</style>
