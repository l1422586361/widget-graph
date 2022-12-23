
<script setup>
import { ref } from 'vue'
import { useToolsItem } from '../data/toolItem.js'
const showRightWindows = ref(null)

const toolItem = ref(useToolsItem())

function toggleRightWindows(str) {
    if (str === showRightWindows.value) {
        showRightWindows.value = null
    } else {
        showRightWindows.value = str
    }
}
</script>

<template>
    <el-button-group class="ml-4" size="default" v-for="tool in toolItem">
        <el-button v-if="tool.enable" :icon="tool.icon" @click="toggleRightWindows(tool.name)" :title="tool.title" />
        <!-- <el-button :icon="Share" @click="toggleRightWindows('Info')" /> -->
        <!-- <el-button type="primary" :icon="Delete" /> -->
    </el-button-group>
    <div>
        <li v-if="showRightWindows == 'Search'">搜索窗口</li>
        <li v-if="showRightWindows == 'Info'">信息窗口</li>
    </div>
</template>

<style scoped>

</style>