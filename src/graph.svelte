<script lang="ts">
  import { Graph } from '@antv/g6';

  import { onMount, onDestroy } from 'svelte';

  let container: HTMLElement;
  let graph: Graph;

  export function updateGraphSize() {
    if (container && graph) {
      const rect = container.getBoundingClientRect();
      graph.resize(rect.width, rect.height);
    }
  }

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

    const rect = container.getBoundingClientRect();
    graph = new Graph({
      container,
      width: rect.width,
      height: rect.height,
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

    graph.setData(data);
    graph.render();

    window.addEventListener('resize', updateGraphSize);

    return () => {
      window.removeEventListener('resize', updateGraphSize);
      if (graph) {
        graph.destroy();
      }
    };
  });

  onDestroy(() => {
    if (graph) {
      graph.destroy();
    }
  });
</script>

<div bind:this={container} style="width: 100%; height: 100%;"></div>
