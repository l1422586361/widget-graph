
import { getBacklink, getBlockByID, sql, fullTextSearchBlock,listDocsByPath,getBlockInfo } from "../utils/api.js"
import { config } from "./config.js";
const blockType = config.queryBlockType
const ignoreNote = config.ignoreNote.join('\',\'')
import G6 from '@antv/g6'

export async function hasNode(graphData, id) {
    // flase 不存在
    if (graphData.nodes.map(e => { return e.id }).indexOf(id) === -1) {
        return false
    } else {
        return true
    }

}

// 获取当前文档id———插件版本
// 作者：zxhd86
// 链接：https://ld246.com/article/1675844040873

export function getFileID() {
    //获取当前屏幕
    // const currentScreen = document.querySelector(".layout__wnd--active")
    const currentScreen = window.frameElement.parentElement.parentElement.parentElement.parentElement.querySelector("#layouts")
    console.log("currentScreen====",currentScreen)
    //获取当前页面
    const currentPage = currentScreen.querySelector(
        ".fn__flex-1.protyle:not(.fn__none)"
    );
    console.log("currentPage====",currentPage)
    //获取当前页面id
    const currentPageID = currentPage.querySelector(
        "span.protyle-breadcrumb__item--active"
    ).getAttribute("data-node-id");
    console.log("currentPageID====",currentPageID)
    return currentPageID;
}

export async function hasEdge(graphData, edge) {
    // flase 不存在
    if (graphData.edges.map(e => { return e.source }).indexOf(edge.source) === -1) {
        return false
    } else if (graphData.edges.map(e => { return e.target }).indexOf(edge.target) === -1) {
        return false
    } else {
        return true
    }

}


export async function addNode(graphData,node) {
    if (!await hasNode(graphData, node.id)) {
        graphData.nodes.push(node)
    }
}

export async function addEdge(graphData,edge) {
    if (!await hasEdge(graphData, edge)) {
        graphData.edges.push(edge)
    }
}

export async function expand1LayerOfRelationship(graphData,id, desc,节点标记=false) {
    let node
    if(节点标记){
        node = {id:id,label:desc,style: config.extNodeStyle.style}
    }else{
        node = { id: id, label: desc }
    }
    
    await addNode(graphData,node)
    await getAllLinks(id).then(async e => {
        // console.log(e)
        for (let link of e) {
            await addNode(graphData,{ id: link.sourceId, label: link.sourceDesc })
            await addNode(graphData,{ id: link.targetId, label: link.targetDesc })
            await addEdge(graphData,{ source: link.targetId, target: link.sourceId ,style:{
                endArrow:{
                    path: G6.Arrow.vee(10, 20, 0),
                    d: 0,
                    fill: "#FFCC99"
                }
            }})
        }
    })
    return graphData
    // console.log(props.graphData)
}


export async function expand2LayerOfRelationship(graphData,id, desc,节点标记=false) {
    let node
    if(节点标记){
        node = {id:id,label:desc,style: config.extNodeStyle.style}
    }else{
        node = { id: id, label: desc }
    }
    await addNode(graphData,node)
    await expand1LayerOfRelationship(graphData,id,desc)
    await getAllLinks(id).then(async e => {
        // console.log(e)
        for (let link of e) {
            await expand1LayerOfRelationship(graphData,link.sourceId,link.sourceDesc)
            await expand1LayerOfRelationship(graphData,link.targetId,link.targetDesc)
        }
    })
    return graphData
    // console.log(props.graphData)
}

export async function expand3LayerOfRelationship(graphData,id, desc,节点标记=false) {
    let node
    if(节点标记){
        node = {id:id,label:desc,style: config.extNodeStyle.style}
    }else{
        node = { id: id, label: desc }
    }
    await addNode(graphData,node)
    await expand1LayerOfRelationship(graphData,id,desc)
    await getAllLinks(id).then(async e => {
        // console.log(e)
        for (let link of e) {
            await expand1LayerOfRelationship(graphData,link.sourceId,link.sourceDesc)
            await expand1LayerOfRelationship(graphData,link.targetId,link.targetDesc)
            await Promise.all([getAllLinks(link.sourceId),getAllLinks(link.targetId)]).then(async e => {
                    for (let link of e[0]) {
                        await expand1LayerOfRelationship(graphData,link.sourceId,link.sourceDesc)
                        await expand1LayerOfRelationship(graphData,link.targetId,link.targetDesc)
                    }
                    for (let link of e[1]) {
                        await expand1LayerOfRelationship(graphData,link.sourceId,link.sourceDesc)
                        await expand1LayerOfRelationship(graphData,link.targetId,link.targetDesc)
                    }
            })
        }
    })

    return graphData
    // console.log(props.graphData)
}

