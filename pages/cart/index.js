import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../libs/runtime';
var request_index = require("../../request/index");
var utils = require("../../utils/util")
var app = getApp()
Page({

    data: {
        weserv:app.globalData.weserv,
        //收货地址
        address: {},
        //购物车,需要显示出来的
        cart: [],
        //每次从onload函数，从数据库中获取
        personalCart:[],
        // 全选状态
        allChecked: true,
        //总价
        totalPrice: 0,
        //总数量
        totalNum: 0,
        surplus: 0,
        islogin: false
    },
    async onLoad(){
        /*cart是一个数组，每一个元素表示一种商品。其中每一个元素又具有以下属性: name price image num(该商品的数量) checked(是否被选中)*/
    },

    async onShow() {
        //获取登录状态
        this.setData({
            islogin:app.globalData.islogin
        })
        //收货地址接收
        const address = wx.getStorageSync('address');
        this.setData({
                address
            })

        await this.getCartFromMysql();
       
        //购物车接收
        var cart = wx.getStorageSync('cart') || [];
        // if(!cart.hasOwnProperty("checked")){
        //     console.log("没有属性checked")
        //     cart.forEach(v=>{v.checked = false})
        // }  
        this.setCart(cart)
    },
    //添加收货地址事件
    async addressChoose() {
        try {
            const scope = await getSetting()
            if (scope === false) {
                await openSetting();
            }
            let address = await chooseAddress();
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
            console.log("address = ",address)
            wx.setStorageSync('address', address)
        } catch (err) {
            console.log(err);
        }
    },
    //商品选择状态改变
    handleItemChange(e) {
        const { name } = e.currentTarget.dataset;
        const { cart } = this.data;
        
        const index = cart.findIndex(v => v.goodsName === name);
        console.log("index = ",index)
        cart[index].checked = !cart[index].checked;
        //console.log("商品选择状态改变-cart = ",cart)
        console.log("name = ",name,"  index = ",index)
        this.setCart(cart)
    },
    // 全选按钮改变
    handleItemAllChange() {
        const { allChecked, cart } = this.data;
        cart.forEach(v => v.checked = !allChecked);
        this.setCart(cart)
    },
    //数量改变
    async numChange(e) {
        const { name, opration } = e.currentTarget.dataset;
        const { cart } = this.data;
        const index = cart.findIndex(v => v.goodsName === name);
        //获取该商品的余量
        app.globalData.AllGoods.forEach(v=>{
            if(v.name == name){
                this.setData({surplus: v.surplus})
            }
        })
        //获取该商品的余量--
        if (cart[index].weight === 1 && opration === -1) {
            const res = await showModal('是否删除商品')
            if (res.confirm) {
                cart.splice(index, 1);
                this.deleteItemFromCart(name);  //从数据库中的cart表中删除该商品
                this.setCart(cart)
                return
            }
        }if(cart[index].weight == this.data.surplus && opration === 1){
            showToast("余量不足")
            return
        }
        cart[index].weight += opration
        this.updateCart(name,cart[index].weight);  //更新数据库中的商品购物车数量
        this.setCart(cart)
    },
    //结算
    async allPlay() {
        const { totalNum, address } = this.data;
        if (!address.userName) {
            await showToast('未填联系方式')
        } else if (totalNum === 0) {
            await showToast('未选择商品')
        } else {
            wx.navigateTo({
                url: '/pages/pay/index',
            })
        }

    },
    //更新购物车数据
    setCart(cart) {
        let totalPrice = 0;
        let totalNum = 0;
        let allChecked = true
        cart.forEach(v => {
            if (v.checked) {  //当前商品被选中
                totalPrice += v.weight * v.price;
                totalNum += v.weight
            } else {
                allChecked = false
            }
        });
        allChecked = cart.length ? allChecked : false
        this.setData({
            cart,
            allChecked,
            totalPrice,
            totalNum
        })
        wx.setStorageSync('cart', cart)
    },

    async getCartFromMysql(){
        let url = "http://localhost:8080/CartController/getPersonalCart";
        let data = {
            openid:app.globalData.openid
        }
        var res = await utils.getDataFromMysql(url,data)
        this.setData({personalCart:res.data})
        console.log("数据库中的购物车 ",this.data.personalCart)
        wx.setStorageSync('cart', this.data.personalCart)
    },

    async deleteItemFromCart(goodsName){
        let url = "http://localhost:8080/CartController/deleteItemFromCart";
        let data = {openid:app.globalData.openid,goodsName:goodsName}
        await utils.Delete(url,data);  //更新数据库中cart表中该商品的数量
    },

    async updateCart(goodsName,weight){
        //在购物车界面点击+/-，更新数据库中树良
        let url = "http://localhost:8080/CartController/updateItem";
        let data = {openid:app.globalData.openid,goodsName:goodsName,weight:weight}
        await utils.Add(url,data);  //更新数据库中cart表中该商品的数量
      }

})