import { config, } from "./src/js/config.js"
import { getBacklink, getBlockByID, } from "./src/utils/api.js"
import { addEdge, addNode, updateNodeTo1, hasEdge, getBackNodeCount, getFrontLinks, getDocInfoByKey, delNodeEdge, getDocInfoByKey2, getDocCount, getAllLinks, } from "./src/js/integrate.js"



// init graph
const container = document.getElementById('mountNode');
config.forceGraph.width = container.scrollWidth || 1000;
config.forceGraph.height = container.scrollHeight || 600;
config.forceGraph.container = 'mountNode';

// 节点右键菜单
const menu = new G6.Menu({
    // https://g6.antv.vision/zh/examples/tool/contextMenu 右侧Menu配置项
    offsetX: -280,
    offsetY: -30,
    itemTypes: ['node'],
    getContent(e) {
        return `<div class="btn-group-vertical" role="group" aria-label="...">
                            <button type="button" class="btn btn-default" id="addAll">扩展所有关系</button>
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
                // 添加所有关系
                updateNodeTo1(graph, item._cfg.id)
                Promise.all([getBacklink(item._cfg.id), getFrontLinks(item._cfg.id)]).then(e => {
                    // console.log("反链", e[0])
                    if (e[0].linkRefsCount != 0) {
                        console.log(1111)
                        for (let refNode of e[0].backlinks) {
                            addNode(graph, refNode.id, refNode.name)
                            // addEdge(graph, id,refNode.id)
                            addEdge(graph, refNode.id, id)
                        }
                    }

                    for (let refNode of e[1]) {
                        addNode(graph, refNode.targetId, refNode.targetName)
                        // addEdge(graph, id,refNode.id)
                        addEdge(graph, id, refNode.targetId)
                    }
                })
            case "addBacklink":
                // 添加反链
                // console.log("addBacklink",item)
                updateNodeTo1(graph, item._cfg.id)
                getBacklink(item._cfg.id).then(res => {
                    // console.log("test", res)
                    if(res.linkRefsCount != 0){
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
});



config.forceGraph.plugins = [menu]
const graph = new G6.Graph(config.forceGraph);
graph.read(config.data)

window.refreshGraph = function(){
    graph.layout();
}


// 展示全局关系图
window.getAllLinksToGraph = function () {
    let graphData = config.data
    getAllLinks().then(e => {
        console.log(e)
        for (let link of e) {
            let sourceNode = { id: link.sourceId, label: link.sourceDesc }
            let targetNode = { id: link.targetId, label: link.targetDesc }
            let edge = { source: link.targetId, target: link.sourceId }
            if (JSON.stringify(graphData.nodes).indexOf(JSON.stringify(sourceNode)) === -1) {
                graphData.nodes.push(sourceNode)
            }
            if (JSON.stringify(graphData.nodes).indexOf(JSON.stringify(targetNode)) === -1) {
                graphData.nodes.push(targetNode)
            }
            if (JSON.stringify(graphData.edges).indexOf(JSON.stringify(edge)) === -1) {
                graphData.edges.push(edge)
            }
        }
        console.log(1, graphData)
        // 基于节点边的数量，添加样式
        for (let node of graphData.nodes) {
            let i = 0
            for (let edge of graphData.edges) {
                if (edge.source == node.id || edge.target == node.id) {
                    // if (edge.source == node.id){ // 使用反链来统计
                    i += 1
                }
            }
            node.value = i
            if (node.value <= 5) {
                node.isLeaf = true
            }
            // 定义节点大小
            if (node.value <= 10) {
                node.size = 20;
            } else if (node.value <= 20) {
                node.size = 40;
            } else if (node.value > 20) {
                node.size = 80;
            }else{
                node.size = 10
            }
        }
        console.log(2, graphData)
        // graph.read(graphData)
        graph.changeData(graphData)
    })
}
//   ---------------------------------------------
// https://g6.antv.vision/zh/examples/net/forceDirected#forceDirectedPreventOverlap 摘自力导向布局防止节点重叠
// graph.on('node:dragstart', function (e) {
//     // console.log('eee',e)
//     graph.layout();
//     refreshDragedNodePosition(e);
//   });
//   graph.on('node:drag', function (e) {
//     const forceLayout = graph.get('layoutController').layoutMethods[0];
//     forceLayout.execute();
//     refreshDragedNodePosition(e);
//   });
//   graph.on('node:dragend', function (e) {
//     e.item.get('model').fx = null;
//     e.item.get('model').fy = null;
//   });

// if (typeof window !== 'undefined')
//   window.onresize = () => {
//     if (!graph || graph.get('destroyed')) return;
//     if (!container || !container.scrollWidth || !container.scrollHeight) return;
//     graph.changeSize(container.scrollWidth, container.scrollHeight);
//   };


//   ---------------------------------------------

function refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
}



// 回车查询
$(function () {
    $("#text").keydown(e => {
        if (e.keyCode == 13) {
            $("#btnGetNode").click()
        }
    })
})

// 上传文件/导入数据
window.select_file = function () {
    $("#file").trigger("click")
}
window.importData = function (files) {
    let file = files[0]
    console.log(file)
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8")
    reader.onload = function (e) {
        let res = JSON.parse(e.target.result)
        graph.changeData(res)
    }
}

// 下载文件/保存数据
window.saveData = function () {
    let graphData = graph.save()
    let saveData = {}
    saveData.nodes = graphData.nodes
    saveData.edges = graphData.edges
    console.log("saveData", saveData)
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData));
    let downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "result.json")
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// getBacklink1 获取反链，并进行图层渲染
// window.getBacklink1 = function () {
//     const id = '20211107184955-us2ys4d'

//     // addNode(graph, id)
//     getBlockByID(id).then(function (res) {
//         addNode(graph, id, res.content)
//         getBacklink(id).then(function (res) {
//             for (let refNode of res.backlinks) {
//                 addNode(graph, refNode.id, refNode.name)
//                 addEdge(graph, id, refNode.id)
//             }
//         })
//     })

// }


// 查询关键字获取文档
import { searchDocs, fullTextSearchBlock } from "./src/utils/api.js"
window.getNote = function () {
    let key = document.getElementById('text').value
    // let key = "linux"
    $(function () {
        // 移除元素
        $("#note-info li").remove()
        $("#note-info").append("<h5>&nbsp&nbsp&nbsp加载中....请稍等，如数据过大，可查看console确认是否正在执行</h4>")
    })
    // 全文检索关键字

    getDocInfoByKey2(key).then(e => {
        // console.log("eeee",e)
        $("#note-info h5").remove()
        for (let doc of e) {
            // console.log("get",e.id)
            let rr = `<li class="list-group-item" style="height: 70px;padding: 16px 15px;">
                            <div style="float:left;">
                                <h4 class="list-group-item-heading" id="${doc.id}" title="${doc.fcontent}" data-name="${doc.fcontent}" style="width:170px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${doc.fcontent}</h4>
                                <p class="list-group-item-text">正链：<span class="label label-default">${doc.frontcount}</span>&nbsp&nbsp&nbsp反链：<span class="label label-default">${doc.backcount}</span></p>
                            </div>
                            <div type="button" class="btn btn-default" style="float:right;"><span
                                    class="glyphicon glyphicon-plus" aria-hidden="true"></span></div>

                        </li>`

            $('#note-info').append(rr)
        }
    })
}

// 往画布里面添加节点的按钮
$(function () {
    // $("#list li").parent().prev().prop("id") // 获取当前元素的父级元素的上一个
    $("#note-info").on("click", ".btn", function () {
        console.log("get")
        let desc = $(this).prev().children('h4').data("name")
        let id = $(this).prev().children('h4').prop('id')

        // console.log(11,id,22,desc,)
        addNode(graph, id, desc)
        // getBackLinkNode(graph,id)
    })
})


// 画布内节点左键单击显示详情
graph.on('node:click', (evt) => {
    let item = evt.item
    let target = evt.target
    // console.log("click", item, target)
    let id = item._cfg.id
    Promise.all([getBlockByID(id), getDocCount(id)]).then(e => {
        // console.log(e)
        let name = e[0].fcontent
        let created = e[0].created
        let updated = e[0].updated
        let frontLinkCount = e[1][0].frontcount
        let backLinkCount = e[1][0].backcount
        let url = 'http://' + window.location.host + '/stage/build/mobile/?focus=0&editable=0&id=' + id
        // http://127.0.0.1:6806/stage/build/mobile/?focus=0&editable=0&id=20220606093400-r0y6l0z
        let rr = `<ul class="list-group">
                            <li class="list-group-item"><h2>${name}</h2> </li>
                            <li class="list-group-item">Id：<a href="${url}" target="_blank">${id}</a></li>
                            <li class="list-group-item">创建时间：${created}</li>
                            <li class="list-group-item">更新时间：${updated}</li>
                            <li class="list-group-item">正链数&nbsp<span class="label label-default">${frontLinkCount}</span>&nbsp&nbsp反链数&nbsp<span class="label label-default">${backLinkCount}</span></li>
                        </ul>`
        $("#detailInfo ul").remove()
        $("#detailInfo").append(rr)

    })

})