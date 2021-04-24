export function getToken(){
  return new Promise((resolve, reject) => {
    wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        data:{
            grant_type:'client_credential',
            appid:'wx3aa5fd77324397d1',
            secret:'8da3f2130f904f306d8409720e643ae0'
        },
        method:'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
        success: function (result) {
          //执行成功后会执行resolve（）函数，其中的参数会传递给下一个then函数。result是返回的数据
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

//获取openid
export function getOpenid(code){
  //console.log("正在util里面的getOpenid方法 code = ",code)
  return new Promise((resolve, reject) => {
    wx.request({
        url: 'http://localhost:8080//Controller/getopenid',
        data:{
            code:code
        },
        method:'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (result) {
            resolve(result)
        },
        fail: (err) => {
            reject(err)
        },
        complete: () => {}
    });

})
}

//往数据库中添加对象
export function Add(url,data){
  return new Promise((resolve, reject) =>{
      wx.request({
        url: url,
        data: data,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (result) {
          console.log("发送请求成功")
          resolve(result)
        },
        fail: (err) => {
          console.log("发送请求成功")
           reject(err)
        },
        complete: () => {}
      })
  })
}

//从数据库中删除对象
export function Delete(url,data){
  return new Promise((resolve, reject) =>{
      wx.request({
        url: url,
        data: data,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (result) {
          console.log("发送请求成功")
          resolve(result)
        },
        fail: (err) => {
          console.log("发送请求成功")
           reject(err)
        },
        complete: () => {}
      })
  })
}

//往云端上传图片
export function uploadFile(filePath){
  return new Promise((resolve, reject) =>{
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: "lovesnack/goods/"+new Date().getTime() + ".png",
      // 指定要上传的文件的小程序临时文件路径
      filePath: filePath,
      // 成功回调
      success: function (result) {
        console.log("图片上传成功")
        resolve(result)
      },
      fail: (err) => {
        console.log("图片上传失败")
         reject(err)
      },
      complete: () => {}
    })
    })
}


export function getDataFromMysql(url,data){
  return new Promise((resolve, reject) =>{
      wx.request({
        url: url,
        data: data,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (result) {
          console.log("发送请求成功")
          resolve(result)
        },
        fail: (err) => {
          console.log("发送请求成功")
           reject(err)
        },
        complete: () => {}
      })
  })
}