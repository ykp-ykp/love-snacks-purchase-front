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

    // async play() {
    //     try {
    //         const token = wx.getStorageSync('token');
    //         if (!token) {
    //             wx.navigateTo({
    //                 url: '/pages/auth/index',
    //             })
    //         } else {
    //             //订单参数
    //             const order_price = this.data.totalPrice;
    //             const consignee_add = this.data.address.all;
    //             const cart = this.data.cart
    //             let goods = [];
    //             cart.forEach(v => goods.push({
    //                 goods_id: v.goods_id,
    //                 goods_number: v.num,
    //                 goods_price: v.price
    //             }))
    //             const oderParams = { order_price, consignee_add, goods };
    //             //发送请求获取订单号参数
    //             const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: oderParams });
    //             //发支付接口
    //             const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
    //             //发起微信支付
    //             await requestPayment(pay)
    //                 //查看后台订单状态
    //             const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
    //             await showToast({ title: "支付成功" });
    //             //删除支付后对商品
    //             let newCart = wx.getStorageSync("cart");
    //             newCart = newCart.filter(v => !v.checked);
    //             wx.setStorageSync("cart", newCart);
    //             // 支付成功了 跳转到订单页面
    //             wx.navigateTo({
    //                 url: '/pages/order/index'
    //             });
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    async addOrder(v) { //v是购物车里面选中去支付的一项商品
        //创建订单并添加到数据库中

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