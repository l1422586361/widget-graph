
export var config = {
    token: '',
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
    queryBlockType: ['d'],  // 查询的块类型筛选，仅保留文档块，避免太多干扰信息
    dataSavePath: '/assets/graph-data',
}




