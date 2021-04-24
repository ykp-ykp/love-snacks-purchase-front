// pages/goods_detail/index.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
var request_index = require("../../request/index");
var utils = require("../../utils/util");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
    islogin: false,
    showModalStatus:false,
    num:1
  },
  url: "",
  goods_name: "",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goods_name = options.goods_name
    this.getGoodsDetail(this.goods_name)
  },

  onShow() {
    this.setData({
      islogin: app.globalData.islogin
    })
  },

  async getGoodsDetail(goods_name) {
    var data = {
      name: goods_name
    } //传递过去的goods_name属性
    var res = await utils.getDataFromMysql("http://localhost:8080/GoodsController/getGoodsByname", data);
    console.log(res)
    this.setData({
      goodsDetail: res.data
    })
  },

  handleCartAdd(e) {
    if (!this.data.islogin) {
      showToast("请登录")
      return
    }
    //加入购物车
    var cart = wx.getStorageSync("cart") || []
    let goodsInfo = this.data.goodsDetail
    var index = cart.findIndex(v => v.goodsName == goodsInfo.name)
    //判断购物车缓存中是否存在当前商品，如果有就返回该商品在缓存中的下标。如果不存在返回-1
    if (index == -1) {
      //如果缓存中不存在
      goodsInfo.weight = 1 //再多给他一个属性weight，记录当前商品在购物车中的数量
      //下面将这个商品添加到数据库中的cart表中
      this.addCart(goodsInfo);
    } else {
      cart[index].weight++
      //更新购物车里的商品的同时，更新缓存中的cart列表
      wx.setStorageSync('cart', cart)
      this.updateCart(cart[index]);
    }
    //更新缓存中的cart表
    //app.getCartFromMysql();
  },

  async addCart(goodsInfo) {
    //新商品加入购物车

    let url = "http://localhost:8080/CartController/addCart";
    let data = {
      openid: app.globalData.openid,
      nickName: app.globalData.userInfo.nickName,
      goodsName: goodsInfo.name,
      image: goodsInfo.image,
      price: goodsInfo.price,
      weight: goodsInfo.weight
    }
    //加入购物车的同时，更新缓存中的cart列表
    var cart = wx.getStorageSync('cart')
    cart.push(data)
    wx.setStorageSync('cart', cart)
    //更新缓存中的cart列表------

    let res = await utils.Add(url, data);
    if (res.data == 1)
      showToast("添加成功");
  },

  async updateCart(goodsInfo) {
    //购物车中已有商品，增加数量
    //这里面的goodsInfo是从cart里面提出来的。和addCart里面的goodsInfo不同。所以下面传递商品名的写法不同
    console.log("goodsInfo = ", goodsInfo)
    let url = "http://localhost:8080/CartController/updateItem";
    let data = {
      openid: app.globalData.openid,
      goodsName: goodsInfo.goodsName,
      weight: goodsInfo.weight
    }
    let res = await utils.Add(url, data); //更新数据库中cart表中该商品的数量
    if (res.data == 1)
      showToast("添加成功");
  },

  Purchase() {
    if (!this.data.islogin) {
      showToast("请登录")
      return
    }
    wx.showModal({
      title: "成功",
      icon: 'loading...', //图标，支持"success"、"loading" 
      image: this.data.goodsDetail.image, //自定义图标的本地路径，image 的优先级高于 icon

      success: function () {},
      fail: function () {},
      complete: function () {}
    })
  },





  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    this.setData({num})
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    this.setData({num})
  },
 
  //显示对话框
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },


})