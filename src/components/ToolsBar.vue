
<script setup>
import { ref, onMounted, watch, defineProps, defineEmits, defineComponent } from 'vue'
import { useToolsItem } from '../data/useToolsItem.js'
import { Search } from '@element-plus/icons-vue'
import { fullTextSearchBlock } from '../utils/api.js'
import { getDocSort, updateNodeTo1 } from '../js/base.js'
import { hasNode } from '../js/base.js'



let showRightWindows = ref('')
let toolItem = ref(useToolsItem())
let drawer = ref(false)
let drawer2 = ref(false)
let modal = ref(false) // 窗口遮罩
let size = ref('400px')
let input1 = ref('')
const nodeInfos = ref([]) // 关键字查询结果



const emit = defineEmits(['addNode', 'update:graphData'])

const props = defineProps(
    {
        graphData: {
            type: Object,
            default: () => { },
        },
        myGraph: {
            type: Object,
            default: () => { },
        }
    })



function toggleRightWindows(str) {
    if (str === showRightWindows.value) {
        drawer.value = false
        drawer2.value = false
        showRightWindows.value = ''
        return
    }
    showRightWindows.value = str
    if ('Search' === str) {
        drawer.value = true
    }
    if ('Info' === str) {
        drawer2.value = true
    }

}

async function getNodeByStr(str) {
    // 查询关键字获取文档
    await fullTextSearchBlock(str).then(async e => {
        let matchs = []   // 添加匹配块计数
        let nodeIds = []
        for (let doc of e.blocks) {
            matchs.push({id:doc.id,length:doc.children.length})
            nodeIds.push(doc.id)
        }
        let nodes = await getDocSort(nodeIds)
        for(let n of nodes){
            for(let count of matchs){ // 添加匹配块计数
                if(count.id === n.id){
                    n.length = count.length
                }
            }
        }
        // console.log(nodes)
        // console.log(nodeInfos.value)
        nodes.sort((a,b)=>{ // 依次对3个计数倒序排序
            if(a.backcount > b.backcount) return -1;
            if(a.backcount < b.backcount) return 1;
            if(a.frontcount > b.frontcount) return -1;
            if(a.frontcount < b.frontcount) return 1;
            if(a.length > b.length) return -1;
            if(a.length < b.length) return 1;
            return 0
        })
        nodeInfos.value = nodes
        
        // console.log(nodeInfos)
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


async function addNode(id, desc) {
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


        <el-card class="box-card" v-if="nodeInfos.length > 1">
            <template #header>
                <div class="card-header">
                    <b>查询结果</b>
                    <!-- <el-button class="button" text>Operation button</el-button> -->
                </div>
            </template>
            <div v-for="info in nodeInfos" :key="info.id" class="text item">
                <el-tooltip class="box-item" effect="dark" :content="info.fcontent" placement="left-start">
                    <el-descriptions class="result-list" :title="info.fcontent.slice(0, 10)" :column="3" size="default">
                        <template #extra>
                            <el-button-group class="ml-4" size="default">
                                <el-button size="small" @click="addNode(info.id, info.fcontent)">+1</el-button>
                                <el-button size="small">+2</el-button>
                                <el-button size="small">+3</el-button>
                            </el-button-group>
                        </template>
                        <el-descriptions-item label="反链"><el-tag size="small">{{ info.backcount
}}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="正链"><el-tag size="small">{{ info.frontcount
}}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="命中子块"><el-tag size="small">{{ info.length }}</el-tag></el-descriptions-item>
                        <!-- <el-descriptions-item label="">按钮</el-descriptions-item> -->
                    </el-descriptions>
                </el-tooltip>
            </div>

        </el-card>

    </el-drawer>


    <el-drawer v-model="drawer2" :size=size :modal="modal">
        <template #header>
            <h4>详情</h4>
        </template>
        <template #default>

            <el-descriptions title="文件名称" :column="2" size="default" border>
                <el-descriptions-item label-align="right" label="id" :span="2">1111111</el-descriptions-item>
                <el-descriptions-item label-align="right" label="创建时间" :span="2">1111111</el-descriptions-item>
                <el-descriptions-item label-align="right" label="更新时间" :span="2">1111111</el-descriptions-item>
                <el-descriptions-item label-align="right" label="反链"><el-tag
                        size="small">12</el-tag></el-descriptions-item>
                <el-descriptions-item label-align="right" label="正链"><el-tag
                        size="small">12</el-tag></el-descriptions-item>
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