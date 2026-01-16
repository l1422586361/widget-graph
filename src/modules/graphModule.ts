import Graph from "@/graph.svelte";
import type GraphComponent from "@/graph.svelte";
import { Dialog, adaptHotkey } from "siyuan";

export class GraphModule {
    private graphInstance: GraphComponent | null = null;
    private dockElement: HTMLElement | null = null;
    private resizeObserver: ResizeObserver | null = null;

    constructor(private plugin: any) {}

    /**
     * 初始化Graph Dock
     */
    initDock(dock: any) {
        console.log("[Graph Dock] 初始化被调用");
        this.dockElement = dock.element;
        const isMobile = this.plugin.isMobile;

        if (isMobile) {
            console.log("[Graph Dock] 渲染移动端布局");
            dock.element.innerHTML = `<div class="toolbar toolbar--border toolbar--dark">
            <svg class="toolbar__icon"><use xlink:href="#iconEmoji"></use></svg>
                <div class="toolbar__text">Graph Dock</div>
                <span id="addCurrentFileAsNode" class="toolbar__icon b3-tooltips b3-tooltips__sw" aria-label="添加当前文件为node"><svg class="block__logoicon"><use xlink:href="#iconAdd"></use></svg></span>
            </div>
            <div class="fn__flex-1 plugin-sample__custom-dock" id="graphContainer"></div>
            </div>`;
        } else {
            console.log("[Graph Dock] 渲染桌面端布局");
            dock.element.innerHTML = `<div class="fn__flex-1 fn__flex-column">
            <div class="block__icons">
                <div class="block__logo">
                    <svg class="block__logoicon"><use xlink:href="#iconEmoji"></use></svg>
                    Graph Dock
                </div>
                <span class="fn__flex-1 fn__space"></span>
                <span id="addCurrentFileAsNode" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="添加当前文件为node"><svg class="block__logoicon"><use xlink:href="#iconAdd"></use></svg></span>
                <span data-type="min" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="Min ${adaptHotkey("⌘W")}"><svg class="block__logoicon"><use xlink:href="#iconMin"></use></svg></span>
            </div>
            <div class="fn__flex-1 plugin-sample__custom-dock" id="graphContainer"></div>
            </div>`;
        }

        const graphContainer = dock.element.querySelector('#graphContainer');
        if (graphContainer) {
            this.graphInstance = new Graph({
                target: graphContainer
            });

            // 添加按钮点击事件
            const addNodeBtn = dock.element.querySelector('#addCurrentFileAsNode');
            if (addNodeBtn) {
                addNodeBtn.addEventListener('click', () => {
                    this.addCurrentFileAsNode();
                });
            }

            this.resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    if (this.graphInstance && typeof this.graphInstance.updateGraphSize === 'function') {
                        this.graphInstance.updateGraphSize(entry.contentRect.width, entry.contentRect.height);
                    }
                }
            });

            this.resizeObserver.observe(this.dockElement);
        }
    }

    /**
     * 调整Graph Dock大小
     */
    resizeDock() {
        if (this.dockElement && this.graphInstance) {
            const rect = this.dockElement.getBoundingClientRect();
            if (this.graphInstance && typeof this.graphInstance.updateGraphSize === 'function') {
                this.graphInstance.updateGraphSize(rect.width, rect.height);
            }
        }
    }

    /**
     * 更新Graph Dock
     */
    updateDock() {
        console.log("[Graph Dock] 更新被调用");
    }

    /**
     * 销毁Graph Dock
     */
    destroyDock() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        if (this.graphInstance) {
            this.graphInstance.$destroy();
            this.graphInstance = null;
        }
        this.dockElement = null;
    }

    /**
     * 显示Graph对话框
     */
    showGraphDialog() {
        let dialog = new Dialog({
            title: "Graph Example",
            content: `<div id="graphPanel" class="b3-dialog__content"></div>`,
            width: this.plugin.isMobile ? "92vw" : "720px",
            destroyCallback() {
                // 可在这里添加销毁逻辑
            },
        });

        new Graph({
            target: dialog.element.querySelector("#graphPanel")
        });
    }

    /**
     * 添加当前文件为节点
     */
    private addCurrentFileAsNode() {
        console.log("[Graph Dock] 添加当前文件为node");
        // 这里可以添加实际的添加节点逻辑
        const currentFile = this.plugin.getOpenedTab();
        console.log("当前文件:", currentFile);
    }
}