<template>
    <div class="card">
        <el-card class="box-card box-card1" shadow="never">
            <template #header>
                <!-- <div class="card-header">
                    <b>详细信息</b>
                    <el-button class="button" text @click="closeWindow()">close</el-button>
                </div> -->
                <el-descriptions :title="nodeInfo.name" :column="1" size="default" border>
                    <template #extra>
                        <el-button type="defult" @click="closeWindow()">close</el-button>
                    </template>
                    <el-descriptions-item label-align="right" label="id"><el-link :href="nodeInfo.url"
                            target="_blank">{{ nodeInfo.id }}</el-link></el-descriptions-item>
                    <el-descriptions-item label-align="right" label="创建时间">{{
                        nodeInfo.created
                    }}</el-descriptions-item>
                    <el-descriptions-item label-align="right" label="更新时间">{{
                        nodeInfo.updated
                    }}</el-descriptions-item>
                </el-descriptions>
            </template>
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane :label="'被引用(' + nodeInfo.backLinkCount + ')'" name="first">
                    <!-- <el-descriptions
                        direction="vertical"
                        :column="1"
                        :size="size"
                        v-for="note in backNoteList"
                        :key="note.id"
                        border>
                        <el-descriptions-item :label="note.name"></el-descriptions-item>
                    </el-descriptions> -->

                    <div v-for="note in backNoteList" :key="note.id" class="text item" ><el-link :href="'siyuan://blocks/' + note.id" target="_blank">{{ note.name }}</el-link></div>
                </el-tab-pane>
                <el-tab-pane :label="'引用了(' + nodeInfo.frontLinkCount + ')'" name="second">
                    <div v-for="note in refNoteList" :key="note.id" class="text item" ><el-link :href="'siyuan://blocks/' + note.id" target="_blank">{{ note.name }}</el-link></div>
                    <!-- <el-descriptions
                        direction="vertical"
                        :column="1"
                        :size="size"
                        v-for="note in refNoteList"
                        :key="note.id" border>
                        <el-descriptions-item :label="note.name">{{note.id}}</el-descriptions-item>
                    </el-descriptions> -->
                </el-tab-pane>
            </el-tabs>
        </el-card>


        <!-- <el-card class="box-card box-card2" shadow="never">

        </el-card> -->
    </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from 'vue'
// import { useToolsItem } from '../data/useToolsItem.js'
// import { Search } from '@element-plus/icons-vue'
import { getBlockByID,getBacklink } from '../utils/api.js'
import { getDocCount,getFrontLinks } from '../js/base.js'
// import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')
// const handleClick = (tab: TabsPaneContext, event: Event) => {
//     console.log(tab, event)
// }

const nodeInfo = reactive({})
let refNoteList = ref([])
let backNoteList = ref([])
const props = defineProps(
    {
        activeNode: {
            type: Object,
            default: () => { },
        }
    })
const emit = defineEmits(['toggleRightWindows'])
function closeWindow() {
    emit('toggleRightWindows', 'Info')
}

async function getNodeInfo(id) {
    // let id = props.activeNode.id
    if (id) {
        await Promise.all([getBlockByID(id), getDocCount(id),getBacklink(id),getFrontLinks(id)]).then(async e => {
            nodeInfo.id = id
            nodeInfo.name = e[0].fcontent
            nodeInfo.created = e[0].created
            nodeInfo.updated = e[0].updated
            nodeInfo.frontLinkCount = e[1][0].frontcount
            nodeInfo.backLinkCount = e[1][0].backcount
            nodeInfo.url = 'siyuan://blocks/' + id

            // console.log(e[2],e[3])
            // console.log(backNoteList,refNoteList)
            // 反链汇总
            if(e[2].linkRefsCount != 0){
                backNoteList.value = e[2].backlinks
            }
            // 正链汇总
            if(e[3].length > 0){
                refNoteList.value = await e[3].map(e=>{return {id:e.targetId,name:e.targetName}})
            }
        })
        // console.log(backNoteList,refNoteList)
    }
}

// onMounted(() => {
//     getNodeInfo()
// })
watch(props.activeNode.id,()=>{
    getNodeInfo(props.activeNode.id)
},{immediate:true})


</script>
<style scoped>
.card {
    position: absolute;
    right: 0;
    height: 95%;
    /* width: 400px; */
    overflow-y: scroll;
}

el-descriptions {
    overflow-y: scroll;
    height: 70%;
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
