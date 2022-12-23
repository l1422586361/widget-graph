import { Share, Search } from "@element-plus/icons-vue";
import { markRaw } from "vue";
export function useToolsItem() {
  return [
    {
      name: "Search",
      title: "搜索",
      enable: true,
      icon: markRaw(Search),
    },
    {
      name: "Info",
      title: "信息",
      enable: true,
      icon: markRaw(Share),
    },
    {
      name: "Info",
      title: "全局关系图",
      enable: true,
      icon: markRaw(Share),
    },
    {
      name: "Info",
      title: "导入数据",
      enable: true,
      icon: markRaw(Share),
    },
    {
      name: "Info",
      title: "保存数据",
      enable: true,
      icon: markRaw(Share),
    },
    {
      name: "Info",
      title: "刷新画布布局",
      enable: true,
      icon: markRaw(Share),
    },
    {
      name: "Info",
      title: "超级节点高亮",
      enable: true,
      icon: markRaw(Share),
    },
    {
      name: "Info",
      title: "清除画布",
      enable: true,
      icon: markRaw(Share),
    },
  ];
}
