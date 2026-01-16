import { Dialog } from "siyuan";
import HelloExample from "@/hello.svelte";
import SettingExample from "@/setting-example.svelte";
import { svelteDialog } from "../libs/dialog";
import { Constants } from "siyuan";

export class DialogModule {
    constructor(private plugin: any) {}

    /**
     * 显示示例对话框
     */
    showDialog() {
        const docId = this.plugin.getEditor().protyle.block.rootID;
        svelteDialog({
            title: `SiYuan ${Constants.SIYUAN_VERSION}`,
            width: this.plugin.isMobile ? "92vw" : "720px",
            constructor: (container: HTMLElement) => {
                return new HelloExample({
                    target: container,
                    props: {
                        app: this.plugin.app,
                        blockID: docId
                    }
                });
            }
        });
    }

    /**
     * 打开设置面板
     */
    openSettingPanel(): void {
        let dialog = new Dialog({
            title: "SettingPannel",
            content: `<div id="SettingPanel" style="height: 100%;"></div>`,
            width: "800px",
            destroyCallback: (options) => {
                console.log("destroyCallback", options);
                //You'd better destroy the component when the dialog is closed
                pannel.$destroy();
            }
        });
        let pannel = new SettingExample({
            target: dialog.element.querySelector("#SettingPanel"),
        });
    }
}