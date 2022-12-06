<template>
  <table border="1">
    <tr>
      <th>属性名</th>
      <th>属性值</th>
    </tr>
    <!--这里的意思是根据获取到的data的值,把他们全都按中文名显示到文档里面-->
    <template v-for="(属性值, 属性名) in data">
      <tr v-if="属性别名[属性名]">
        <td>{{ 属性别名[属性名] }}</td>
        <td>{{ 属性值 }}</td>
      </tr>
    </template>
  </table>
</template>
<script setup>
//这里的为什么要这么写可以参考vue3的文档
import { ref, onMounted } from "vue";
let data = ref(null);
let 块id = window.frameElement.parentElement.parentElement.dataset.nodeId;
let 属性别名 = {
  //别名
  alias: "别名",
  //笔记本的id
  box: "笔记本id",
  //内容，对于文档块来说，就是文档的标题,这里不显示
  //  "content": "思源笔记折腾记录-简单挂件-显示更多的属性",
  //创建时间，不是文件的，而是块的。
  created: "创建时间",
  //聚焦内容，暂时可以不用管,这里不显示
  //   "fcontent": "思源笔记折腾记录-简单挂件-显示更多的属性",
  //哈希值，暂时可以不用管,这里不显示
  //"hash": "哈希值",
  //可读路径，就是用人能看得懂的形式表达这个笔记在哪里
  hpath: "文档路径",
  //kramdown格式的内联属性表，暂时不用管，用另一种格式显示的属性,这里不显示
  //"ial": "文档ial",
  //每个块都独一无二的 属性，可以用来找到任何一个具体的块
  id: "文档id",
  //内容长度
  length: "内容长度",
  //markdown内容，文档块会是空的,这里不显示
  //    "markdown": "markdown",
  //块备注内容，没备注所以没有
  memo: "备注",
  //块命名内容，没命名所以没有
  name: "命名",
  //父块id，没命名所以没有
  //"parent_id": "父块id",
  //路径，id形式的，这个你绝对看不懂,这里不显示
  //"path": "路径",
  //根块id，其实就是文档id，对于文档块来说，几个id都一样,这里不显示
  //"root_id": "根id",
  //排序用的，暂时不用管,这里不显示
  //"sort": 0,
  //子类型，很多块的大类下还有子类，暂时不用管,这里不显示
  //"subtype": "",
  //标签，暂时不用管
  tag: "标签",
  //类型，对于文档块来说，暂时不用管,这里不显示
  //"type": "类型",
  //修改时间
  updated: "修改时间",
};
let 获取数据 = (块id) => {
  console.log(块id);
  fetch("/api/query/sql", {
    method: "post",
    body: JSON.stringify({
      stmt: `select * from blocks where id in (select root_id from blocks where id = "${块id}")`,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      data.value = json.data[0];
      console.log(data);
    });
};
onMounted(() => 获取数据(块id));
</script>
