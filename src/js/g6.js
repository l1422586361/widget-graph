import { setArrToJson,getAllLinks } from "./base.js"

// 扩展笔记关系
export async function expand1LayerOfRelationship(id, obj) {
    // 扩展一层关系渲染到图里
    let nodes = []
    let edges = []
    let res1 = await getAllLinks(id)
    for (let e1 of res1) { // 第一层
        setArrToJson(e1, nodes, edges)
    }
    console.log(nodes, edges)
    let data = obj.save()
    let allNodes = data.nodes.map(e => { return { id: e.id } })
    let allEdges = data.edges.map(e => { return { source: e.source, target: e.target } })
    // console.log(122, allNodes, allEdges)
    for (let node of nodes) {
        if (allNodes.map(e => { return e.id }).indexOf(node.id) === -1) {
            // console.log(allNodes.map(e=>{return e.id}),node.id)
            allNodes.push(node)
        }
    }
    for (let edge of edges) {
        if (allEdges.map(e => { return JSON.stringify({ source: e.source, target: e.target }) }).indexOf(JSON.stringify({ source: edge.source, target: edge.target })) === -1) {
            // console.log(allEdges.map(e=>{return { source: e.source, target: e.target }}),{source: edge.source, target: edge.target })
            allEdges.push(edge)
        }
    }
    data.nodes = allNodes; data.edges = allEdges
    console.log(data)
    obj.changeData(data)
}


export  async function expand2LayerOfRelationship(id, obj) {
    let nodes = []
    let edges = []
    let res1 = await getAllLinks(id)
    for (let e1 of res1) { // 第一层
        setArrToJson(e1, nodes, edges)
        if (e1.sourceId != id) {
            let res2 = await getAllLinks(e1.sourceId)
            for (let e2 of res2) { // 第二层
                setArrToJson(e2, nodes, edges)
            }
        }
        if (e1.targetId != id) {
            let res2 = await getAllLinks(e1.targetId)
            for (let e2 of res2) { // 第二层
                setArrToJson(e2, nodes, edges)
            }
        }
    }
    console.log(nodes, edges)
    let data = obj.save()
    let allNodes = data.nodes.map(e => { return { id: e.id } })
    let allEdges = data.edges.map(e => { return { source: e.source, target: e.target } })
    // console.log(122, allNodes, allEdges)
    for (let node of nodes) {
        if (allNodes.map(e => { return e.id }).indexOf(node.id) === -1) {
            // console.log(allNodes.map(e=>{return e.id}),node.id)
            allNodes.push(node)
        }
    }
    for (let edge of edges) {
        if (allEdges.map(e => { return JSON.stringify({ source: e.source, target: e.target }) }).indexOf(JSON.stringify({ source: edge.source, target: edge.target })) === -1) {
            // console.log(allEdges.map(e=>{return { source: e.source, target: e.target }}),{source: edge.source, target: edge.target })
            allEdges.push(edge)
        }
    }
    data.nodes = allNodes; data.edges = allEdges
    console.log(data)
    obj.changeData(data)
}


export async function expand3LayerOfRelationship(id, obj) {
    let nodes = []
    let edges = []
    let res1 = await getAllLinks(id)
    for (let e1 of res1) {  // 第一层
        setArrToJson(e1, nodes, edges)
        if (e1.sourceId != id) {
            let res2 = await getAllLinks(e1.sourceId)
            for (let e2 of res2) { // 第二层
                setArrToJson(e2, nodes, edges)
                if (e2.sourceId != e1.sourceId) {
                    let res3 = await getAllLinks(e2.sourceId)
                    for (let e3 of res3) { // 第三层
                        setArrToJson(e3, nodes, edges)
                    }
                }
                if (e2.targetId != e1.sourceId) {
                    let res3 = await getAllLinks(e2.targetId)
                    for (let e3 of res3) { // 第三层
                        setArrToJson(e3, nodes, edges)
                    }
                }
            }
        }
        if (e1.targetId != id) {
            let res2 = await getAllLinks(e1.targetId)
            for (let e2 of res2) {  // 第二层
                setArrToJson(e2, nodes, edges)
                if (e2.sourceId != e1.targetId) {
                    let res3 = await getAllLinks(e2.sourceId)
                    for (let e3 of res3) { // 第三层
                        setArrToJson(e3, nodes, edges)
                    }
                }
                if (e2.targetId != e1.targetId) {
                    let res3 = await getAllLinks(e2.targetId)
                    for (let e3 of res3) { // 第三层
                        setArrToJson(e3, nodes, edges)
                    }
                }
            }
        }
    }
    console.log(nodes, edges)
    let data = obj.save()
    let allNodes = data.nodes.map(e => { return { id: e.id } })
    let allEdges = data.edges.map(e => { return { source: e.source, target: e.target } })
    console.log(122, allNodes, allEdges)
    for (let node of nodes) {
        if (allNodes.map(e => { return e.id }).indexOf(node.id) === -1) {
            // console.log(allNodes.map(e=>{return e.id}),node.id)
            allNodes.push(node)
        }
    }
    for (let edge of edges) {
        if (allEdges.map(e => { return JSON.stringify({ source: e.source, target: e.target }) }).indexOf(JSON.stringify({ source: edge.source, target: edge.target })) === -1) {
            // console.log(allEdges.map(e=>{return { source: e.source, target: e.target }}),{source: edge.source, target: edge.target })
            allEdges.push(edge)
        }
    }
    data.nodes = allNodes; data.edges = allEdges
    console.log(data)
    obj.changeData(data)
}