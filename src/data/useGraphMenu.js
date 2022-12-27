export function useGraphMenu() {
    return {
        // https://g6.antv.vision/zh/examples/tool/contextMenu 右侧Menu配置项
        offsetX: 10 + 10,
        offsetY: 0,
        itemTypes: ['node'],
        getContent(e) {
            return `<div class="btn-group-vertical" role="group" aria-label="...">
                                <button type="button" class="btn btn-default" id="addAll">扩展一层关系</button>
                                <button type="button" class="btn btn-default" id="addBacklink">仅扩展反链</button>
                                <button type="button" class="btn btn-default" id="addFrontlink">仅扩展正链</button>
                                <button type="button" class="btn btn-default" id="delNodeEdge">删除此节点及关系</button>
                                `
        },
        handleMenuClick(target, item, graph) {
            // 右键菜单事件
            // console.log("右键", target, item, graph)
            let id = item._cfg.id
            // console.log(id)
            switch (target.id) {
                case "addAll":
                    // 添加一层关系
                    // updateNodeTo1(graph, item._cfg.id)
                    // getAllNoteByIdToGraph(graph, item._cfg.id)
                    // Promise.all([getBacklink(item._cfg.id), getFrontLinks(item._cfg.id)]).then(e => {
                    //     // console.log("反链", e[0])
                    //     if (e[0].linkRefsCount != 0) {
                    //         console.log(1111)
                    //         for (let refNode of e[0].backlinks) {
                    //             addNode(graph, refNode.id, refNode.name)
                    //             // addEdge(graph, id,refNode.id)
                    //             addEdge(graph, refNode.id, id)
                    //         }
                    //     }

                    //     for (let refNode of e[1]) {
                    //         addNode(graph, refNode.targetId, refNode.targetName)
                    //         // addEdge(graph, id,refNode.id)
                    //         addEdge(graph, id, refNode.targetId)
                    //     }
                    // })
                    expand1LayerOfRelationship(item._cfg.id, graph);
                case "addBacklink":
                    // 添加反链
                    // console.log("addBacklink",item)
                    updateNodeTo1(graph, item._cfg.id)
                    getBacklink(item._cfg.id).then(res => {
                        // console.log("test", res)
                        if (res.linkRefsCount != 0) {
                            for (let refNode of res.backlinks) {
                                addNode(graph, refNode.id, refNode.name)
                                // addEdge(graph, id,refNode.id)
                                addEdge(graph, refNode.id, id)

                            }
                        }



                    })
                    break;
                case "addFrontlink":
                    // 添加正链
                    updateNodeTo1(graph, item._cfg.id)
                    getFrontLinks(item._cfg.id).then(res => {
                        // console.log("test", res)
                        for (let refNode of res) {
                            addNode(graph, refNode.targetId, refNode.targetName)
                            // addEdge(graph, id,refNode.id)
                            addEdge(graph, id, refNode.targetId)
                        }
                    })
                    break;
                case "delNodeEdge":
                    // 删除节点和边
                    delNodeEdge(graph, item._cfg.id)
                    break;
            }
        },
    }
}