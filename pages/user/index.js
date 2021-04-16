// pages/user/index.js
var request_index = require("../../request/index")
var utils = require("../../utils/util")
var app = getApp()
Page({

    data: {
        // 用户信息
        userInfo: [],
        // 收藏商品的数量
        collectNum: 0,
        openid:[]
    },

    onLoad(){
        //this.test()  //测试token
        this.getOpenid()
    },

    onShow() {
        //获取缓存中的 用户信息
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
        });
        console.log("用户信息：",this.data.userInfo)
        if(this.data.userInfo)
            app.globalData.islogin = true
        else
            app.globalData.islogin = false
        console.log("是否登陆: ",app.globalData.islogin)

        //获取 缓存中的 收藏商品数组
        let collect = wx.getStorageSync("collect");
        // 将缓存中的商品数量设置到 data中
        this.setData({
            collectNum: collect.length
        });
    },

    //用户主动登录
    async handleLogin() {//该函数执行在onshow之前
        
        //异步函数同步化，防止数据加载不出来
        const res = await wx.getUserProfile({desc: "用于登录显示头像"})
        if(res){
                console.log("登录时获取信息成功")
                wx.setStorageSync('userInfo', res.userInfo);
                app.globalData.islogin = true
                this.setData({
                    userInfo: res.userInfo,
                })
        }

        /*下面这种写法不行，因为 wx.getUserProfile（）是异步函数，success还没执行可能onshow已经执行，会导致userInfo数据没有成功读取*/
        // wx.getUserProfile({
        //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        //     success: (res) => {
        //         console.log("登录时获取信息成功")
        //         wx.setStorageSync('userInfo', res.userInfo);
        //         app.globalData.islogin = true
        //         this.setData({
        //             userInfo: res.userInfo,
        //         })
        //     }
        // })
        this.onShow()      
    },
    
    getOpenid(){
        var that = this
        wx.login({
        success (res) {
          //调用 wx.login() 获取 临时登录凭证code 
          if (res.code) {
            //发起网络请求
            
            wx.request({
              //调用 auth.code2Session 接口，换取 用户唯一标识 OpenID 、 用户在微信开放平台帐号下的唯一标识UnionID(需要使用到wx.login()获取的code来进行请求)
              url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx3aa5fd77324397d1&secret=8da3f2130f904f306d8409720e643ae0&js_code="+res.code+"&grant_type=authorization_code",

              success:res=>{
                console.log("通过code获取openid成功：",res)
                that.setData({
                    openid: res.data
                })
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    // 提示用户 功能还没有实现
    commonToast() {
        wx.showToast({
            title: '该功能还没实现',
        })
    },

    //退出登录
    exit() {
        wx.removeStorage({
            key:"userInfo",
            success: (res) => {
                console.log("清除缓存成功")
                wx.reLaunch({
                    url: '/pages/user/index',
                })
            },
        })
    },

    async test(){
        let res =  await utils.getToken()
        console.log("通过utils中的函数getToken获取token：",res)
    }

})