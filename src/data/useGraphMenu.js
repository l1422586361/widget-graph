import { getAllLinks, addNode, addEdge, delNodeEdge,getFrontLinks } from "../js/base.js";
import { getBacklink } from "../utils/api.js";
export function useGraphMenu() {
    return {
        // https://g6.antv.vision/zh/examples/tool/contextMenu 右侧Menu配置项
        offsetX: 10 + 10,
        offsetY: 0,
        itemTypes: ['node'],
        getContent(e) {
            return `<ul class="list">
            <li id="addAll">扩展一层关系</li>
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
                case "addAll":
                    // console.log(target,item,graph)
                    (async () => {
                        let node = { id: nodeId, label: nodeDesc }
                        await addNode(data, node)
                        await getAllLinks(nodeId).then(async e => {
                            for (let link of e) {
                                let sourceNode = { id: link.sourceId, label: link.sourceDesc }
                                let targetNode = { id: link.targetId, label: link.targetDesc }
                                let edge = { source: link.targetId, target: link.sourceId }
                                await addNode(data, sourceNode)
                                await addNode(data, targetNode)
                                await addEdge(data, edge)
                            }
                        })
                        graph.changeData(data)
                    })()
                    break;
                case "addBacklink":
                    (async () => {
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