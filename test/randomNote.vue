<template>
  <button @click="open">111</button>
</template>
<script setup>
// 请求函数
function request(url, data = null, method = "POST") {
  return new Promise((resolve, reject) => {
    if (method.toUpperCase() == "POST") {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(
          (data) => resolve(data.json()),
          (error) => {
            reject(error);
          }
        )
        .catch((err) => {
          console.error("请求失败:", err);
        });
    }
  });
}

function 获取数组里指定元素(id, arr) {
  for (let r in arr) {
    // console.log(12111,r,arr[r])
    if (arr[r].id == id) {
      return arr[r];
    }
  }
}

// 打开随机文档，编辑sql选定范围
async function open() {
  let sql =
    "select distinct root_id from blocks where type='d' and path like '/20211209181026-i3s9wiq%' and fcontent not in ('2021','2022','2023','01','02','03','04','05','06','07','08','09','10','11','12','收集箱【inbox】','Index') order by random()";
  // 查出SQL结果
  let queryRes = await request("/api/query/sql", { stmt: sql });

  //   获取当天日期
  let nowDate = new Date();
  let today =
    nowDate.getFullYear() +
    "-" +
    (nowDate.getMonth() + 1) +
    "-" +
    nowDate.getDate();
  console.log("today", today);
  console.log(
    (new Date(today) - new Date("2023-1-26")) / (1000 * 60 * 60 * 24)
  );

  let 所有待查看id = [];
  if (queryRes) {
    // let index = Math.floor(Math.random() * queryRes.data.length);
    // console.log(0,queryRes.data[0].root_id)
    for (let r in queryRes.data) {
      // console.log(r)
      所有待查看id.push(queryRes.data[r].root_id);
    }
    console.log(所有待查看id);
    // window.open("siyuan://blocks/" + res.data[index].root_id);
  }

  // 获取已查看ID
  let 已查看数据 = await fetch(`/assets/extConfig/randomList.json`)
    .then(async (res) => {
      if (res.status == 404) {
        alert("需创建/assets/extConfig/randomList.json文件");
      } else {
        return await res.json();
      }
    })
    .then(async (e) => {
      console.log(e.id);
      return e;
    });
  console.log(12311, 已查看数据);

  //   1. 查出的列表为随机排序的所有id，对比已查看的，无则在已查看里新增ID和日期
  //   2. 如果有，判断时间值，暂定，如果在7天以上的，还是打开
  let 所有已查看id = 已查看数据.map((e) => {
    return e.id;
  });

  console.log("所有已查看id", 所有已查看id, 所有已查看id.indexOf("111") == -1);

  for (let 待查看id in 所有待查看id) {
    待查看id = '111'
    // console.log("vi",获取数组里指定元素(待查看id,已查看数据))
    if (所有已查看id.indexOf(待查看id) == -1) {
      // =-1表示不包含
      console.log(111);
      // 打开文档，添加id
      已查看数据.push({ id: 待查看id, rq: today });
      break;
    } else if (
      (new Date(today) -
        new Date(获取数组里指定元素(待查看id, 已查看数据).rq)) /
        (1000 * 60 * 60 * 24) <=
      7
    ) {
      console.log(222);
      // 打开文档，修改id
      for (let r in 已查看数据) {
        if (已查看数据[r].id == 待查看id) {
          已查看数据[r].rq = today;
        }
      }
      break;
    }
  }
  console.log("修改过后", 已查看数据);

  //   将已查看数据写入到文件中

  let saveDataBlob = new Blob([JSON.stringify(已查看数据),],{ type: "application/json" });
  let 数据文件 = new File([saveDataBlob], "randomList.json", {lastModified: Date.now(),});
  let data = new FormData();
  data.append("path", "/data/assets/extConfig/randomList.json");
  data.append("file", 数据文件);
  // let filepath = ""
  await fetch("/api/file/putFile", {
    body: data,
    method: "POST",
    headers: {  },
  }).then(function (response) {
    console.log(response);
    return response.json();
  });
// await request("/api/asset/upload",data)


//   alert("保存成功");
}
</script>