export async function expand1LayerOfSubRelationship(graphData,id,desc){
    let node = { id: id, label: desc }
    await addNode(graphData,node)
    await getBlockInfo(id).then(async e=>{
        // console.log(e.box,e.path)
        await listDocsByPath(e.box,e.path).then(e=>{
            if(e.files.length>0){
                e.files.forEach(async note => {
                    await addNode(graphData,{ id: note.id, label: note.name.replace('.sy','') })
                    await addEdge(graphData,{ source: id, target: note.id})
                })
            }
        })
    })
    return graphData
}


export async function expand2LayerOfSubRelationship(graphData,id,desc){
    let node = { id: id, label: desc }
    await addNode(graphData,node)
    await expand1LayerOfSubRelationship(graphData,id,desc)
    await getBlockInfo(id).then(async e=>{
        // console.log(e)
        await listDocsByPath(e.box,e.path).then(async e=>{
            if(e.files.length>0){
                for(let note of e.files){
                    await expand1LayerOfSubRelationship(graphData,note.id,note.name.replace('.sy',''))
                }
            }
        })
    })
    return graphData
}


export async function getAllLinks(id) {
    // 加id获取所有基于id的note
    // 不加id获取全局关系
    let type = blockType.join('\',\'')
    let 条件 = ''
    // let ignoreNote = config.ignoreNote.join('\',\'')
    if (id) {
        条件 = `and (t1.def_block_id = '${id}' or t1.root_id = '${id}')`
    }
    if (type) {
        条件 += `and t2.type in ('${type}') and t3.type in ('${type}')`
    }
    if (ignoreNote) {
        条件 += `and t1.def_block_id not in ('${ignoreNote}') and t1.root_id not in ('${ignoreNote}')`
    }
    let sqldata = `select t2.box as sourceBox,t3.box as targetBox,t1.def_block_id as sourceId,t2.fcontent as sourceDesc,t1.root_id as targetId,t3.fcontent as targetDesc,count(*) as count from refs t1
    left join blocks t2 on t1.def_block_id = t2.id
    LEFT JOIN blocks t3 on t1.root_id = t3.id
    where  1=1 ${条件}
    GROUP BY t1.def_block_id,t1.root_id
    ;`
    // console.log(sqldata)
    return await sql(sqldata).then(res => {
        // console.log(res)
        return res
    })
}


export async function getDocSort(arr) {
    // 获取nodeid组，返回排序后的文档块信息列表
    let str = arr.join('\',\'')
    let type = blockType.join('\',\'')
    let sqldata = `select t1.id,t1.fcontent,IFNULL(t2.backcount,0) as backcount,ifnull(t3.frontcount,0) as frontcount from blocks t1
    left join ( select def_block_id as id,count(distinct root_id) as backcount from refs
 where root_id in (select id from blocks where type in ('${type}'))
  GROUP BY def_block_id) t2 on t1.id = t2.id
    left join (select root_id as id,count(distinct def_block_id) as frontcount from refs 
where def_block_id in (select id from blocks where type in ('${type}'))
 GROUP BY root_id) t3 on t1.id = t3.id
    where t1.type in ('${type}') and t1.id in ('${str}')
    ORDER BY IFNULL(t2.backcount,0) desc,ifnull(t3.frontcount,0) desc;`
    // console.log('sql',sqldata)
    return await sql(sqldata).then(res => {
        // console.log(res)
        // console.log(sqldata)
        return res
    }).catch(err => {
        console.log("getDocSort", err)
    })
}


export async function getDocCount(id) {
    // 获取nodeid组，返回排序后的文档块信息列表
    let type = blockType.join('\',\'')
    let sqldata = `select t1.id,t1.fcontent,IFNULL(t2.backcount,0) as backcount,ifnull(t3.frontcount,0) as frontcount from blocks t1
    left join ( select def_block_id as id,count(distinct root_id) as backcount from refs
 where root_id in (select id from blocks where type in ('${type}'))
  GROUP BY def_block_id) t2 on t1.id = t2.id
    left join (select root_id as id,count(distinct def_block_id) as frontcount from refs 
where def_block_id in (select id from blocks where type in ('${type}'))
 GROUP BY root_id) t3 on t1.id = t3.id
    where t1.type = 'd' and t1.id ='${id}';`
    return await sql(sqldata).then(res => {
        // console.log(res)
        // console.log(sqldata)
        return res
    }).catch(err => {
        console.log("getDocSort", err)
    })
}

