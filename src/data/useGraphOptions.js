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