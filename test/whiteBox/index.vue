<script setup lang="ts">
import G6 from '@antv/g6'
import { ref, onMounted } from 'vue'

const data = {
  // 点集
  nodes: [
    {
      id: 'node1', // String，该节点存在则必须，节点的唯一标识
      x: 100, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
      label:'1',
    },
    {
      id: 'node2', // String，该节点存在则必须，节点的唯一标识
      x: 300, // Number，可选，节点位置的 x 值
      y: 200, // Number，可选，节点位置的 y 值
      label:'2',
    },
  ],
  // 边集
  edges: [
    {
      source: 'node1', // String，必须，起始点 id
      target: 'node2', // String，必须，目标点 id
    },
  ],
};

function createGraph() {
    G6.registerNode('L-rect',{
      // 添加文本节点
      drawText (cfg, group) {
        group.addShape('text', {
          attrs: {
            text:         cfg.label,
            fill:         '#fff',
            fontSize:     14,
            textAlign:    'center',
            textBaseline: 'middle',
            ...cfg.labelCfg.style,
          },
          className: 'node-text',
          draggable: true,
        });
      },
      // 添加锚点
      drawAnchor (cfg, group) {
        const item = group.get('children')[0];
        const bBox = item.getBBox();
        const anchors = this.getAnchorPoints(cfg);

        // 绘制锚点坐标
        anchors && anchors.forEach((p, i) => {
          const x = bBox.width * (p[0] - 0.5);
          const y = bBox.height * (p[1] - 0.5);

          // 视觉锚点
          group.addShape('circle', {
            attrs: {
              x,
              y,
              fill:      '#e7e7e7',
              stroke:    '#1890ff',
              lineWidth: 1,
              r:         5,
            },
            zIndex:    1,
            nodeId:    group.get('id'),
            className: 'node-anchor',
            draggable: true,
            isAnchor:  true,
            index:     i,
          });
        });
      },
      /*
        绘制节点, 包含文本, 锚点等
      */
      draw (cfg, group) {
        /*
        * group: 节点分组, 包含节点配置, 锚点, 图标, 文本等shape.
        * 绘制流程:
        * 1. 获取默认样式配置
        * 2. 添加 shape
        * 3. 添加文本节点/锚点等
        * 4. return shape
        */

        // 1.
        const attrs = cfg;

        // console.log(attrs);
        // 2.
        const shape = group.addShape(
          'rect', // 继承内置节点的 shape, 可选 rect, circle, ellipse, path 等
          {
            // 所有的样式配置
            attrs: {
              ...attrs,
              fill: '#1890ff',
              ...attrs.style,
              x:    -attrs.style.width / 2,
              y:    -attrs.style.height / 2,
            },
            className: 'custom-shape', // 添加自定义属性, 方便以后对节点进行查找更新等
            draggable: true, // 允许自定义图形使用拖拽事件
          },
        );

        // 3.
        // this 是当前节点的实例, 并不是 Vue 实例
        this.drawText(cfg, group);
        this.drawAnchor(cfg, group);

        // 4.
        return shape;
      },
      /* 绘制后附加操作 */
      afterDraw (cfg, group) { },
      /* 用于更新节点的配置 */
      update (cfg, node) { },
      /* 用于更新节点后的附加操作 */
      afterUpdate (cfg, node) { },
      /*
        设置节点状态, 主要是交互状态, 如 hover, active 等.
      */
      setState (name, value, group) {},
      /* 获取当前节点的锚点 */
      getAnchorPoints (cfg) {
        return cfg.anchorPoints || [
          [0.5, 0],
          [1, 0.5], // 右侧中间
          [0.5, 1],
          [0, 0.5], // 左侧中间
        ];
      },
    },'rect')
    G6.registerNode('rect-node', {
    draw (cfg, group) {
      const style = this.getShapeStyle(cfg, group); // node 样式

      const shape = group.addShape('rect', {
        attrs: style,
        name:  'rect-node',
      });

      group.addShape('text', {
        attrs: {
          fontSize: 14,
          fill:     '#666',
          text:     cfg.label,
          x:        -16,
          y:        6,
        },
        name: 'node-label',
      });

      // TODO
      // 1: 添加虚拟节点
      // 2: 添加控制点
      group.addShape('rect', {
        attrs: {
          ...style,
          radius:      4,
          fill:        '#E7F7FE',
          stroke:      '#1890ff',
          fillOpacity: 0.7,
        },
        visible:   false,
        className: 'rect-node-shadow',
      });
      this.addControlPoint(group, style);

      return shape;
    },
    addControlPoint (group, style) {
      group.addShape('circle', {
        attrs: {
          r:             4,
          fill:          '#1890ff',
          stroke:        '#fff',
          strokeOpacity: 0,
          lineWidth:     20,
          x:             0,
          y:             -style.height / 2,
          cursor:        'ns-resize',
        },
        visible:   false,
        className: 'control-point',
        name:      'top-point',
      });
      group.addShape('circle', {
        attrs: {
          r:             4,
          fill:          '#1890ff',
          stroke:        '#fff',
          strokeOpacity: 0,
          lineWidth:     20,
          x:             style.width / 2,
          y:             0,
          cursor:        'ew-resize',
        },
        visible:   false,
        className: 'control-point',
        name:      'right-point',
      });
      group.addShape('circle', {
        attrs: {
          r:             4,
          fill:          '#1890ff',
          stroke:        '#fff',
          strokeOpacity: 0,
          lineWidth:     20,
          x:             0,
          y:             style.height / 2,
          cursor:        'ns-resize',
        },
        visible:   false,
        className: 'control-point',
        name:      'bottom-point',
      });
      group.addShape('circle', {
        attrs: {
          r:             4,
          fill:          '#1890ff',
          stroke:        '#fff',
          strokeOpacity: 0,
          lineWidth:     20,
          x:             -style.width / 2,
          y:             0,
          cursor:        'ew-resize',
        },
        visible:   false,
        className: 'control-point',
        name:      'left-point',
      });
    },
    update (cfg, item) {
      const model = item.getModel();
      const group = item.getContainer();
      const node = group.getFirst();
      const { width, height } = model.style;

      node.attr({
        width,
        height,
        x: -width / 2,
        y: -height / 2,
      });

      group.getChildren().forEach(child => {
        if (child.cfg.className === 'rect-node-shadow') {
          child.attr({
            width,
            height,
            x: -width / 2,
            y: -height / 2,
          });
        } else if (child.cfg.className === 'control-point') {
          switch (child.cfg.name) {
            case 'top-point':
              child.attr({ y: -height / 2 });
              break;
            case 'right-point':
              child.attr({ x: width / 2 });
              break;
            case 'bottom-point':
              child.attr({ y: height / 2 });
              break;
            case 'left-point':
              child.attr({ x: -width / 2 });
              break;
          }
        }
      });
    },
    setState (name, value, item) {
      if (name === 'graphMode') {
        const visible = value === 'edit';
        const group = item.getContainer();
        const children = group.getChildren();

        children.forEach(child => {
          if (child.cfg.className === 'control-point' || child.cfg.className === 'rect-node-shadow') {
            if (visible) {
              child.show();
            } else {
              child.hide();
            }
          }
        });
      }
    },
  }, 'rect');
    const graph = new G6.Graph({
        container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
        width: 800, // Number，必须，图的宽度
        height: 500, // Number，必须，图的高度
        // layout:    {
        //   type: 'dagre',
        // },
        defaultNode: {
          type:  'rect-node',
          style: {
            width:  180,
            height: 60,
            radius: 10,
            fill:   '#eaf6fd',
            stroke: '#1890ff',
          },labelCfg: {
            style: {
              fill:     '#1890ff',
              fontSize: 20,
            },
          },
          // anchorPoints: [
          //   [0, 0.5],
          //   [1, 0.5],
          //   [0.5, 1],
          //   [0.5, 0],
          // ],
        },
    });
    graph.data(data)
    graph.render()

    
  


}

onMounted(()=>{
    createGraph()
})

</script>

<template lang="">
    <div id="mountNode"></div>
</template>

<style scoped>

</style>