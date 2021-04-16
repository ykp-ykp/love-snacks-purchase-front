const app = getApp()

// pages/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      code:"",
      userInfo: "",
      hasUserInfo: false

    },

    onLoad(){
    },


    bindGetUserUnfo(e) {
        
        // 获取用户信息
        let  {userInfo} = e.detail;
        //将获取到的用户信息保存到 缓存中
        wx.setStorageSync('userInfo', userInfo);
        //返回上一页
        wx.navigateBack({//返回
            delta: 1
          })


      // wx.login({
      //   success (res) {
      //     //调用 wx.login() 获取 临时登录凭证code 
      //     if (res.code) {
      //       //发起网络请求
            
      //       wx.request({
      //         //调用 auth.code2Session 接口，换取 用户唯一标识 OpenID 、 用户在微信开放平台帐号下的唯一标识UnionID(需要使用到wx.login()获取的code来进行请求)
      //         url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx3aa5fd77324397d1&secret=b56cafe422936081910b7425861bfd41&js_code="+res.code+"&grant_type=authorization_code",

      //         success:res=>{
      //           console.log("获取成功：",res.data)
      //           wx.getUserInfo({
      //             success:res=>{
      //               console.log("getUserInfo:  ",res)
      //             }
      //           })
      //         }
      //       })
      //     } else {
      //       console.log('登录失败！' + res.errMsg)
      //     }
      //   }
      // })

  },


  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('userInfo', res.userInfo);

        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  }

})