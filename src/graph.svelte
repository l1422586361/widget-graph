<script lang="ts">
  import { Graph as G6 } from '@antv/g6';

  import { onMount } from 'svelte';

  let container: HTMLElement;

  onMount(() => {
    // 定义图数据
    const data = {
      nodes: [
        { id: 'node1', x: 100, y: 200, label: 'Node 1' },
        { id: 'node2', x: 300, y: 200, label: 'Node 2' }
      ],
      edges: [
        { source: 'node1', target: 'node2' }
      ]
    };

    // 创建 G6 图实例
    const graph = new G6.Graph({
      container,
      width: 500,
      height: 400,
      defaultNode: {
        size: [40, 40],
        style: {
          fill: '#DEE9FF',
          stroke: '#73A6FF'
        }
      },
      defaultEdge: {
        style: {
          stroke: '#e2e2e2'
        }
      }
    });

    // 加载数据
    graph.data(data);
    graph.render();

    return () => {
      // 组件销毁时销毁图实例
      graph.destroy();
    };
  });
</script>

<div bind:this={container}></div>