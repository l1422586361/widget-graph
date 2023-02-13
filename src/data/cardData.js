import {setBlockAttrs} from "../utils/api.js"

const dataUrl = '/widgets/randomNote/data.json'


export async function 获取数据(){
    return await fetch(dataUrl).then(async e=>await e.json())
}

export async function 写入数据(obj){
    let saveDataBlob = new Blob([JSON.stringify(obj),], { type: "application/json" });
        let 数据文件 = new File([saveDataBlob], "config.json", { lastModified: Date.now(), });
        let data = new FormData();
        data.append("path", "/data/"+dataUrl);
        data.append("file", 数据文件);
        // let filepath = ""
        await fetch("/api/file/putFile", {
            body: data,
            method: "POST",
            headers: {},
        }).then(function (response) {
            console.log(response);
            return response.json();
        });
}

export async function 移除卡片(arr,id){
    let a = []
    for(let card of arr){
        if(card.id != id){
            a.push(card)
        }
    }
    return a
}

export async function 卡片排序(arr){
    let a1 = arr.sort(function(a,b){
        let x = a.due.toLowerCase()
        let y = b.due.toLowerCase()
        if(x<y){return -1}
        if(x>y){return 1}
        return 0
    })
    return a1
}

export async function 更新卡片(arr,id,value){
    let a = []
    for(let card of arr){
        if(card.id == id){
            a.push(value)
        }else{
            a.push(card)
        }
    }
    return a
}


Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}        