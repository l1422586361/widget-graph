
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToolsItem } from '../data/toolItem.js'
import { Search } from '@element-plus/icons-vue'
let showRightWindows = ref('')
let toolItem = ref(useToolsItem())
let drawer = ref(false)
let drawer2 = ref(false)
let size = ref('400px')
let input1 = ref('')

function toggleRightWindows(str) {
    if (str === showRightWindows.value){
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


// const radio1 = ref('Option 1')

// onMounted(() => {
//     watch(() => drawer,()=>{
//         console.log(drawer)
//     })
// })

</script>

<template>
    <template class="btn-group">
        <el-button-group class="ml-4" size="default" v-for="tool in toolItem">
            <el-button v-if="tool.enable" :icon="tool.icon" @click="toggleRightWindows(tool.name)"
                :title="tool.title" />
            <!-- <el-button :icon="Share" @click="toggleRightWindows('Info')" /> -->
            <!-- <el-button type="primary" :icon="Delete" /> -->
        </el-button-group>
    </template>

    <!-- <div>
        <li v-if="showRightWindows == 'Search'">搜索窗口</li>
        <li v-if="showRightWindows == 'Info'">信息窗口</li>
    </div> -->


    <!-- <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
    with footer1
  </el-button> -->


    <el-drawer v-model="drawer" :size=size>
        <template #header>
            <h4>全局搜索</h4>
        </template>
        <template #default>
            <div>
                <el-input v-model="input1" class="w-50 m-2" placeholder="请输入关键字" :prefix-icon="Search" clearable />
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <b>查询结果</b>
                            <!-- <el-button class="button" text>Operation button</el-button> -->
                        </div>
                    </template>
                    <div v-for="o in 4" :key="o" class="text item">
                        <el-descriptions class="result-list" title="文件名称" :column="2" size="default">
                            <template #extra>
                                <el-button-group class="ml-4" size="default">
                                    <el-button size="small">+1</el-button>
                                    <el-button size="small">+2</el-button>
                                    <el-button size="small">+3</el-button>
                                </el-button-group>
                            </template>
                            <el-descriptions-item label="反链"><el-tag size="small">12</el-tag></el-descriptions-item>
                            <el-descriptions-item label="正链"><el-tag size="small">12</el-tag></el-descriptions-item>
                            <!-- <el-descriptions-item label="">按钮</el-descriptions-item> -->
                        </el-descriptions>
                    </div>

                </el-card>
            </div>
        </template>
        <template #footer>
        </template>
    </el-drawer>


    <el-drawer v-model="drawer2" :size=size>
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
</style>