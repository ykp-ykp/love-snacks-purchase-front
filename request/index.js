
//export const request = (url) =>{}
//export const request = function(url){}
//把加载框loading封装在这里面

//同时发送异步代码的次数
let requestTimes = 0

export const request = (url)=>{
    requestTimes++
    wx.showLoading({
      title: '加载中',
    })
    
    return new Promise((resolve,reject)=>{

        wx.request({
            url: url,
            method: "GET",
            header:{
                'content-type': 'application/json'
            },
            success: function(result){
                //执行success函数后会执行resolve函数，其中的参数会传递给下一个then函数。result是请求链接返回的数据
                resolve(result)
            },
            // 上面的success函数和下面的fail函数是两种定义方式。result和err都是参数
            fail: (err)=>{
                //执行fail函数后会执行reject函数，其中的参数会传递给下一个catch函数。err是请求链接返回的数据
                reject(err)
            },
            complete: ()=>{
                requestTimes--
                if(requestTimes == 0){
                    //当请求次数全部结束，隐藏加载框
                    wx.hideLoading()
                }
            }
        });
    })
}

//调用request的方法有两种
/*
首先引入这个js文件：var request_index = require("../../request/index")
url是请求地址
1.
var res = await request_index.request(url)
console.log(res)
res就是返回的数据
-----------------------------------------------------------------
2.
request_index.request(url)
      .then(res => {
        console.log("获取到的全部数据：", res)
      })
      .catch(res => {
        console.log("获取失败")
      })
*/





//下面这种方法也可以
/*

//Page页面中定义函数>>>> 函数名: function(){}
export function getPromise(url) {
    // Promise()函数里面的参数也是一个函数
    return new Promise((resolve, reject) => {

        wx.request({
            url: url,
            success: function (result) {
                resolve(result)
            },
            // 上面的sucess函数和下面的fail函数是两种定义方式。result和err都是参数
            fail: (err) => {
                reject(err)
            },
            complete: () => {}
        });

    })
}
*/