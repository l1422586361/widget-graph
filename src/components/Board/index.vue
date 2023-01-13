<template>
    <div id="mountNode"></div>
</template>
<script lang="ts" setup>
import G6 from '@antv/g6'
import {onMounted,ref} from 'vue'
import { getBlockByID } from '../../utils/api.js';
import { useGraphDataStore } from '../../store/graphdata'
import { useGraphMenu } from '../../data/useGraphMenu.js';
import { useGraphOptions } from '../../data/useGraphOptions.js'

const myGraph;
const graphData = useGraphDataStore();

function createGraph(){
    const pageWidth: Number = document.documentElement.clientWidth;
    const pageHeight: Number = document.documentElement.clientHeight;
    const contextMenu = new G6.Menu(useGraphMenu())
    myGraph = new G6.Graph(useGraphOptions('mountNode', pageWidth, pageHeight, [contextMenu]))
    myGraph.data(graphData)
    myGraph.render()
}
</script>
