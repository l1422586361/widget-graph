export function useGetOptions(container: any, size, plugins) {
    return {
      container: 'container', // 指定图画布的容器 id，与第 9 行的容器对应
      width: container.offsetWidth,
      height: container.offsetHeight,
      plugins,
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          {
            type: 'drag-node',
            shouldBegin: (e) => {
              // 如果banDrag 为true，说明拖拽的是拖拽标识
              const banDrag = e.target.attrs.banDrag;
              return !banDrag;
            },
          },
          {
            type: 'tooltip',
            offset: 20,
            formatText(model) {
              return model.fullName;
            },
          },
  
          'node-hover',
          'node-select',
          'anchor-drag',
        ], // 允许拖拽画布、放缩画布、拖拽节点
      },
      // 节点在默认状态下的样式配置（style）和其他配置
      defaultNode: {
        type: 'base-node',
        size: size || 60, // 节点大小
        style: {
          fill: '#fff',
          stroke: '#fff',
        },
        labelCfg: {
          position: 'bottom',
          offset: 10,
        },
      },
      nodeStateStyles: {
        'nodeState:default': {
          stroke: '',
        },
        // 鼠标 hover 上节点，即 hover 状态为 true 时的样式
        'nodeState:hover': {
          stroke: 'lightsteelblue',
        },
        // 鼠标点击节点，即 click 状态为 true 时的样式
        'nodeState:selected': {
          stroke: 'lightsteelblue',
        },
      },
      // 边在默认状态下的样式配置（style）和其他配置
      defaultEdge: {
        style: {
          stroke: 'grey', // 边描边颜色
          lineWidth: 3,
          cursor: 'pointer',
        },
      },
      edgeStateStyles: {
        hover: {
          stroke: 'lightsteelblue',
        },
      },
    };
  }