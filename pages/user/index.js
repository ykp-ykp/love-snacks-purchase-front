// pages/user/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
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
    code:"",

    onLoad(){
        //this.test()  //测试token
        this.getOpenid()
    },

    onShow() {
        console.log("onShow")
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
        app.globalData.userInfo = this.data.userInfo;
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
        this.addUser()
        this.onShow()      
    },
    
    async getOpenid(){
        /*调用云函数可以获取openid。如果通过服务器获取的话，由于本地服务器没有安全认证所以会出错 */
        var that = this
        wx.cloud.callFunction({
            // 云函数名称
            name: 'getopenid',
            // 传给云函数的参数

            success: function(res) {
              console.log("云函数 res = ",res.result) 
              that.setData({openid:res.result.openid})
              app.globalData.openid = res.result.openid
            },
            fail: console.error
          })

        console.log("-*------------------------")

        // var code = (await wx.login()).code
        // console.log("code",code)
        // var openid = await utils.getOpenid(code)  //获取openid只需要传递code参数即可
        // console.log("通过code获取openid成功",openid)
        // this.setData({openid:openid})

          //上下方法二选一（推荐上，都是通过服务器获取openid）

        //var that = this
        // wx.login({
        //     success (res) {
        //     //调用 wx.login() 获取 临时登录凭证code 
        //     if (res.code) {
        //         console.log("res.code = ",res.code)
        //         utils.getOpenid(res.code)
        //         .then(res=>{
        //             console.log("通过code获取openid成功",res)
        //             that.setData({openid:res})
        //         })
                
        //     } else {
        //         console.log('登录失败！' + res.errMsg)
        //     }
        //     }
        // })

    },
    // 提示用户 功能还没有实现

    async getOrder(options) {
        var state = await options.currentTarget.dataset.state
        if(app.globalData.islogin){
            wx.navigateTo({
                url: '/pages/order/index?state='+state,
              });
              //0：全部，1：待收货，2：待评价，3：退货
        }else{
            showToast("请登录")
        }
        
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

    addUser(){
        console.log("用户正在登陆，如未注册则会自动注册")
        wx.request({
            url: 'http://localhost:8080/Controller/insertUser',
            data: {
              openid: this.data.openid,
              nickName: this.data.userInfo.nickName,
            },
            
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: res => {
                console.log("注册成功")
            },
            fail:res=>{
                console.log("请求失败/注册失败--res：",res)
            }
          })
    },

    async test(){
        let res =  await utils.getToken()
        console.log("通过utils中的函数getToken获取token：",res)
    },

    async addressUpdatee() {
        try {
            const scope = await getSetting()
            if (scope === false) {
                await openSetting();
            }
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
            wx.setStorageSync('address', address)
        } catch (err) {
            console.log(err);
        }
    }

})