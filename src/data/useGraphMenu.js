import { getAllLinks, addNode, addEdge, delNodeEdge,getFrontLinks,expand1LayerOfRelationship,expand2LayerOfRelationship,expand3LayerOfRelationship,expand1LayerOfSubRelationship,expand2LayerOfSubRelationship } from "../js/base.js";
import { config } from "../js/config.js";
import { getBacklink } from "../utils/api.js";




export function useGraphMenu() {
    return {
        // https://g6.antv.vision/zh/examples/tool/contextMenu 右侧Menu配置项
        offsetX: 10 + 10,
        offsetY: 0,
        itemTypes: ['node'],
        getContent(e) {
            return `<ul class="list">
            <li>扩展引用关系
                <ul class="g6-component-contextmenu">
                    <li id="addOneRef">扩展1层引用</li>
                    <li id="addTwoRef">扩展2层引用</li>
                    <!-- <li id="addThreeRef">扩展3层引用</li> 加载较长时间且不适用-->
                </ul>
            </li>
            <li>扩展文件树子级
                <ul class="g6-component-contextmenu">
                    <li id="addOneSub">扩展子1级</li>
                    <li id="addTwoSub">扩展子2级</li>
                </ul>
            </li>
            <li id="addBacklink">仅扩展反链</li>
            <li id="addFrontlink">仅扩展正链</li>
            <li id="delNodeEdge">删除此节点及关系</li>
        </ul>`
        },
        handleMenuClick(target, item, graph) {
            // 右键菜单事件
            // console.log("右键", target, item, graph)
            let data = graph.save()
            let nodeId = item._cfg.id
            let nodeDesc = item._cfg.model.label
            // console.log(id)
            switch (target.id) {
                case "addOneRef":
                    // console.log(target,item,graph)
                    (async () => {
                        // 标记扩展节点
                        let model = config.extNodeStyle
                        graph.updateItem(item,model)
                        await expand1LayerOfRelationship(data,nodeId,nodeDesc)
                        // console.log(data)
                        graph.changeData(data)
                    })()
                    break;
                case "addTwoRef":
                    (async ()=>{
                        let model = config.extNodeStyle
                        graph.updateItem(item,model)
                        await expand2LayerOfRelationship(data,nodeId,nodeDesc)
                        graph.changeData(data)
                    })()
                    break;
                case "addTwoRef":
                    (async ()=>{
                        let model = config.extNodeStyle
                        graph.updateItem(item,model)
                        await expand2LayerOfRelationship(data,nodeId,nodeDesc)
                        graph.changeData(data)
                    })()
                    break;
                case "addThreeRef":
                    (async ()=>{
                        let date = new Date()
                        console.log(date.getMinutes(),date.getSeconds())
                        let model = config.extNodeStyle
                        graph.updateItem(item,model)
                        await expand3LayerOfRelationship(data,nodeId,nodeDesc)
                        graph.changeData(data)
                        console.log(date.getMinutes(),date.getSeconds())
                    })()
                    break;
                case "addOneSub":
                    (async ()=>{
                        await expand1LayerOfSubRelationship(data,nodeId,nodeDesc)
                        graph.changeData(data)
                    })()
                    break;
                case "addTwoSub":
                    (async ()=>{
                        await expand2LayerOfSubRelationship(data,nodeId,nodeDesc)
                        graph.changeData(data)
                    })()
                    break;

                case "addBacklink":
                    (async () => {
                        // 标记扩展节点
                        let model = config.extNodeStyle
                        graph.updateItem(item,model)
                        await getBacklink(nodeId).then(async e => {
                            if(e.linkRefsCount === 0){
                                console.log(nodeDesc,"：反链为0")
                            }
                            if (e.linkRefsCount != 0) {
                                for (let refNode of e.backlinks) {
                                    await addNode(data, { id: refNode.id, label: refNode.name })
                                    await addEdge(data, { source: refNode.id, target: nodeId })
                                }

                            }
                        })
                        graph.changeData(data)
                    })()
                    break;
                case "addFrontlink":
                    (async ()=>{
                        // 标记扩展节点
                        let model = config.extNodeStyle
                        graph.updateItem(item,model)
                        await getFrontLinks(nodeId).then(async e=>{
                            if(e.length === 0){
                                console.log(nodeDesc,"：正链为0")
                            }
                            for (let refNode of e){
                                await addNode(data,{id:refNode.targetId,label:refNode.targetName})
                                await addEdge(data,{source:nodeId,target:refNode.targetId})
                            }
                        })
                        graph.changeData(data)
                    })()
                    break;
                case "delNodeEdge":
                    delNodeEdge(graph,nodeId)
                    break;
            }
        },
    }
}