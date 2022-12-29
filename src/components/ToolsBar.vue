
<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
// import { useToolsItem } from '../data/useToolsItem.js'
// import { Search } from '@element-plus/icons-vue'
import { fullTextSearchBlock, getBlockByID } from '../utils/api.js'
import { getDocCount, getDocSort, } from '../js/base.js'
import { hasNode, getAllLinks, hasEdge } from '../js/base.js'
import {
    Search
} from "@element-plus/icons-vue";
import { useInitData } from '../data/useInitData.js';
import { useToolsItem } from '../data/useToolsItem.js';


let showRightWindows = ref('')
let toolItem = ref(useToolsItem())
let drawer = ref(false)
let drawer2 = ref(false)
let modal = ref(false) // 窗口遮罩
let size = ref('400px')
let input1 = ref('')
const nodeLists = ref([]) // 关键字查询结果
const nodeInfo = reactive({})



const emit = defineEmits(['update:graphData'])
defineExpose({
    toggleRightWindows,
})
const props = defineProps(
    {
        graphData: {
            type: Object,
            default: () => { },
        },
        myGraph: {
            type: Object,
            default: () => { },
        },
        activeNode: {
            type: Object,
            default: () => { },
        }
    })



async function toggleRightWindows(v) {
    if (v === showRightWindows.value) {
        drawer.value = false
        drawer2.value = false
        showRightWindows.value = ''
        return
    }
    showRightWindows.value = v
    if ('Search' === v) {
        drawer.value = true
    }
    if ('Info' === v) {
        drawer2.value = true
        let id = props.activeNode.id
        console.log(props.activeNode)
        if (id) {
            Promise.all([getBlockByID(id), getDocCount(id)]).then(e => {
                nodeInfo.id = id
                nodeInfo.name = e[0].fcontent
                nodeInfo.created = e[0].created
                nodeInfo.updated = e[0].updated
                nodeInfo.frontLinkCount = e[1][0].frontcount
                nodeInfo.backLinkCount = e[1][0].backcount
                nodeInfo.url = 'siyuan://blocks/' + id
            })
            console.log(nodeInfo)
        }
    }
    if (v === 'test') {
        let node = { id: '20220606093400-r0y6l0z', label: '111111' }
        if (!await hasNode(props.graphData, node.id)) {
            props.graphData.nodes.push(node)
        }
        emit('update:graphData', props.graphData)
    }
    if (v === 'getAll') {
        // console.log(111)
        // console.log(props.graphData)
        await getAllLinks().then(async e => {
            // console.log(e)
            for (let link of e) {
                let sourceNode = { id: link.sourceId, label: link.sourceDesc }
                let targetNode = { id: link.targetId, label: link.targetDesc }
                let edge = { source: link.targetId, target: link.sourceId }
                if (!await hasNode(props.graphData, sourceNode.id)) {
                    props.graphData.nodes.push(sourceNode)
                }
                if (!await hasNode(props.graphData, targetNode.id)) {
                    props.graphData.nodes.push(targetNode)
                }
                if (!await hasEdge(props.graphData, edge)) {
                    props.graphData.edges.push(edge)
                }
            }

        })
        // console.log(props.graphData)
        emit('update:graphData', props.graphData)
    }
    if (v === 'flushGraph') {
        props.myGraph.layout()
    }

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

// function test() {
//     // 调用更新数据示例
//     console.log(111, props.graphData)
//     props.graphData.nodes.push({ id: 'node3', label: 'Node 3' })
//     emit('update:graphData', props.graphData)
//     // console.log(222,props.graphData)
// }

// function test2(){
//     // 调用更新画布实例示例
//     let data = {
//         nodes: [{id:'111',label:'2222'}],
//         edges:[]
//     }
//     props.myGraph.changeData(data)
// }


async function add1Node(id, desc) {
    // 增加普通节点
    let nodeInfo = { id: id, label: desc }
    var value = await hasNode(props.graphData, id)
    console.log(value)
    if (value === false) {
        // console.log("添加节点",Date(),nodeInfo)
        // props.myGraph.addItem('node', nodeInfo)
        // props.myGraph.changeData(myGraph.save())
        // console.log(myGraph.save())
        props.graphData.nodes.push(nodeInfo)
        console.log(props.graphData)
        emit('update:graphData', props.graphData)
    }
}


</script>

<template>
    <template class="btn-group">
        <!-- <button @click="test()">1111</button>
        <button @click="test2()">11121</button> -->
        <el-button-group class="ml-4" size="default" v-for="tool in toolItem">
            <el-tooltip class="box-item" effect="dark" :content="tool.title" placement="top">
                <el-button v-if="tool.enable" :icon="tool.icon" @click="toggleRightWindows(tool.name)" />
            </el-tooltip>
        </el-button-group>
    </template>







    <el-drawer v-model="drawer" :size=size :modal="modal">
        <template #header>
            <!-- <div>
                <h4>全局搜索</h4>
            </div> -->
            <el-input v-model="input1" class="w-50 m-2" placeholder="请输入关键字，回车即触发查询" :prefix-icon="Search" clearable
                @keyup.enter="getNodeByStr(input1)" />

        </template>


        <el-card class="box-card" v-if="nodeLists.length > 1">
            <template #header>
                <div class="card-header">
                    <b>查询结果</b>
                    <!-- <el-button class="button" text>Operation button</el-button> -->
                </div>
            </template>
            <div v-for="info in nodeLists" :key="info.id" class="text item">
                <el-tooltip class="box-item" effect="dark" :content="info.fcontent" placement="left-start">
                    <el-descriptions class="result-list" :title="info.fcontent.slice(0, 10)" :column="3" size="default">
                        <template #extra>
                            <el-button-group class="ml-4" size="default">
                                <el-button size="small" @click="add1Node(info.id, info.fcontent)">+1</el-button>
                                <el-button size="small">+2</el-button>
                                <el-button size="small">+3</el-button>
                            </el-button-group>
                        </template>
                        <el-descriptions-item label="反链"><el-tag size="small">{{ info.backcount
}}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="正链"><el-tag size="small">{{ info.frontcount
}}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="命中子块"><el-tag size="small">{{ info.length
}}</el-tag></el-descriptions-item>
                        <!-- <el-descriptions-item label="">按钮</el-descriptions-item> -->
                    </el-descriptions>
                </el-tooltip>
            </div>

        </el-card>

    </el-drawer>








    <el-drawer v-model="drawer2" :size=size :modal="modal" v-bind="nodeInfo">
        <template #header>
            <h4>详情</h4>
        </template>
        <template #default>

            <el-descriptions :title="nodeInfo.name" :column="2" size="default">
                <el-descriptions-item label-align="right" label="id" :span="2"><el-link :href="nodeInfo.url" target="_blank">{{ nodeInfo.id }}</el-link></el-descriptions-item>
                <el-descriptions-item label-align="right" label="创建时间"
                    :span="2">{{ nodeInfo.created }}</el-descriptions-item>
                <el-descriptions-item label-align="right" label="更新时间"
                    :span="2">{{ nodeInfo.updated }}</el-descriptions-item>
                <el-descriptions-item label-align="right" label="反链"><el-tag
                        size="small">{{ nodeInfo.backLinkCount }}</el-tag></el-descriptions-item>
                <el-descriptions-item label-align="right" label="正链"><el-tag
                        size="small">{{ nodeInfo.frontLinkCount }}</el-tag></el-descriptions-item>
                <!-- <el-descriptions-item label="">按钮</el-descriptions-item> -->
            </el-descriptions>

        </template>
        <template #footer>
        </template>
    </el-drawer>

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
    bottom: 0;
    left: 0;
    right: 0;
    width: fit-content;
    margin: 0 auto;
    display: inline-block;
    /* box-shadow: rgb(174, 174, 174) 0px 0px 2px 2px; */
    z-index: 9999;
}

.el-input {
    position: relative;
}
</style>