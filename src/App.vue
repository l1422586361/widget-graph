<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  ArrowLeft,
  ArrowRight,
  Tools,
  Edit,
  Share,
} from "@element-plus/icons-vue";
import {fsrs} from "./js/fsrs.js";
const conf = ref({})

onMounted(async ()=>{
  await fetch('/widgets/randomNote/config.json').then(async e=>await e.json()).then(e=>{
    conf.value = e
    文本框配置.显示文本 = e.sql
  })
})

// 数据============================================start

const 按钮状态 = reactive({
  禁用复习:false,
  show复习子按钮:false,
})

const 文本框配置 = reactive({
  禁用状态: true,
  显示文本: "",
})


// 数据============================================end


// 方法===========================================start

function toggleBtn(str=''){
  if(str=='fuxi'){
    按钮状态.禁用复习 = true
    按钮状态.show复习子按钮 = true
  }
  if(str =='setting'){
    文本框配置.禁用状态=false
  }
  if(str=='save'){
    文本框配置.禁用状态=true
  }
}

function toggleBtnSub(str=''){
  按钮状态.show复习子按钮 = false
  按钮状态.禁用复习 = false
}

// 方法===========================================end




// let globalData;
function 测试fsrs(str,num) {
  var cardData = { id: str },
    grade = num, //Grade `-1` means learn new card,and `0, 1, 2` means review old card (0:forget 1:remember 2:grasp).
    globalData = null;
  fsrs(cardData, grade, globalData).then(e=>{
    // console.log("outputData==========",e)
    // globalData = e.globalData
    // console.log("globalData==========",globalData)
    console.log("cardData==========",e.cardData)
  }); //Return {cardData,globalData}. You can save this output data and use it as input data the next time you update grade.
  // console.log("outputData==========",outputData);
  // console.log("globalData==========",globalData);

}


function 测试fsrs2(str,num) {
  var cardData = {
    "id": "1111",
    "due": "2023-02-12T03:21:37.527Z",
    "interval": 0,
    "difficulty": 5,
    "stability": 2,
    "retrievability": 1,
    "grade": -1,
    "review": "2023-02-10T03:21:37.527Z",
    "reps": 1,
    "lapses": 0,
    "history": []
},
    grade = num, //Grade `-1` means learn new card,and `0, 1, 2` means review old card (0:forget 1:remember 2:grasp).
    globalData = null;
  fsrs(cardData, grade, globalData).then(e=>{
    // console.log("outputData==========",e)
    // globalData = e.globalData
    // console.log("globalData==========",globalData)
    console.log("cardData==========",e.cardData)
  }); //Return {cardData,globalData}. You can save this output data and use it as input data the next time you update grade.
  // console.log("outputData==========",outputData);
  // console.log("globalData==========",globalData);

}
</script>


<template>
  
  <el-aside width="400px">
    
    <el-input
      v-model="文本框配置.显示文本"
      type="textarea"
      class="w-50 m-2 el-input"
      :disabled="文本框配置.禁用状态"
      :placeholder="文本框配置.显示文本"
    />
    <el-row :gutter="20">
      <el-col :span="12">当前：文档名称</el-col>
      <el-col :span="12" class="tongji">12/12/12/12</el-col>
    </el-row>
    <el-button-group>
      <el-button type="primary" :disabled="按钮状态.禁用复习" @click="toggleBtn('fuxi')">复习</el-button>
      <el-button type="default">新材料</el-button>
      <el-button type="default" v-if="文本框配置.禁用状态" @click="toggleBtn('setting')">设置</el-button>
      <el-button type="default" v-if="!文本框配置.禁用状态" @click="toggleBtn('save')">保存</el-button>
  </el-button-group>
  <el-button-group v-if="按钮状态.show复习子按钮" >
    <el-button @click="toggleBtnSub('wangji')">忘记</el-button>
    <el-button @click="toggleBtnSub('jizhu')">记住</el-button>
    <el-button @click="toggleBtnSub('zhangwo')">掌握</el-button>
    <el-button @click="toggleBtnSub('chongzhi')">重置为新材料</el-button>
    <el-button @click="toggleBtnSub('ignore')">不再推送</el-button>
  </el-button-group>
  </el-aside>
</template>


<style scoped>
.el-input {
  height: 200px;
  margin-bottom: 5px;
}
.el-aside {
  overflow: hidden;
}
.tongji {
  text-align: right;
}
</style>

