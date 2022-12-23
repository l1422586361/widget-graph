export { 画布数据, 画布配置 }

let 画布数据 = {
    // 点集
    nodes: [
        {
            id: 'node1', // String，该节点存在则必须，节点的唯一标识
            label: '11111',
            x: 100, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
        },
        {
            id: 'node2', // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
        },
    ],
    // 边集
    edges: [
        {
            source: 'node1', // String，必须，起始点 id
            target: 'node2', // String，必须，目标点 id
        },
    ],
}

let 画布配置 = {
    container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
    width: 800, // Number，必须，图的宽度
    height: 500, // Number，必须，图的高度
}

export function useGraphOptions(container, width, height, plugins) {
    return {
        container: container, // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: width, // Number，必须，图的宽度
        height: height, // Number，必须，图的高度
        // fitView: true,
        fitViewPadding: [20, 40, 50, 20],
        // workerEnabled: true,
        plugins,
        layout: {
            // type: 'forceAtlas2',
            type: 'force',
            // center: [200,50],
            // gravity: 30,
            edgeStrength: 0.8,
            // nodeStrength: -200,
            nodeStrength: (d) => {
                if (d.isLeaf) {
                    return -50;
                } return -200;
            },
            preventOverlap: true,
            // nodeSpacing: 200,
            linkDistance: 150,
            // type: predictLayout, 智能布局推荐
            // clustering: true,
        },
        defaultNode: {
            size: 30,
            labelCfg: {
                style: {
                    fontsize: 1,
                },
                position: 'bottom',
            }
        },
        defaultEdge: {
            style: {
                endArrow: true,
            },
            // type: 'cubic-horizontal',
            type: 'line',
        },
        // fitView: true,
        modes: {
            default: ['drag-canvas', 'zoom-canvas', 'click-select', 'drag-node', 'activate-relations'],
        }
    }
}

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