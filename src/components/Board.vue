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
        // this.$refs.ToolsBar.toggleRightWindows('Info')
        await toolsBarRef.value.toggleRightWindows('Info')
    })

    // myGraph.on('node:contextmenu',e=>{
    //     console.log("右键触发",e)
    //     // e的数据转入与加载子组件（右键菜单），子组件获取节点id进行相应事件触发，事件触发完成后销毁子组件
    //     showMenu = !showMenu
    //     activeNode.left = e.clientX
    //     activeNode.top = e.clientY
    //     activeNode.id = e.item._cfg.id
    //     activeNode.desc = e.item._cfg.model.label
    //     console.log(activeNode,showMenu)
    // })
}





function updateGraphData(v) {
    // console.log(v)
    myGraph.changeData(v)
}

function flushGraphLayout(){
    // console.log(11)
    myGraph.layout()
}

function changeSizeGraph(width,heigth){
    myGraph.changeSize(width, heigth)
}

function clearGraph(){
    myGraph.clear()
}
function test(){
    console.log(123)
}
let showMenu = ref(false)

</script>
<template>

    
    <ToolsBar v-bind:graphData="graphData" v-on:update:graphData="updateGraphData"
        :activeNode="activeNode" ref="toolsBarRef"
        v-on:flushGraphLayout="flushGraphLayout"
        v-on:changeSizeGraph="changeSizeGraph"
        v-on:clearGraph="clearGraph"></ToolsBar>
        
    <!-- <ContextMenu
    :activeNode="activeNode"
    v-if="showMenu"
    ></ContextMenu> -->

    <div id="mountNode">

<!-- <aButton @click="clickE()"></aButton> -->
<!-- <button @click="toggleSearch">测试搜索</button>
<button @click="toggleInfo">测试信息</button> -->
</div>

</template>

<style scoped>
.info {
    height: 26px;
    width: auto;
    color: aliceblue;
}



</style>