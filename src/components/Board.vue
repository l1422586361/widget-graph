<template>
    <div id="mountNode">
        <aButton @click=""></aButton>
    </div>
</template>
<script setup>
import G6 from '@antv/g6'
import aButton from './aButton.vue';
// import {

// } from '/src/utils/api.js'
import { onMounted } from 'vue';
import {
    画布数据, 画布配置
} from '../data/config.js';

function initGraph() {
    // const container = this.container
    const myGraph = new G6.Graph(画布配置)
    myGraph.data(画布数据)
    myGraph.render()
    this.myGraph = myGraph || null
}



onMounted(async () => {
    await initGraph()
})


</script>
<style>

</style>