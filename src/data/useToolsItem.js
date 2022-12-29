import {
  Share, Search,
  Operation,
  Upload,
  UploadFilled,
  Refresh,
  MagicStick,
  Delete
} from "@element-plus/icons-vue";
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
      title: "信息测试",
      enable: false,
      icon: markRaw(Share),

    },
    {
      name: "test",
      title: "测试",
      enable: true,
      icon: markRaw(Share),

    },
    {
      name: "getAll",
      title: "全局关系图",
      enable: true,
      icon: markRaw(Operation),
      handler: 'getAllGraph',
    },
    {
      name: "Import",
      title: "导入数据",
      enable: true,
      icon: markRaw(Upload),

    },
    {
      name: "Save",
      title: "保存数据",
      enable: true,
      icon: markRaw(UploadFilled),

    },
    {
      name: "flushGraph",
      title: "刷新画布布局",
      enable: true,
      icon: markRaw(Refresh),

    },
    {
      name: "NodeLight",
      title: "超级节点高亮",
      enable: true,
      icon: markRaw(MagicStick),

    },
    {
      name: "Clear",
      title: "清除画布",
      enable: true,
      icon: markRaw(Delete),

    },
  ];
}
