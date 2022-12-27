
<script setup>
import { ref, onMounted, watch,defineProps,defineEmits } from 'vue'
import { useToolsItem } from '../data/useToolsItem.js'
import { Search } from '@element-plus/icons-vue'
import { fullTextSearchBlock } from '../utils/api.js'
import { getDocSort } from '../js/base.js'
let showRightWindows = ref('')
let toolItem = ref(useToolsItem())
let drawer = ref(false)
let drawer2 = ref(false)
let modal = ref(false) // 窗口遮罩
let size = ref('400px')
let input1 = ref('')
const nodeInfos = ref([]) // 关键字查询结果


defineEmits(['addNode'])




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
        let nodeIds = []
        for (let doc of e.blocks) {
            nodeIds.push(doc.id)
        }
        nodeInfos.value = await getDocSort(nodeIds)
        // console.log(nodeInfos)
    })
}



</script>

<template>
    <template class="btn-group">
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
                    <el-descriptions class="result-list" :title="info.fcontent.slice(0, 15) + '...'" :column="2"
                        size="default">
                        <template #extra>
                            <el-button-group class="ml-4" size="default">
                                <el-button size="small" @click="$emit('addNode',info.id,info.fcontent)">+1</el-button>
                                <el-button size="small">+2</el-button>
                                <el-button size="small">+3</el-button>
                            </el-button-group>
                        </template>
                        <el-descriptions-item label="反链"><el-tag size="small">{{ info.backcount
                        }}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="正链"><el-tag size="small">{{ info.frontcount
                        }}</el-tag></el-descriptions-item>
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