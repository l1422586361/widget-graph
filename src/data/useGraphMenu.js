import { getAllLinks, addNode, addEdge, delNodeEdge, getFrontLinks, expand1LayerOfRelationship, expand2LayerOfRelationship, expand3LayerOfRelationship, expand1LayerOfSubRelationship, expand2LayerOfSubRelationship, nodeLight,getFileID } from "../js/base.js";
import { config } from "../js/config.js";
import { getBacklink } from "../utils/api.js";
import { useInitData } from '../data/useInitData.js'




export function useGraphMenu() {
    return {
        // https://g6.antv.vision/zh/examples/tool/contextMenu 右侧Menu配置项
        offsetX: 10 + 10,
        offsetY: 0,
        itemTypes: ['node', 'canvas'],
        getContent(e) {
            // console(e.target,e.target.isCanvas,e.target.isCanvas())
            if (e.target && e.target.isCanvas && e.target.isCanvas()) {
                return `<ul class="list">
                            <li id="getAll">全局关系图</li>
                            <li id="Import">导入数据</li>
                            <li id="Save">保存数据</li>
                            <li id="NodeLight">超级节点高亮</li>
                            <li id="Clear">清除画布</li>
                        </ul>`
            } else if (e.item) {
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
            }

        },
        handleMenuClick(target, item, graph) {
            // 右键菜单事件
            // console.log("右键", target, item, graph)
            let data = graph.save()
            let nodeId
            let nodeDesc
            if (item != null) {
                nodeId = item._cfg.id
                nodeDesc = item._cfg.model.label
            }
            // console.log(id)
            switch (target.id) {
                case "addOneRef":
                    // console.log(target,item,graph)
                    (async () => {
                        // 标记扩展节点
                        let model = config.extNodeStyle
                        graph.updateItem(item, model)
                        await expand1LayerOfRelationship(data, nodeId, nodeDesc)
                        // console.log(data)
                        graph.changeData(data)
                    })()
                    break;
                case "addTwoRef":
                    (async () => {
                        let model = config.extNodeStyle
                        graph.updateItem(item, model)
                        await expand2LayerOfRelationship(data, nodeId, nodeDesc)
                        graph.changeData(data)
                    })()
                    break;
                case "addTwoRef":
                    (async () => {
                        let model = config.extNodeStyle
                        graph.updateItem(item, model)
                        await expand2LayerOfRelationship(data, nodeId, nodeDesc)
                        graph.changeData(data)
                    })()
                    break;
                case "addThreeRef":
                    (async () => {
                        let date = new Date()
                        console.log(date.getMinutes(), date.getSeconds())
                        let model = config.extNodeStyle
                        graph.updateItem(item, model)
                        await expand3LayerOfRelationship(data, nodeId, nodeDesc)
                        graph.changeData(data)
                        console.log(date.getMinutes(), date.getSeconds())
                    })()
                    break;
                case "addOneSub":
                    (async () => {
                        await expand1LayerOfSubRelationship(data, nodeId, nodeDesc)
                        graph.changeData(data)
                    })()
                    break;
                case "addTwoSub":
                    (async () => {
                        await expand2LayerOfSubRelationship(data, nodeId, nodeDesc)
                        graph.changeData(data)
                    })()
                    break;

                case "addBacklink":
                    (async () => {
                        // 标记扩展节点
                        let model = config.extNodeStyle
                        graph.updateItem(item, model)
                        await getBacklink(nodeId).then(async e => {
                            if (e.linkRefsCount === 0) {
                                console.log(nodeDesc, "：反链为0")
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
                    (async () => {
                        // 标记扩展节点
                        let model = config.extNodeStyle
                        graph.updateItem(item, model)
                        await getFrontLinks(nodeId).then(async e => {
                            if (e.length === 0) {
                                console.log(nodeDesc, "：正链为0")
                            }
                            for (let refNode of e) {
                                await addNode(data, { id: refNode.targetId, label: refNode.targetName })
                                await addEdge(data, { source: nodeId, target: refNode.targetId })
                            }
                        })
                        graph.changeData(data)
                    })()
                    break;
                case "delNodeEdge":
                    delNodeEdge(graph, nodeId)
                    break;


                case "getAll":
                    (async () => {
                        await getAllLinks().then(async e => {
                            // console.log(e)
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

                case "Import":
                    document.querySelector(".el-upload").click()
                    break;
                case "Save":
                    (async () => {
                        let saveData = {}
                        saveData.nodes = data.nodes
                        saveData.edges = data.edges
                        console.log("saveData", saveData)
                        try {
                            let nodeid = window.frameElement.parentElement.parentElement.dataset.nodeId
                            if(!nodeid){
                                nodeid = getFileID()
                                // console.log("fileid=====",nodeid)
                            }
                            let saveDataBlob = new Blob([JSON.stringify(saveData, function (key, value) {
                                // 处理循环引用的问题
                                if (['parent', 'model', 'canvas', 'item', 'sourceNode', 'targetNode'].indexOf(key) !== -1) {
                                    return
                                }
                                return value
                            })], { type: 'application/json' })
                            let 数据文件 = new File([saveDataBlob], `graph-${nodeid}.json`, { lastModified: Date.now() })
                            let data = new FormData
                            data.append('path', config.dataSavePath+'/'+`graph-${nodeid}.json`)
                            data.append('file', 数据文件)
                            let url = '/api/file/putFile'
                            // let filepath = ""
                            await fetch(url, {
                                body: data,
                                method: 'POST',
                                headers: { 'Authorization': `Token ${config.token}` },
                            }).then(function (response) {
                                console.log(response)
                                return response.json()
                            })
                            alert('保存成功')
                        } catch {
                            console.log(saveData)
                            let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData, function (key, value) {
                                // 处理循环引用的问题
                                if (['parent', 'model', 'canvas', 'item', 'sourceNode', 'targetNode'].indexOf(key) !== -1) {
                                    return
                                }
                                return value
                            }));
                            let downloadAnchorNode = document.createElement('a')
                            await downloadAnchorNode.setAttribute("href", dataStr);
                            await downloadAnchorNode.setAttribute("download", "result.json")
                            downloadAnchorNode.click();
                            downloadAnchorNode.remove();



                            // let blob = new Blob([JSON.stringify(saveData,function(key,value){
                            //     // 处理循环引用的问题
                            //     if(['parent','model','canvas','item','sourceNode','targetNode'].indexOf(key)  !== -1){
                            //         return
                            //     }
                            //     return value
                            // })],{ type: 'application/json' })
                            // FileSaver.saveAs(blob,`result.json`)
                        }
                    })()
                    break;
                case "NodeLight":
                    (async () => {
                        data = await nodeLight(data)
                        graph.changeData(data)
                    })()
                    break;
                case "Clear":
                    graph.changeData(useInitData())
                    break;
            }
        },
    }
}