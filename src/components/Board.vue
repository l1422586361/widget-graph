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


const graphData = ref(useInitData())

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
    // myGraph = new G6.Graph(useGraphOptions('mountNode', pageWidth, pageHeight))
    myGraph = new G6.Graph(useGraphOptions('mountNode', pageWidth, pageHeight,[contextMenu]))
    // myGraph = new G6.Graph(画布配置)
    myGraph.data(data)
    myGraph.render()
    // this.myGraph = myGraph || null

    myGraph.on('node:click', async (evt) => {
        // 节点左键事件
        let id = evt.item._cfg.id
        console.log(12314,id)
        activeNode.id = id
        await toolsBarRef.value.toggleRightWindows('Info')
    })
}





function updateGraphData(v) {
    // console.log(v)
    myGraph.changeData(v)
}

function flushGraphLayout(){
    myGraph.layout()
}

function changeSizeGraph(width,heigth){
    myGraph.changeSize(width, heigth)
}

function clearGraph(){
    myGraph.clear()
}

</script>
<template>
        <ToolsBar v-bind:graphData="graphData" v-on:update:graphData="updateGraphData"
        :activeNode="activeNode" ref="toolsBarRef"
        v-on:flushGraphLayout="flushGraphLayout"
        v-on:changeSizeGraph="changeSizeGraph"
        v-on:clearGraph="clearGraph"></ToolsBar>
        <div id="mountNode">
</div>

</template>

<style scoped>
.info {
    height: 26px;
    width: auto;
    color: aliceblue;
}



</style>