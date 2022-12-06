
export var config = {
    token: '',
    forceGraph: {
        container: '', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: 1000, // Number，必须，图的宽度
        height: 500, // Number，必须，图的高度
        fitView: true,
        fitViewPadding: [20, 40, 50, 20],
        // workerEnabled: true,
        // plugins: [menu],
        layout: {
            // type: 'forceAtlas2',
            type: 'force',
            // center: [200,50],
            // gravity: 30,
            edgeStrength: 0.8,
            // nodeStrength: -200,
            nodeStrength: (d) => {
                if (d.isLeaf){
                    return -50;
                }return -200;
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
    },
    ignoreNote: ['20211104180818-u19xi5t'], // 全局关系图忽略笔记
    ignoteNoteBook: [], // 全局关系图忽略笔记本,没实装
    data: {
        nodes: [],
        edges: [],
        combos: []
    },
    extNodeStyle: {
        // 配色表 http://tool.c7sky.com/webcolor/
        // 橙黄蓝分别   #FFCC99 #FFFFCC  #99CCFF
        style: {
            fill: "#FFCC99",
            shadowColor: "#FFCC99",
            stroke: "#FFCC99",
        },
    },
    superNodeStyle: {
        style: {
            fill: "#FF9999",
            shadowColor: "#FF9999",
            stroke: "#FF9999",
        },
    },
    mainNodeStyle: {
        style: {
            fill: "#FF6600",
            shadowColor: "#FF6600",
            stroke: "#FF6600",
        },
    },
    queryBlockType: ['d'],  // 查询的块类型筛选，仅保留文档块，避免太多干扰信息
    dataSavePath: '/assets/graph-data',
}




