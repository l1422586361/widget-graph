<script setup>
import G6 from '@antv/g6'
// import {

// } from '/src/utils/api.js'
import { onMounted, provide, watch, ref, reactive,inject } from 'vue';
import { useGraphMenu } from '../data/useGraphMenu.js';
import { useGraphOptions } from '../data/useGraphOptions.js'
import { useInitData } from '../data/useInitData.js'
import ToolsBar from './ToolsBar.vue';


let myGraph
let data
let pageHeight
let pageWidth
const activeNode = reactive({})
let toolsBarRef = ref(null)

const graphData = ref(
    useInitData()
)

onMounted(() => {
    createGraph()
    // watch(() => data, () => {
    //     // 监听画布数据
    //     // console.log(123, data)
    //     myGraph.changeData(data)
    // },
    //     { deep: true }
    // )
    window.onresize = function () {
        let canvasHeight = document.documentElement.clientHeight;
        let canvasWidth = document.documentElement.clientWidth;
        // console.log(canvasHeight,canvasWidth)
        myGraph.changeSize(canvasWidth, canvasHeight)
    }
})





const createGraph = () => {
    // const container = this.container
    data = reactive(useInitData())
    // let container = document.getElementById('mountNode')
    pageWidth = document.documentElement.clientWidth
    pageHeight = document.documentElement.clientHeight
    let contextMenu = new G6.Menu(useGraphMenu())
    myGraph = new G6.Graph(useGraphOptions('mountNode', pageWidth, pageHeight, [contextMenu]))
    // myGraph = new G6.Graph(画布配置)
    myGraph.data(data)
    myGraph.render()
    // this.myGraph = myGraph || null

    myGraph.on('node:click', (evt) => {
        let id = evt.item._cfg.id
        console.log(12314,id)
        activeNode.id = id
        // this.$refs.ToolsBar.toggleRightWindows('Info')
        toolsBarRef.value.toggleRightWindows('Info')
    })
}




function updateGraphData(v) {
    // console.log(v)
    myGraph.changeData(v)
}


</script>
<template>

    <div id="mountNode">

        <!-- <aButton @click="clickE()"></aButton> -->
        <!-- <button @click="toggleSearch">测试搜索</button>
        <button @click="toggleInfo">测试信息</button> -->
    </div>
    <ToolsBar v-bind:graphData="graphData" v-on:update:graphData="updateGraphData" v-bind:myGraph="myGraph"
        :activeNode="activeNode" ref="toolsBarRef"></ToolsBar>


</template>

<style scoped>
.info {
    height: 26px;
    width: auto;
    color: aliceblue;
}
</style>