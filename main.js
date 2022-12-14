import { config, } from "./src/js/config.js"
import { getBacklink, getBlockByID, sql, } from "./src/utils/api.js"
import {
    addEdge,
    addNode,
    updateNodeTo1,
    delNodeEdge,
    getDocInfoByKey2,
    getDocCount,
    getAllLinks,
    getAllNodes,
    updateNodeToMain
} from "./src/js/base.js"
import {
    expand1LayerOfRelationship,
    expand2LayerOfRelationship,
    expand3LayerOfRelationship
} from './src/js/g6.js';











// init graph
// const container = document.getElementById('mountNode');
config.forceGraph.width = document.documentElement.clientWidth;
// config.forceGraph.width = container.scrollWidth || 1000;
config.forceGraph.height = document.documentElement.clientHeight;
// config.forceGraph.height = container.scrollHeight || 600;
config.forceGraph.container = 'mountNode';






// 节点右键菜单
const menu = new G6.Menu({
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
});



config.forceGraph.plugins = [menu]
const graph = new G6.Graph(config.forceGraph);
graph.read(config.data)

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
        let url = 'siyuan://blocks/' + id
        // let url = 'http://' + window.location.host + '/stage/build/mobile/?focus=0&editable=0&id=' + id
        // http://127.0.0.1:6806/stage/build/mobile/?focus=0&editable=0&id=20220606093400-r0y6l0z
        // siyuan://blocks/20220119105426-q3chsry
        let rr = `<ul class="list-group">
                            <li class="list-group-item"><h2 style="width:170px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;" title="${name}">${name}</h2> </li>
                            <li class="list-group-item">Id：<a href="${url}" target="_blank">${id}</a></li>
                            <li class="list-group-item">创建时间：${created}</li>
                            <li class="list-group-item">更新时间：${updated}</li>
                            <li class="list-group-item">正链数&nbsp<span class="label label-default">${frontLinkCount}</span>&nbsp&nbsp反链数&nbsp<span class="label label-default">${backLinkCount}</span></li>
                        </ul>`
        $("#detailInfo ul").remove()
        $("#detailInfo").append(rr)

    })

    // 显示右侧导航
    $('#rightNav').css("display", "flex")
    $("#tab2").click()

})



$(function () {
    // 回车查询
    $("#text").keydown(e => {
        if (e.keyCode == 13) {
            $("#btnGetNode").click()
        }
    })
    // 查询关键字获取文档
    window.getNote = function () {
        let key = document.getElementById('text').value
        // let key = "linux"
        // $(function () {
        // 移除元素
        $("#note-info li").remove()
        $("#note-info").append("<h5>&nbsp&nbsp&nbsp加载中....请稍等，如数据过大，可查看console确认是否正在执行</h4>")

        // })



        // 全文检索关键字

        getDocInfoByKey2(key).then(e => {
            // console.log("eeee",e)
            $("#note-info h5").remove()
            let divHeight = document.documentElement.clientHeight
            console.log(divHeight)
            $('#note-info').css('max-height', divHeight - 100)
            for (let doc of e) {

                let rr = `<div class="list-group-item" style="height: 70px;padding: 16px 15px;">
                        <div style="float:left;">
                            <h4 class="list-group-item-heading" id="${doc.id}" title="${doc.fcontent}" data-name="${doc.fcontent}" style="width:170px;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${doc.fcontent}</h4>
                            <p class="list-group-item-text">正链：<span class="label label-default">${doc.frontcount}</span>&nbsp&nbsp&nbsp反链：<span class="label label-default">${doc.backcount}</span></p>
                        </div>
                        <!-- 按钮下拉菜单 -->
                        <div class="dropdown" style="float:right;">
                            <button id="dLabel" type="button" class="dropdown-toggle btn btn-default glyphicon glyphicon-plus"
                                aria-hidden="true" data-toggle="dropdown" aria-haspopup="false"
                                aria-expanded="false"></button>
                            <ul class="dropdown-menu" role="menu" aria-labelledby="dLabel"
                                style="position:absolute;left: -120px;top: 32px;" >
                                <li role="presentation"><a role="menuitem" tabindex="-1">添加节点</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1">扩展一度关系笔记</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1">扩展二度关系笔记</a></li>
                                <li role="presentation"><a role="menuitem" tabindex="-1">扩展三度关系笔记</a></li>
                            </ul>
                        </div>

                    </div>`

                $('#note-info').append(rr)
            }
        })
    }



    // 往画布里面添加节点的按钮(+号按钮)
    // $("#list li").parent().prev().prop("id") // 获取当前元素的父级元素的上一个
    $("#note-info").on("click", "a", function () {
        console.log("get")
        let desc = $(this).parent().parent().parent().prev().children('h4').data("name")
        // let desc = $(this).prev().children('h4').data("name")
        let id = $(this).parent().parent().parent().prev().children('h4').prop('id')
        // let id = $(this).prev().children('h4').prop('id')
        let title = $(this).text()
        switch (title) {
            case "添加节点":
                addNode(graph, id, desc);
                break;
            case "扩展一度关系笔记":
                expand1LayerOfRelationship(id, graph)
                break;
            case "扩展二度关系笔记":
                expand2LayerOfRelationship(id, graph)
                break;
            case "扩展三度关系笔记":
                expand3LayerOfRelationship(id, graph)
                break;
        }
        // getBackLinkNode(graph,id)
    })


    // 右侧导航
    $('#rightNav-left li').click(function () {
        let _this = $(this)
        let _last = _this.siblings(".selected");
        let _selector = _last.children().attr("href");
        let _id = _this.children().attr("href");
        $(_selector).removeClass("selected");
        $(_id).addClass("selected");
        _this.addClass("selected active");
        // _this.addClass("active");
        _this.siblings("li").removeClass("active")
        _last.removeClass("selected");
    })

    // 搜索按钮
    $("#searchNote").click(function () {
        // let _this = $(this)
        $('#rightNav').css("display", "flex")
        $("#tab1").click()
        $('#text').focus()
    })

    // 右侧面板关闭
    $("#tab0").click(function () {
        $('#rightNav').css("display", "none")
    })

})




