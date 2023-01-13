<template>
    <div class="card">
        <el-card class="box-card box-card1" shadow="never">
            <template #header>
                <div class="card-header">
                    <el-input v-model="input1" class="w-50 m-2" placeholder="请输入关键字，回车即触发查询" :prefix-icon="Search"
                        clearable @keyup.enter="getNodeByStr(input1)" />
                    <el-button class="button" text>close</el-button>
                </div>

            </template>
            <div class="card-header"><b>查询结果</b></div>
        </el-card>


        <el-card class="box-card box-card2" shadow="never">
            <div v-for="info in nodeLists" :key="info.id" class="text item">
                <el-tooltip class="box-item" effect="dark" :content="info.fcontent" placement="left-start">
                    <el-descriptions class="result-list" :title="info.fcontent.slice(0, 10)" :column="3" size="default">
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
// import { useToolsItem } from '../data/useToolsItem.js'
// import { Search } from '@element-plus/icons-vue'
import { fullTextSearchBlock, getBlockByID } from '../../src/utils/api.js'
import { getDocCount, getDocSort, } from '../js/base.js'
import { getAllLinks, addNode, expand1LayerOfRelationship, addEdge, nodeLight } from '../js/base.js'
import {
    Mouse,
    Search
} from "@element-plus/icons-vue";
import { useInitData } from '../data/useInitData.js';
import { useToolsItem } from '../data/useToolsItem.js';
import { config } from '../js/config.js'



</script>
<style scoped>
.card {
    position: absolute;
    right: 0;
    height: 95%;
    widows: 400px;
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
