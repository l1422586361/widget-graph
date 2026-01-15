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
    const data = {
      nodes: [
        { id: 'node1', label: '节点1' },
        { id: 'node2', label: '节点2' },
        { id: 'node3', label: '节点3' },
        { id: 'node4', label: '节点4' },
        { id: 'node5', label: '节点5' }
      ],
      edges: [
        { source: 'node1', target: 'node2' },
        { source: 'node2', target: 'node3' },
        { source: 'node3', target: 'node4' },
        { source: 'node4', target: 'node5' },
        { source: 'node5', target: 'node1' }
      ]
    };

    const rect = container.getBoundingClientRect();
    graph = new Graph({
      container,
      width: rect.width,
      height: rect.height,
      behaviors: [
        'drag-canvas',
        'zoom-canvas',
        'drag-node',
        'click-select'
      ],
      defaultNode: {
        size: [40, 40],
        style: {
          fill: '#DEE9FF',
          stroke: '#73A6FF',
          lineWidth: 2
        },
        labelCfg: {
          style: {
            fill: '#333',
            fontSize: 12
          }
        }
      },
      defaultEdge: {
        type: 'cubic',
        style: {
          stroke: '#e2e2e2',
          lineWidth: 2
        }
      },
      layout: {
        type: 'circular',
        center: [rect.width / 2, rect.height / 2],
        radius: Math.min(rect.width, rect.height) / 3
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