window.onload = function () {

    setTimeout(async function () {
        try {
            let nodeid = window.frameElement.parentElement.parentElement.dataset.nodeId
            await fetch(`${config.dataSavePath}/graph-${nodeid}.json`).then(res => {
                if (res.status == 404) {
                    getBlockByID(nodeid).then(async e => {
                        // addNode(graph,e.root_id,'')

                        await expand1LayerOfRelationship(e.root_id, graph)
                        await updateNodeToMain(graph, e.root_id)

                    })
                } else {
                    return res
                }
            }).then(async res => {
                // console.log(await res.json(),2222)
                graph.changeData(await res.json())
            }).catch(err => {
                console.log(err, 11111)
            })
            // getBlockByID(nodeid).then(e => {
            //     expand1LayerOfRelationship(e.root_id, graph)
            // })
        } catch (err) {
            console.warn(err);
            console.log("当前不在思源文档内部")
        }
    }, 2000) // 延时，需要等待挂件块id入库，不然getBlockByID查不到数据
}


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
window.saveData = async function () {
    let graphData = graph.save()
    let saveData = {}
    saveData.nodes = graphData.nodes
    saveData.edges = graphData.edges
    console.log("saveData", saveData)
    try {
        let nodeid = window.frameElement.parentElement.parentElement.dataset.nodeId
        let saveDataBlob = new Blob([JSON.stringify(saveData)], { type: 'application/json' })
        let 数据文件 = new File([saveDataBlob], `graphf${nodeid}.json`, { lastModified: Date.now() })
        let data = new FormData
        data.append('assetsDirPath', config.dataSavePath)
        data.append('file[]', 数据文件)
        let url = '/api/asset/upload'
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
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(saveData));
        let downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "result.json")
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }


}


// 超级节点高亮
window.getSuperNode = function () {
    // 对edges去重
    let data = graph.save()
    let nodes = data.nodes.map(e => { return { id: e.id, label: e.label } })
    for (let node of nodes) {
        let e = graph.getNodeDegree(node.id, 'all')

        // 定义节点大小
        if (e.degree <= 5) {
            node.size = 20;
        } else if (e.degree <= 20) {
            node.size = 40;
            node.style = config.superNodeStyle.style
        } else if (e.degree > 20) {
            node.size = 80;
            node.style = config.superNodeStyle.style
        } else {
            node.size = 10
            node.isLeaf = true
        }
    }
    // console.log(nodes)
    data.nodes = nodes
    graph.changeData(data)

    // console.log(e,e2)
}



window.clearGraph = function () {
    graph.clear()
}

// 展示全局关系图
window.getAllLinksToGraph = function () {

    let graphData = config.data
    if (config.showLonelyNode) {
        getAllNodes().then(nodes => {
            nodes.forEach(node => {
                let n = { id: node.id, label: node.fcontent }
                if (graphData.nodes.map(e => { return e.id }).indexOf(n.id) === -1) {
                    graphData.nodes.push(n)
                }
            });
        })
    }
    getAllLinks().then(e => {
        for (let link of e) {
            let sourceNode = { id: link.sourceId, label: link.sourceDesc }
            let targetNode = { id: link.targetId, label: link.targetDesc }
            let edge = { source: link.targetId, target: link.sourceId }
            if (graphData.nodes.map(e => { return e.id }).indexOf(sourceNode.id) === -1) {
                graphData.nodes.push(sourceNode)
            }
            if (graphData.nodes.map(e => { return e.id }).indexOf(targetNode.id) === -1) {
                graphData.nodes.push(targetNode)
            }
            if (graphData.edges.map(e => { return JSON.stringify({ source: e.source, target: e.target }) }).indexOf(JSON.stringify({ source: link.targetId, target: link.sourceId })) === -1) {
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
            if (node.value <= 5) {
                node.size = 20;
            } else if (node.value <= 20) {
                node.size = 40;
            } else if (node.value > 20) {
                node.size = 80;
            } else {
                node.size = 10
            }
        }
        console.log(2, graphData)
        // graph.read(graphData)
        graph.changeData(graphData)
    })
}

window.refreshGraph = function () {
    graph.layout();
}

// 浏览器窗口发生变化时，修改画布大小
window.onresize = function () {
    let canvasHeight = document.documentElement.clientHeight;
    let canvasWidth = document.documentElement.clientWidth;
    // console.log(canvasHeight,canvasWidth)
    graph.changeSize(canvasWidth, canvasHeight)
    // $('#note-info').css('max-height',canvasWidth-100)
}