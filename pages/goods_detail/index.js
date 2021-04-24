// pages/goods_detail/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
var request_index = require("../../request/index");
var utils = require("../../utils/util");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:{},
    islogin:false
  },
  url:"",
  goods_name:"",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goods_name = options.goods_name
    this.getGoodsDetail(this.goods_name)
  },

  onShow(){
      this.setData({
        islogin:app.globalData.islogin
      })
  },

  async getGoodsDetail(goods_name){
    var data = {name:goods_name}  //传递过去的goods_name属性
    var res = await utils.getDataFromMysql("http://localhost:8080/GoodsController/getGoodsByname",data);
    console.log(res)
    this.setData({
      goodsDetail: res.data
    })
  },

  handleCartAdd(e){
    if(!this.data.islogin){
      showToast("请登录")
      return
    }
    //加入购物车
    let cart = wx.getStorageSync("cart")||[]
    let goodsInfo = this.data.goodsDetail
    console.log("goodsInfo = ",goodsInfo)
    var index = cart.findIndex(v=>v.goodsName==goodsInfo.name)
    //判断购物车缓存中是否存在当前商品，如果有就返回该商品在缓存中的下标。如果不存在返回-1
    console.log("cart = ",cart,"--goodsInfo = ",goodsInfo)
    console.log(index)
    if(index==-1){
      //如果缓存中不存在
      goodsInfo.weight = 1 //再多给他一个属性weight，记录当前商品在购物车中的数量
      //goodsInfo.cheched = false;
      //cart.push(goodsInfo)
      //下面将这个商品添加到数据库中的cart表中
      this.addCart(goodsInfo);
    }
    else{
      cart[index].weight++
      this.updateCart(cart[index]);
    }
    console.log("cart = ",cart)
    //wx.setStorageSync('cart', cart)
    // wx.showToast({
    //   title: '加入购物车成功',
    //   mask: true
    //   // mask限制用户一直点击页面，1.5s后才可以点击
    // })
  },
  async addCart(goodsInfo){

    //新商品加入购物车
    console.log("goodsInfo = ",goodsInfo)
    let url = "http://localhost:8080/CartController/addCart";
    let data = {openid:app.globalData.openid,nickName:app.globalData.userInfo.nickName,
    goodsName:goodsInfo.name,image:goodsInfo.image,price:goodsInfo.price,weight:goodsInfo.weight}
    let res = await utils.Add(url,data);
    if(res.data == 1)
      showToast("添加成功");
  },
  
  async updateCart(goodsInfo){
    //购物车中已有商品，增加数量
    //这里面的goodsInfo是从cart里面提出来的。和addCart里面的goodsInfo不同。所以下面传递商品名的写法不同
    console.log("goodsInfo = ",goodsInfo)
    let url = "http://localhost:8080/CartController/updateItem";
    let data = {openid:app.globalData.openid,goodsName:goodsInfo.goodsName,weight:goodsInfo.weight}
    let res = await utils.Add(url,data);  //更新数据库中cart表中该商品的数量
    if(res.data == 1)
      showToast("添加成功");
  }

})