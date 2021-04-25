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
        //获取缓存中的 用户信息
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({
            userInfo
        });
        app.globalData.islogin = this.data.userInfo?true:false
        
        app.globalData.userInfo = this.data.userInfo;
        console.log("是否登陆: ",app.globalData.islogin)

        //获取 缓存中的 收藏商品数组
        let collect = wx.getStorageSync("collect");
        // 将缓存中的商品数量设置到 data中
        this.setData({
            collectNum: collect.length
        });
    },

    onHide(){
        if(app.globalData.islogin){
            app.getCartFromMysql()
        }
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
    },

    toCollection(){
        if(!app.globalData.islogin){
            showToast("请登录")
            return
        }
        wx.navigateTo({
          url: '../../pages/collect/index',
        })
    }
})