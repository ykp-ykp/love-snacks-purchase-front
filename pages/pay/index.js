import {
    requestPayment,
    showToast,
    showModal
} from "../../utils/asyncWx.js";
const {
    request
} = require('../../request/index.js')
var utils = require("../../utils/util")
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        weserv:app.globalData.weserv,
        //收货地址
        address: {},
        //购物车
        cart: [],
        //总价
        totalPrice: 0,
        //总数量
        totalNum: 0,
        userInfo: [],
        openid: ""
    },
    onShow() {

        //console.log("userinfo = ",app.globalData.userInfo)
        //收货地址接收
        const address = wx.getStorageSync('address');
        //购物车接收
        let cart = wx.getStorageSync('cart') || [];
        cart = cart.filter(v => v.checked);
        let totalPrice = 0;
        let totalNum = 0;
        cart.forEach(v => {
            totalPrice += v.weight * v.price;
            totalNum += v.weight
        });
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address,
            userInfo: app.globalData.userInfo,
            openid: app.globalData.openid
        })
    },
    //支付

    async play() {
        var that = this
        try {
            const token = wx.getStorageSync('token');
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index',
                })
            } else {
                //订单参数
                const res = await showModal('是否确认付款')
                if (res.confirm) {
                    that.data.cart.forEach(v => {
                        console.log("支付了商品：", v.goodsName)
                        this.addOrder(v)
                    })

                    showToast("支付成功");
                    //从数据库中的cart表中删除支付后对商品
                    that.data.cart.forEach(v => {
                        console.log("从数据库cart中删除了了商品：", v.goodsName)
                        this.deleteItemFromCart(v.goodsName)
                    })
                    showToast("支付成功")
                    // 支付成功了 跳转到订单页面
                    setTimeout(function () {
                        wx.switchTab({
                            url: '/pages/cart/index'
                        })
                    }, 1000);

                } else {
                    showToast("取消支付")
                }
            }
        } catch (err) {
            console.log(err);
        }
    },

    async addOrder(v) { //v是购物车里面选中去支付的一项商品
        //创建订单并添加到数据库中
        console.log("购买的商品：",v)
        let orderId = new Date().getTime() + Math.random().toString(36).substring(2)
        let openid = this.data.openid
        let nickName = this.data.userInfo.nickName
        let goodsName = v.goodsName
        let price = v.price
        let weight = v.weight
        let totalPrice = v.price * v.weight
        let state = 1 //表示已付款
        let time = utils.gettime()
        let url = "http://localhost:8080/OrderController/addOrder"
        let data = {
            orderId: orderId,
            openid: openid,
            nickName: nickName,
            goodsName: goodsName,
            price: price,
            weight: weight,
            totalPrice: totalPrice,
            state: state,
            time: time,
        }
        console.log("即将加入订单的商品：", data)
        await utils.Add(url,data)  //向数据库中的order表添加数据
        //下面应该增加商品的销量和余量
        let res = await utils.getDataFromMysql("http://localhost:8080/GoodsController/getGoodsByname",{name:v.goodsName})
        this.updateSurplus(v.weight,res.data)
        this.updateSales(v.weight,res.data)
    },

    async updateSurplus(weight,goods){
        let surplus = goods.surplus-weight;
        let url = "http://localhost:8080/GoodsController/updateSurplus"
        let data = {name:goods.name,surplus:surplus}
        await utils.Update(url,data)
    },

    async updateSales(weight,goods){
        let sales = goods.sales+weight;
        let url = "http://localhost:8080/GoodsController/updateSales"
        let data = {name:goods.name,sales:sales}
        await utils.Update(url,data)
    },

    async deleteItemFromCart(goodsName) {
        let url = "http://localhost:8080/CartController/deleteItemFromCart";
        let data = {
            openid: app.globalData.openid,
            goodsName: goodsName
        }
        await utils.Delete(url, data); //更新数据库中cart表中该商品的数量
    },
    
})