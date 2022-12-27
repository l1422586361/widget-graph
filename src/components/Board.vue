<script setup>
import G6 from '@antv/g6'
// import {

// } from '/src/utils/api.js'
import { onMounted, provide, watch, ref, reactive } from 'vue';
import { useGraphMenu } from '../data/useGraphMenu.js';
import {useGraphOptions} from '../data/useGraphOptions.js'
import { useInitData } from '../data/useInitData.js'
import ToolsBar from './ToolsBar.vue';
import { hasNode } from '../js/base.js'

let myGraph
let data
let pageHeight
let pageWidth



onMounted(() => {
    createGraph()
    // watch(() => data, () => {
    //     // 监听画布数据
    //     // console.log(123, data)
    //     myGraph.changeData(data)
    // },
    //     { deep: true }
    // )
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
}


async function addnode(id,desc){
    // 增加普通节点
    let nodeInfo = { id: id, label: desc }
    var value = await hasNode(myGraph,id)
    if (value === false) {
        // console.log("添加节点",Date(),nodeInfo)
        myGraph.addItem('node', nodeInfo)
        myGraph.changeData(myGraph.save())
        // console.log(myGraph.save())
    }
}




</script>
<template>

        <div id="mountNode">

            <!-- <aButton @click="clickE()"></aButton> -->
            <!-- <button @click="toggleSearch">测试搜索</button>
        <button @click="toggleInfo">测试信息</button> -->
        </div>
        <ToolsBar
            @addNode="addnode"
        ></ToolsBar>


</template>

<style scoped>
.info {
    height: 26px;
    width: auto;
    color: aliceblue;
}



</style>