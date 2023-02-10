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
import {获取配置,写入配置} from "./data/writeConfig.js"
import { 获取数据,写入数据,移除卡片,卡片排序} from './data/cardData.js'
import {sql,setBlockAttrs,getBlockByID} from "./utils/api.js"
// 生命周期=========================================start

onMounted(async ()=>{
  conf = await 获取配置()
  文本框配置.显示文本 = conf.sql
  文本框配置.输入文本 = conf.sql
  data = await 获取数据()

  // console.log(await 移除卡片(data.cardData,'111'))
  console.log(await 卡片排序(data.cardData))
})

// 生命周期=========================================end

// 数据============================================start
let conf = {}
let data = []
const 按钮状态 = reactive({
  禁用复习:false,
  show复习子按钮:false,
  show新材料按钮:false,
})

const 文本框配置 = reactive({
  禁用状态: true,
  显示文本: "",
  输入文本: "",
})

const 当前打开文档 = reactive({
  id:"",
  name:"未打开文档"
})

const 统计数值 = reactive({
  待复习:0,
  已复习:0,
  队列总数:0,
  ignore:0,
})

// 数据============================================end


// 方法===========================================start

async function toggleBtn(str=''){
  if(str=='fuxi'){
    按钮状态.禁用复习 = true
    按钮状态.show复习子按钮 = true
    按钮状态.show新材料按钮 = false
  }
  if(str =='setting'){
    文本框配置.禁用状态=false
  }
  if(str=='save'){
    文本框配置.禁用状态=true
    conf.sql = 文本框配置.输入文本
    写入配置(conf)
  }
  if(str=='quxiao'){
    文本框配置.禁用状态=true
    文本框配置.输入文本 = 文本框配置.显示文本
  }
  if(str=='newCard'){
    // TODO
    按钮状态.show新材料按钮 = true
    按钮状态.show复习子按钮 = false
    按钮状态.禁用复习 = false
    await sql(conf.sql).then(async e=>{
      await getBlockByID(e[0].root_id).then(e=>{
        console.log("e========",e)
        当前打开文档.id = e.root_id
        当前打开文档.name = e.fcontent
      })
    })

    
    
    
    let cardData={id:当前打开文档.id}
    // console.log(newCard[0].root_id)
    await fsrs(cardData,-1,null).then(e=>{
      data.cardData.push(e.cardData)
    })
    // // 设定属性为已写入队列
    await setBlockAttrs(当前打开文档.id,{"custom-randomNoteType":"queue"})

    // console.log(data)
    写入数据(data)
  }
}

function toggleBtnSub(str=''){
  按钮状态.show复习子按钮 = false
  按钮状态.禁用复习 = false
  if(str=='wangji'){

  }
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
      v-model="文本框配置.输入文本"
      type="textarea"
      class="w-50 m-2 el-input"
      :disabled="文本框配置.禁用状态"
      :placeholder="文本框配置.显示文本"
    />
    <el-row :gutter="20">
      <el-col :span="12">当前：{{当前打开文档.name}}</el-col>
      <el-col :span="12" class="tongji">{{统计数值.待复习}}/{{统计数值.已复习}}/{{统计数值.队列总数}}/{{统计数值.ignore}}</el-col>
    </el-row>
    <el-row>
      <el-button-group>
        <el-button type="primary" :disabled="按钮状态.禁用复习" @click="toggleBtn('fuxi')">复习</el-button>
        <el-button type="default" @click="toggleBtn('newCard')">新材料</el-button>
        <el-button type="default" v-if="文本框配置.禁用状态" @click="toggleBtn('setting')">设置</el-button>
        <el-button type="default" v-if="!文本框配置.禁用状态" @click="toggleBtn('save')">保存</el-button>
        <el-button type="default" v-if="!文本框配置.禁用状态" @click="toggleBtn('quxiao')">取消</el-button>
    </el-button-group>
    </el-row>
    <el-row>
      <el-button-group v-if="按钮状态.show复习子按钮" >
        <el-button @click="toggleBtnSub('wangji')">忘记</el-button>
        <el-button @click="toggleBtnSub('jizhu')">记住</el-button>
        <el-button @click="toggleBtnSub('zhangwo')">掌握</el-button>
        <el-button @click="toggleBtnSub('chongzhi')">重置为新材料</el-button>
        <el-button @click="toggleBtnSub('ignore')">不再推送</el-button>
      </el-button-group>
      <el-button-group v-if="按钮状态.show新材料按钮">
        <el-button @click="toggleBtnSub('ignore')">不再推送</el-button>
      </el-button-group>
    </el-row>
  
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
  margin-bottom: 5px;
}
</style>

