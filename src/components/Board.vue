<script setup>
import G6 from '@antv/g6'
// import {

// } from '/src/utils/api.js'
import { onMounted, provide, watch, ref, reactive } from 'vue';
import {
    画布数据, 画布配置
} from '../data/config.js';


let myGraph
let data



onMounted(() => {
    createGraph()
    watch(() => data, () => {
        // 监听画布数据
        // console.log(123, data)
        myGraph.changeData(data)
    },
        { deep: true }
    )
})





const createGraph = () => {
    // const container = this.container
    data = reactive(画布数据)
    myGraph = new G6.Graph(画布配置)
    myGraph.data(data)
    myGraph.render()
    // this.myGraph = myGraph || null
}






</script>
<template>
    <div id="mountNode">
        <!-- <aButton @click="clickE()"></aButton> -->
        <!-- <button @click="toggleSearch">测试搜索</button>
        <button @click="toggleInfo">测试信息</button> -->
    </div>
</template>

<style scoped>
.info {
    height: 26px;
    width: auto;
    color: aliceblue;
}
</style>