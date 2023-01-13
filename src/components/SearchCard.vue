<template>
    <div class="card">
        <el-card class="box-card box-card1" shadow="never">
            <template #header>
                <div class="card-header">
                    <el-input v-model="input1" class="w-50 m-2" placeholder="请输入关键字，回车即触发查询" :prefix-icon="Search"
                        clearable @keyup.enter="getNodeByStr(input1)" />
                    <el-button class="button" text @click="closeWindow()">close</el-button>
                </div>

            </template>
            <div class="card-header"><b>查询结果</b></div>
        </el-card>


        <el-card class="box-card box-card2" shadow="never">
            <div v-for="info in nodeLists" :key="info.id" class="text item">
                <el-tooltip class="box-item" effect="dark" :content="info.fcontent" placement="left-start">
                    <el-descriptions class="result-list" :title="info.fcontent.slice(0, 20)" :column="3" size="default">
                        <template #extra>
                            <el-button-group class="ml-4" size="default">
                                <el-button size="small" @click="add1Node(info.id, info.fcontent)">+1</el-button>
                                <el-button size="small" @click="add2Node(info.id, info.fcontent)">+2</el-button>
                                <el-button size="small" @click="add3Node(info.id, info.fcontent)">+3</el-button>
                            </el-button-group>
                        </template>
                        <el-descriptions-item label="反链"><el-tag size="small">{{
                            info.backcount
                        }}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="正链"><el-tag size="small">{{
                            info.frontcount
                        }}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="命中子块"><el-tag size="small">{{
                            info.length
                        }}</el-tag></el-descriptions-item>
                        <!-- <el-descriptions-item label="">按钮</el-descriptions-item> -->
                    </el-descriptions>
                </el-tooltip>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
import { fullTextSearchBlock, getBlockByID } from '../utils/api.js'
import { getDocCount, getDocSort, } from '../js/base.js'
import { getAllLinks, addNode, expand1LayerOfRelationship, addEdge, nodeLight } from '../js/base.js'

import { config } from '../js/config.js'

const props = defineProps(
    {
        graphData: {
            type: Object,
            default: () => { },
        }
    })
const emit = defineEmits(['update:graphData','toggleRightWindows'])
function updateGraphData() {
    emit('update:graphData', props.graphData)
}
function closeWindow(){
    emit('toggleRightWindows','Search')
}
let input1 = ref('')
const nodeLists = ref([]) // 关键字查询结果

async function add1Node(id, desc) {
    await addNode(props.graphData, { id: id, label: desc, style: config.extNodeStyle.style })
    updateGraphData()
}

async function add2Node(id, desc) {
    await expand1LayerOfRelationship(props.graphData, id, desc)
    // emit('update:graphData',props.graphData)
    updateGraphData()

}


async function getNodeByStr(str) {
    // 查询关键字获取文档
    await fullTextSearchBlock(str).then(async e => {
        let matchs = []   // 添加匹配块计数
        let nodeIds = []
        for (let doc of e.blocks) {
            matchs.push({ id: doc.id, length: doc.children.length })
            nodeIds.push(doc.id)
        }
        let nodes = await getDocSort(nodeIds)
        for (let n of nodes) {
            for (let count of matchs) { // 添加匹配块计数
                if (count.id === n.id) {
                    n.length = count.length
                }
            }
        }
        // console.log(nodes)
        // console.log(nodeLists.value)
        nodes.sort((a, b) => { // 依次对3个计数倒序排序
            if (a.backcount > b.backcount) return -1;
            if (a.backcount < b.backcount) return 1;
            if (a.frontcount > b.frontcount) return -1;
            if (a.frontcount < b.frontcount) return 1;
            if (a.length > b.length) return -1;
            if (a.length < b.length) return 1;
            return 0
        })
        nodeLists.value = nodes

        // console.log(nodeLists)
    })
}


async function add3Node(id, desc) {
    expand1LayerOfRelationship(props.graphData, id, desc)
    await getAllLinks(id).then(async e => {
        for (let link1 of e) {
            await expand1LayerOfRelationship(props.graphData, link1.sourceId, link1.sourceDesc)
            await expand1LayerOfRelationship(props.graphData, link1.targetId, link1.targetDesc)
        }
    })
    // emit('update:graphData',props.graphData)
    updateGraphData()
}


</script>
<style scoped>
.card {
    position: absolute;
    right: 0;
    height: 95%;
    /* width: 400px; */
}

/* .box-card1 {
    position: absolute;
    right: 0;
    height: 25%;
    widows: 400px;
    overflow-y: scroll;
} */

/* .box-card1 {
    position: fixed;
    height: 25%;
} */
.box-card2 {
    /* position: relative; */
    /* top: 25%; */
    overflow-y: scroll;
    height: 85%;
    /* display:block; */
}

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
    width: 480px;
}
</style>
