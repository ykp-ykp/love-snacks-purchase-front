export function getToken(){
  return new Promise((resolve, reject) => {
    wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        data:{
            grant_type:'client_credential',
            appid:'wx3aa5fd77324397d1',
            secret:'8da3f2130f904f306d8409720e643ae0'
        },
        method:'GET',
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

//调用promise函数有两种方法
