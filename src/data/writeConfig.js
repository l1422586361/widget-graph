
const configUrl = '/widgets/randomNote/config.json'
export async function 获取配置(){
    return await fetch(configUrl).then(async e=>await e.json())
}

export async function 写入配置(obj){
    let saveDataBlob = new Blob([JSON.stringify(obj),], { type: "application/json" });
        let 数据文件 = new File([saveDataBlob], "config.json", { lastModified: Date.now(), });
        let data = new FormData();
        data.append("path", "/data/"+configUrl);
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