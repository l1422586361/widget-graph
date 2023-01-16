
import { getBacklink, getBlockByID, sql, fullTextSearchBlock, } from "../utils/api.js"
import { config } from "./config.js";
const blockType = config.queryBlockType
const ignoreNote = config.ignoreNote.join('\',\'')

export async function hasNode(graphData, id) {
    // flase 不存在
    if (graphData.nodes.map(e => { return e.id }).indexOf(id) === -1) {
        return false
    } else {
        return true
    }

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

export async function expand1LayerOfRelationship(graphData,id, desc) {
    let node = { id: id, label: desc }
    await addNode(graphData,node)
    await getAllLinks(id).then(async e => {
        // console.log(e)
        for (let link of e) {
            let node1 = { id: link.sourceId, label: link.sourceDesc }
            let node2 = { id: link.targetId, label: link.targetDesc }
            let edge = { source: link.sourceId, target: link.targetId }
            await addNode(graphData,node1)
            await addNode(graphData,node2)
            await addEdge(graphData,edge)
        }
    })
    // console.log(props.graphData)
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



export async function delNodeEdge(obj, nodeid) {
    let itemNode = obj.findById(nodeid);
    obj.removeItem(itemNode);
    let item = []
    let itemEdgeFront = obj.findAll('edge', (e) => {
        // 正链
        return e.get('model').source == nodeid;
    })
    let itemEdgeBack = obj.findAll('edge', (e) => {
        // 反链
        return e.get('model').target == nodeid;
    })
    // console.log(itemNode, itemEdgeBack, itemEdgeFront)
    if (itemEdgeFront.length != 0) {
        for (let edge of itemEdgeFront) {
            item.push(edge._cfg.id)
        }
    }
    if (itemEdgeBack.length != 0) {
        for (let edge of itemEdgeFront) {
            item.push(edge._cfg.id)
        }
    }
    // console.log("item",item)
    for (let id of item) {
        // 删除涉及需删除节点的边
        obj.removeItem(obj.findById(id));
    }

    // console.log(obj.save())
    clearInvalidNodes(obj)

}


export async function clearInvalidNodes(obj) {
    // 清除画布上无连线的节点
    let nodeIds = []
    let edgeIds = []
    console.log(obj.getNodes(), obj.getEdges())
    for (let e of obj.getNodes()) {
        nodeIds.push(e._cfg.id)
    }
    for (let e of obj.getEdges()) {
        edgeIds.push(e._cfg.model.source)
        edgeIds.push(e._cfg.model.target)
    }
    console.log("node,edge", nodeIds, edgeIds)
    for (let nodeid of nodeIds) {
        console.log(nodeid)
        if (edgeIds.indexOf(nodeid) == -1) {
            obj.removeItem(obj.findById(nodeid));
        }
    }
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