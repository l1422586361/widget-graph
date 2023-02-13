<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import {fsrs} from "./js/fsrs.js";
import {获取配置,写入配置} from "./data/writeConfig.js"
import { 获取数据,写入数据,移除卡片,卡片排序,更新卡片,} from './data/cardData.js'
import {sql,setBlockAttrs,getBlockByID} from "./utils/api.js"


// 数据============================================start
let conf = {}
let data = {}
const 按钮状态 = reactive({
  禁用复习:false,
  show复习子按钮:false,
  show新材料按钮:false,
  禁用删除按钮:true,
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

const globalData = null
// 数据============================================end


// 方法===========================================start

async function tongji(){
  // 待复习：时间小于当前时间
  // 已复习：review等于当天时间
  // 队列总数：所有条数
  // ignore：查询属性的条数
  let 复习时间列表 = data.cardData.map(e=>{return {本次复习时间:e.due,上次复习时间:e.review}})
  统计数值.队列总数 = 复习时间列表.length
  for(let e of 复习时间列表){
    if(new Date(e.本次复习时间)<new Date()){
      统计数值.待复习++
    }
    // if(new Date(e.上次复习时间))
    let 上次复习日期 = (new Date(e.上次复习时间)).getFullYear() + "-" + ((new Date(e.上次复习时间)).getMonth() + 1) + "-" + (new Date(e.上次复习时间)).getDate();
    let 当天日期 = (new Date()).getFullYear() + "-" + ((new Date()).getMonth() + 1) + "-" + (new Date()).getDate();
    if(上次复习日期 == 当天日期){
      统计数值.已复习++
    }
  }
  统计数值.ignore = await sql(`select count(*) as count from blocks where id in (select block_id from attributes where name='custom-randomNoteType' and value = 'ignore')`).then(e=>{return e[0].count})
}

async function toggleBtn(str=''){
  if(str=='fuxi'){
    按钮状态.禁用复习 = true
    按钮状态.show复习子按钮 = true
    按钮状态.show新材料按钮 = false
    data.cardData = await 卡片排序(data.cardData)
    console.log(data.cardData)
    for(let card of data.cardData){
      let nowDate = new Date();
      console.log(new Date(card.due),new Date(),new Date(card.due)<=new Date())

      if(new Date(card.due) <= nowDate){  
        await getBlockByID(card.id).then(e=>{
          console.log("e========",e)
          当前打开文档.id = e.root_id
          当前打开文档.name = e.fcontent
        })
        window.open("siyuan://blocks/" + 当前打开文档.id);
        break

      }else{
        当前打开文档.name = '当前已完成复习！'
        按钮状态.show复习子按钮 = false
        按钮状态.禁用复习 = true
        break
      }
    }
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
    window.open("siyuan://blocks/" + 当前打开文档.id);
    // console.log(newCard[0].root_id)
    await fsrs({id:当前打开文档.id},-1,globalData).then(e=>{
      data.cardData.push(e.cardData)
    })
    // // 设定属性为已写入队列
    await setBlockAttrs(当前打开文档.id,{"custom-randomNoteType":"queue"})
    统计数值.队列总数++
    // console.log(data)
    写入数据(data)
  }

  if(str=='delCard'){
    data.cardData = await 移除卡片(data.cardData,当前打开文档.id)
    写入数据(data)
    tongji()
    当前打开文档.id=''
    当前打开文档.name='未打开文档'
  }
  

}

async function toggleBtnSub(str=''){
  按钮状态.show复习子按钮 = false
  按钮状态.禁用复习 = false
  if(['wangji','jizhu','zhangwo','chongzhi'].indexOf(str)!=-1){
    let grade
    if(str=='wangji'){grade=1}else if(str=='jizhu'){grade=2}else if(str=='zhangwo'){grade=4}else if(str=='chongzhi'){grade=-1}
    // console.log(grade)
    await fsrs({id:当前打开文档.id},grade,globalData).then(async e=>{
      console.log('e==========',e)
      data.cardData = await 更新卡片(data.cardData,当前打开文档.id,e.cardData)
      console.log(data.cardData)
      写入数据(data)
    })
  }
  if(str=='ignore'){
    // 设定属性为已写入队列
    await setBlockAttrs(当前打开文档.id,{"custom-randomNoteType":"ignore"})
    data.cardData = 移除卡片(data.cardData,当前打开文档.id)
    写入数据(data)
  }
}


// 方法===========================================end

// 生命周期=========================================start

onMounted(async ()=>{
  conf = await 获取配置()
  文本框配置.显示文本 = conf.sql
  文本框配置.输入文本 = conf.sql
  data = await 获取数据()

  // console.log(await 移除卡片(data.cardData,'111'))
  // console.log(await 更新卡片(data.cardData,'111',{id:'111'}))
  tongji()
})

watch(
  () => 当前打开文档.id,
  () => {
    if(当前打开文档.id == ''){
      按钮状态.禁用删除按钮 = true
    }else{
      按钮状态.禁用删除按钮 = false
    }
  },{immediate:true}
)

// 生命周期=========================================end

</script>


<template>
  
  <el-aside width="400px">
    
    <el-input
      v-model="文本框配置.输入文本"
      type="textarea"
      resize="none"
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
        <el-button type="default" @click="toggleBtn('delCard')" :disabled="按钮状态.禁用删除按钮">删除此记录</el-button>
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
  background:white;
}
.tongji {
  text-align: right;
  margin-bottom: 5px;
}
</style>

