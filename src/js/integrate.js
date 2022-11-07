
// 引入模块

import { getBacklink, getBlockByID, sql, fullTextSearchBlock, } from "../utils/api.js"
import { config } from "./config.js";
const blockType = config.queryBlockType


// ------------ g6引擎封装函数 -----------

export async function hasNode(obj, id) {
    // 判断是否已有节点
    let findNode = obj.find('node', (node) => {
        return node.get('model').id === id;
    });
    // console.log("findNode", findNode)
    if (findNode === undefined) {
        return false
    } else {
        return true
    }
}

export async function hasEdge(obj, source_id, target_id) {
    // 判断是否已有边
    let findEdge = obj.find('edge', (edge) => {
        return (edge.get('model').source === source_id && edge.get('model').target === target_id);
    });
    // console.log("findEdge", findEdge)
    if (findEdge === undefined) {
        return false
    } else {
        return true
    }
}


export async function addNode(obj, id, desc) {
    // 增加普通节点
    let nodeInfo = { id: id, label: desc }
    var value = await hasNode(obj, id)
    if (value === false) {
        // console.log("添加节点",Date(),nodeInfo)
        obj.addItem('node', nodeInfo)
        sender(obj)
    }

}

export async function updateNodeTo1(obj, id) {
    // 修改节点样式
    
    let item = obj.findById(id)
    // console.log("updateNodeTo1",item)
    let model = config.extNodeStyle
    obj.updateItem(item,model)

}


// 增加关系
export async function addEdge(obj, source_id, target_id) {
    let edgeInfo = { source: source_id, target: target_id }
    var value = await hasEdge(obj, source_id, target_id)
    if (value === false) {
        // console.log("添加边",Date(),edgeInfo)
        obj.addItem('edge', edgeInfo)
        // obj.layout()
        sender(obj)

    }

}

// 重载数据渲染
export async function sender(obj) {
    // console.log(obj.save())
    // obj.layout(obj.save())
    obj.changeData(obj.save())
}


// ------------ g6引擎封装函数 -----------


// ------------ 页面主体方法 -----------

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

export async function getBackLinkNode(obj, nodeid) {
    // obj: graph
    // nodeid: 笔记本ID
    // 基于笔记本id增加反链节点
    getBlockByID(nodeid).then(function (res) {
        addNode(obj, nodeid, res.content)
        getBacklink(nodeid).then(function (res) {
            for (let refNode of res.backlinks) {
                addNode(obj, refNode.id, refNode.name)
                addEdge(obj, nodeid, refNode.id)
            }
        })
    })
}

export async function getBackNodeCount(nodeid) {
    // 统计反链计数
    // 弃用，未筛选不含d的文档块
    return getBacklink(nodeid).then(e => {
        // console.log(e.mentionsCount)
        return e.linkRefsCount;
    }).catch(err => {
        console.log(err)
        return 0
    })
}





// ------------ 页面主体方法 -----------




// ------------ 思源方法 -----------

export async function getAllLinks(){
    let type = blockType.join('\',\'')
    let sqldata = `select t1.def_block_id as sourceId,t2.fcontent as sourceDesc,t1.root_id as targetId,t3.fcontent as targetDesc,count(*) as count from refs t1
    left join blocks t2 on t1.def_block_id = t2.id
    LEFT JOIN blocks t3 on t1.root_id = t3.id
    where t2.type in ('${type}') and t3.type in ('${type}')
    GROUP BY t1.def_block_id,t1.root_id
    ;`
    return await sql(sqldata).then(res => {
        // console.log(res)
        return res
    })
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


export async function getDocSort(arr) {
    // 获取nodeid组，返回排序后的文档块信息列表
    let str = arr.join('\',\'')
    let type = blockType.join('\',\'')
    let sqldata = `select t1.id,t1.fcontent,IFNULL(t2.backcount,0) as backcount,ifnull(t3.frontcount,0) as frontcount from blocks t1
    left join ( select def_block_id as id,count(root_id) as backcount from refs
 where root_id in (select id from blocks where type in ('${type}'))
  GROUP BY def_block_id) t2 on t1.id = t2.id
    left join (select root_id as id,count(def_block_id) as frontcount from refs 
where def_block_id in (select id from blocks where type in ('${type}'))
 GROUP BY root_id) t3 on t1.id = t3.id
    where t1.type in ('${type}') and t1.id in ('${str}')
    ORDER BY IFNULL(t2.backcount,0) desc,ifnull(t3.frontcount,0) desc;`
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
    left join ( select def_block_id as id,count(root_id) as backcount from refs
 where root_id in (select id from blocks where type in ('${type}'))
  GROUP BY def_block_id) t2 on t1.id = t2.id
    left join (select root_id as id,count(def_block_id) as frontcount from refs 
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


function up(x, y) {
    // 按backCount倒序，用于getDocInfoByKey方法排序
    return y.backCount - x.backCount
}

export async function getDocInfoByKey(k) {
    // 弃用，等同步排序，加载起来太慢
    return await fullTextSearchBlock(k).then(async e => {
        var result = []
        for (let doc of e.blocks) {
            try {
                doc.backCount = await getBackNodeCount(doc.id);
                doc.frontCount = await getFrontLinks(doc.id).then(async e => { return await e.length });
                result.push(doc)
            } catch (err) {
                console.log(err)
            }

            console.log("doc", doc)
        }
        // console.log("result",result)
        return result
    }).then(e => {
        // console.log(222,e.sort(up))
        return e.sort(up)
    })
}


export async function getDocInfoByKey2(k) {
    // 根据关键字获取doc信息
    return await fullTextSearchBlock(k).then(e => {
        let arr = []
        for (let doc of e.blocks) {
            arr.push(doc.id)
        }
        return getDocSort(arr)
    })
}




// ------------ 思源方法 -----------