<script setup>
import G6 from '@antv/g6'
// import {

// } from '/src/utils/api.js'
import { onMounted, provide, watch, ref, reactive, inject } from 'vue';
import { useGraphMenu } from '../data/useGraphMenu.js';
import { useGraphOptions } from '../data/useGraphOptions.js'
import { useInitData } from '../data/useInitData.js'
import { getBlockByID } from '../utils/api.js';
import ToolsBar from './ToolsBar.vue';
import { getAllLinks, addNode, expand1LayerOfRelationship, addEdge, nodeLight } from '../js/base.js'
import { config } from '../js/config.js'


let myGraph
let data
let pageHeight
let pageWidth
const activeNode = reactive({})
let toolsBarRef = ref(null)


const graphData = ref(useInitData())
// const graphData = useGraphDataStore();
provide('graphData',graphData)

async function createInitData(){
    // data = reactive(useInitData())
    try {
            // let nodeid = window.frameElement.parentElement.parentElement.dataset.nodeId
            let nodeid = window.frameElement.parentElement.parentElement.dataset.nodeId
            await fetch(`${config.dataSavePath}/graph-${nodeid}.json`).then(async res => {
                if (res.status == 404) {
                    await getBlockByID(nodeid).then(async e => {
                        // addNode(graph,e.root_id,'')

                        // await expand1LayerOfRelationship(e.root_id, graph)
                        // await updateNodeToMain(graph, e.root_id)
                        // expand1LayerOfRelationship()
                        await getBlockByID(e.root_id).then(async e=>{
                            console.log(nodeid,e.root_id)
                            await expand1LayerOfRelationship(data, e.root_id,e.fcontent)
                            await myGraph.changeData(data)
                        })
                        
                    })
                } else {
                    return res
                }
            }).then(async res => {
                // console.log(await res.json(),2222)
                await myGraph.changeData(await res.json())
            }).catch(err => {
                console.log('window.onload ',err)
            })
            // getBlockByID(nodeid).then(e => {
            //     expand1LayerOfRelationship(e.root_id, graph)
            // })
        } catch (err) {
            console.warn(err);
            console.log("当前不在思源文档内部")
        }
    
}
onMounted(() => {
    createGraph()
    // watch(() => data, () => {
    //     // 监听画布数据
    //     // console.log(123, data)
    //     myGraph.changeData(data)
    // },
    //     { deep: true }
    // )
    createInitData()
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
    // data = reactive(createInitData())
    // let container = document.getElementById('mountNode')
    pageWidth = document.documentElement.clientWidth
    pageHeight = document.documentElement.clientHeight
    let contextMenu = new G6.Menu(useGraphMenu())
    // myGraph = new G6.Graph(useGraphOptions('mountNode', pageWidth, pageHeight))
    myGraph = new G6.Graph(useGraphOptions('mountNode', pageWidth, pageHeight, [contextMenu]))
    // myGraph = new G6.Graph(画布配置)
    myGraph.data(data)
    myGraph.render()
    // this.myGraph = myGraph || null

    myGraph.on('node:click', async (evt) => {
        // 节点左键事件
        let id = evt.item._cfg.id
        // console.log(12314, id)
        activeNode.id = id
        // console.log(toolsBarRef.value.showRightWindows)
        if(toolsBarRef.value.showRightWindows != 'Info'){
            await toolsBarRef.value.toggleRightWindows('Info')
        }else{
            await toolsBarRef.value.toggleRightWindows('')
            await toolsBarRef.value.toggleRightWindows('Info')
        }
        
    })
}





function updateGraphData(v) {
    // console.log(v)
    myGraph.changeData(v)
}

function flushGraphLayout() {
    myGraph.layout()
}

function changeSizeGraph(width, heigth) {
    myGraph.changeSize(width, heigth)
}

function clearGraph(){
    myGraph.clear()
    graphData.value = useInitData()
}


G6.registerNode('rect-note',(cfg)=>`<group>
<rect style={{
    width: 100,max-width: 200, height: 20, fill: '#1890ff', stroke: '#1890ff', radius: [6, 6, 0, 0]
  }} keyshape="true" name="test">
    <text style={{ 
			marginTop: 2, 
			marginLeft: 50, 
      textAlign: 'center', 
      fontWeight: 'bold', 
      fill: '#fff' }} 
			name="title">${cfg.label || cfg.id}</text>
    
  </rect>
  <rect style={{ width: 100,max-width: 200, height: auto, fill: 'rgba(24,144,255,0.15)', 
		radius: [0, 0, 6, 6] }} 
		keyshape="true" 
		cursor="move">
    <text style={{marginLeft: 10 ,fill: 'red',width: 100,word-wrap : break-word}}>${cfg.content}</text>
    
    </rect></group>
`)







</script>
<template>
    <tools-bar 
    v-bind:graphData="graphData" 
    v-on:update:graphData="updateGraphData" 
    v-on:clearGraph="clearGraph" 
    :activeNode="activeNode"
    ref="toolsBarRef" 
    v-on:flushGraphLayout="flushGraphLayout" 
    v-on:changeSizeGraph="changeSizeGraph" />
    <div id="mountNode"></div>

</template>

<style scoped>
.info {
    height: 26px;
    width: auto;
    color: aliceblue;
}
</style>