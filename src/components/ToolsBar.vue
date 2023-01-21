
<script setup>
import { ref, onMounted, watch, reactive, inject } from 'vue'
// import { useToolsItem } from '../data/useToolsItem.js'
// import { Search } from '@element-plus/icons-vue'
import { fullTextSearchBlock, getBlockByID } from '../utils/api.js'
import { getDocCount, getDocSort, } from '../js/base.js'
import { getAllLinks, addNode, expand1LayerOfRelationship, addEdge } from '../js/base.js'
import {
    Mouse,
    Search
} from "@element-plus/icons-vue";
import { useInitData } from '../data/useInitData.js';
import { useToolsItem } from '../data/useToolsItem.js';
import { config } from '../js/config.js'
import SearchCard from './SearchCard.vue'
import DetailCard from "./DetailCard.vue";
// import FileSaver from "file-saver"


const graphData = inject('graphData')
let showRightWindows = ref('')
let showSearchWindows = ref(false)
let toolItem = ref(useToolsItem())
// let drawer = ref(false)
let drawer2 = ref(false)
// let modal = ref(false) // 窗口遮罩
// let size = ref('400px')


const uploadRef = ref(null)


const emit = defineEmits(['update:graphData', 'flushGraphLayout', 'changeSizeGraph'])
defineExpose({
    toggleRightWindows,
    showRightWindows
})
const props = defineProps(
    {
        activeNode: {
            type: Object,
            default: () => { },
        }
    })



function updateGraphData() {
    emit('update:graphData', graphData.value)
}

async function toggleRightWindows(v) {
    // console.log(showRightWindows,showSearchWindows)
    if(['undo','redo','zoomOut','zoomIn','realZoom','autoZoom'].indexOf(v) != -1){
        document.querySelector(".g6-component-toolbar li[code='"+v+"']").click()
        // console.log(a)
        return
    }


    if (v === showRightWindows.value && v!=='Search') {
        showRightWindows.value = ''
        return
    }
    showRightWindows.value = v
    if ('Search' === v) {
        // drawer.value = true
        // console.log(1,drawer.value,drawer2.value,showRightWindows.value)
        showSearchWindows.value = !showSearchWindows.value
        return
    }
    if ('Info' === v) {
        return
    }
    if (v === 'test') {
        // 适应屏幕 autoZoom
        // 重做 redo 
        // 撤销 undo
        // 放大 zoomOut
        // 缩小 zoomIn
        // 实际大小 realZoom
        let a = document.querySelector(".g6-component-toolbar li[code='autoZoom']")
        console.log(a)
        a.click()
    }
    if (v === 'flushGraph') {
        // props.myGraph.layout()
        emit('flushGraphLayout')
    }

}


async function onOpen() {
    let canvasHeight = document.documentElement.clientHeight;
    let canvasWidth = document.documentElement.clientHeight - 400;
    console.log(canvasHeight, canvasWidth)
    // await props.myGraph.changeSize(canvasWidth,canvasHeight)
    // emit('changeSizeGraph',canvasWidth,canvasHeight)
}
async function onClose() {
    let canvasHeight = document.documentElement.clientHeight;
    let canvasWidth = document.documentElement.clientHeight;
    console.log(canvasHeight, canvasWidth)
    drawer2.value = false
    drawer.value = false
    showRightWindows.value = ''
    // console.log(2,drawer.value,drawer2.value,showRightWindows.value)
    // await props.myGraph.changeSize(canvasWidth,canvasHeight)
    // emit('changeSizeGraph',canvasWidth,canvasHeight)
}


function handleBeforeUpload(file) {
    let reader = new FileReader()
    // console.log(111, file)
    reader.readAsText(file.raw, "UTF-8")
    reader.onload = function (e) {
        let res = JSON.parse(e.target.result)
        // graph.changeData(res)
        // let res = new Uint8Array(e.target.result)
        // let snippets = new TextDecoder('gb2312').decode(res);
        // console.log(res)
        graphData.value = res
        updateGraphData()
        // emit('update:graphData', res)
    }
}


</script>

<template>
    <template class="btn-group">
        <!-- <button @click="test()">1111</button>
        <button @click="test2()">11121</button> -->
        <el-button-group class="ml-4" size="default" v-for="tool in toolItem" :key="tool.name">
            <el-tooltip class="box-item" effect="dark" :content="tool.title" placement="top">
                <el-button v-if="tool.enable" :icon="tool.icon" @click="toggleRightWindows(tool.name)" />
            </el-tooltip>
        </el-button-group>
        <!-- <input ref="fileBtn" type="file" id="file" :on-change="importData" style="display: none" /> -->
        <el-upload style="display: none" ref="uploadRef" class="upload-demo" action="" :auto-upload="false"
            :on-change="handleBeforeUpload">
            <template #trigger>
                <el-button type="primary">select file</el-button>
            </template>
        </el-upload>
    </template>





    <search-card
    :graph-data="graphData"
    v-on:update:graphData="updateGraphData"
    v-if="showSearchWindows"
    v-on:toggleRightWindows="toggleRightWindows"
    ></search-card>



    <detail-card
    :activeNode="activeNode"
    v-if="showRightWindows==='Info'"
    v-on:toggleRightWindows="toggleRightWindows"
    ></detail-card>



</template>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    max-width: 400px;
    margin-top: 20px;
}

.result-list {
    border-bottom: solid 1px var(--el-card-border-color);
    /* width:300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
}

.btn-group {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: fit-content;
    margin: 0 auto;
    display: inline-block;
    /* box-shadow: rgb(174, 174, 174) 0px 0px 2px 2px; */
    z-index: 1;
}

.el-input {
    position: relative;
}
</style>