export async function nodeLight(graphData){
    // 高亮节点
    let nodesNew = []
    let nodesIds = graphData.nodes.map(e => { return e.id })
    let ids = nodesIds.join('\',\'')
    let type = blockType.join('\',\'')
    let sqldata = `select t1.id,t1.fcontent,IFNULL(t2.backcount,0) as backcount,ifnull(t3.frontcount,0) as frontcount from blocks t1
    left join ( select def_block_id as id,count(distinct root_id) as backcount from refs
 where root_id in (select id from blocks where type in ('${type}'))
  GROUP BY def_block_id) t2 on t1.id = t2.id
    left join (select root_id as id,count(distinct def_block_id) as frontcount from refs 
where def_block_id in (select id from blocks where type in ('${type}'))
 GROUP BY root_id) t3 on t1.id = t3.id
    where t1.type = 'd' and t1.id in ('${ids}');`
    return await sql(sqldata).then(e => {
        e.forEach(n=>{
            let node = {id:n.id,label:n.fcontent,backcount:n.backcount,frontcount:n.frontcount}
            // 定义节点大小
            if(node.backcount + node.frontcount <=1){
                node.isLeaf = true;
                node.size = 10;
            }else if(node.backcount  + node.frontcount<=5){
                node.size=20;
            }else if(node.backcount + node.frontcount<=20){
                node.size=40
                node.style=config.superNodeStyle.style
            }else if(node.backcount + node.frontcount>20){
                node.size=80
                node.style=config.superNodeStyle.style
            }
            nodesNew.push(node)
        })
        graphData.nodes = nodesNew
        return graphData
    }).catch(err => {
        console.log("nodeLight", err)
    })
}


export async function delNodeEdge(obj,nodeid){
    let data = obj.save()
    let dataNew = {nodes: [],edges: [],combos: []}
    let delnodeIds = []
    let deledgeIds = []
    delnodeIds.push(nodeid)
    // 查出所有的正链连线
    let itemEdgeFront = obj.findAll('edge', (e) => {
        return e.get('model').source == nodeid;  // source一样
    })
    // 查出所有的反链连线
    let itemEdgeBack = obj.findAll('edge', (e) => {
        return e.get('model').target == nodeid;   // target一样
    })

    // 提取所有正链连线ID，判断对面的nodeID是否删除
    if (itemEdgeFront.length != 0) {
        for (let edge of itemEdgeFront) {
            deledgeIds.push(edge._cfg.id)
            // console.log(edge._cfg.model.target)
            // console.log(obj.getNodeDegree(edge._cfg.model.target),delnodeIds.indexOf(edge._cfg.model.target))
            if(obj.getNodeDegree(edge._cfg.model.target) == 1 && delnodeIds.indexOf(edge._cfg.model.target) == -1){
                // 对面node总度数为1且为加入到待删除节点中
                delnodeIds.push(edge._cfg.model.target)
            }
        }
    }
    // 提取所有反链连线ID，判断对面的nodeID是否删除
    if (itemEdgeBack.length != 0) {
        for (let edge of itemEdgeBack) {
            // console.log(edge)
            deledgeIds.push(edge._cfg.id)
            if(obj.getNodeDegree(edge._cfg.model.source) == 1 && delnodeIds.indexOf(edge._cfg.model.source) == -1){
                // 对面node总度数为1且为加入到待删除节点中
                // console.log(123,delnodeIds.indexOf(edge._cfg.model.source) != -1)
                delnodeIds.push(edge._cfg.model.source)
            }
        }
    }
    // console.log('del',delnodeIds,deledgeIds)
    data.edges.forEach(e=>{
        // console.log(e.source,e.target,delnodeIds.indexOf(e.source)==-1, delnodeIds.indexOf(e.target)==-1)
        if(delnodeIds.indexOf(e.source)==-1 && delnodeIds.indexOf(e.target)==-1){
            dataNew.edges.push(e)
        }
    })
    data.nodes.forEach(e=>{
        if(delnodeIds.indexOf(e.id)==-1){
            dataNew.nodes.push(e)
        }
    })
    obj.changeData(dataNew)
}


export async function getFrontLinks(nodeid) {
    // 获取正链链接
    //  sourceName sourceId targetName targetId times
    let type = blockType.join('\',\'')
    let sqldata = `select 
    t3.content as sourceName , t3.id as sourceId , t1.content as targetName , t1.id as targetId, count(t1.id) as times
    from blocks t1
    join refs t2 on t1.id = t2.def_block_id  -- 文档id与其引用块id ，可以通过refs里的不同id字段查询blocks里的对应信息
    join blocks t3 on t3.id = t2.root_id     -- 引用块root_id 与其信息
    where t1.type in ('${type}') and t3.id = '${nodeid}'
    group by t1.id,t3.id;`
    // console.log(sqldata)
    return await sql(sqldata).then(res => {
        // console.log(res)
        return res
    })
}