// pages/category/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
var request_index = require("../../request/index");
var utils = require("../../utils/util");
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weserv:app.globalData.weserv,
    //左侧菜单的数据
    leftMenuList: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
    //右侧商品列表
    goodsList:[],
  },
  AllGoods:[],
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    /*
      1.先判断本地存储中有没有旧数据
        缓存数据： {time:Date.now(),data:[...]}
      2.没有的话就发送请求获取数据
      3.有就数据的话 同时就数据没有过期 就是用旧数据，不再发送请求
    */
    var AllGoods = wx.getStorageSync("AllGoods")

    if (!AllGoods) {
      //如果不存在
      await this.getAllGoods()
    } else {
      //有旧的数据
      if (Date.now() - AllGoods.time > 1000 * 60) {
        //旧数据已经超过一分钟
        await this.getAllGoods()
      } else {
        this.AllGoods = AllGoods.data //左边goodsList是要用的数据，右边的goodsList是缓存中的数据
        console.log("从缓存中获取AllGoods = ",this.AllGoods) 
      }
    }
    this.getLeftMenuList();
    this.getGoodsList();
  },

  onShow(){
    //this.getAllType();
  },

  handleMenuItem(e) {
    let idx = e.currentTarget.dataset.idx
    //点击不同的分类以后，要更新右侧的商品信息。即从Cates数组里面取出对应的商品
    this.setData({
      currentIndex: idx,  //更新左侧的商品类型下标（在getGoodsList中使用来获取goodsList）
      scrollTop: 0
    })
    this.getGoodsList()
  },


  async getAllGoods() {
    
    var res = await request_index.request("http://localhost:8080/GoodsController/getAllGoods");
    console.log("从数据库中获取AllGoods = ",res.data)
    this.AllGoods =  res.data;
    //把请求到的数据放入缓存中
    wx.setStorageSync('AllGoods', {
      time: Date.now(),
      data: this.AllGoods
    })
  },


  //获取商品的所有类型
  async getLeftMenuList(){

    var allTypes = []
    this.AllGoods.forEach(element => {
      if(!allTypes.includes(element.type))
      allTypes.push(element.type)
    });
    this.setData({leftMenuList:allTypes})
    wx.setStorageSync("allTypes",allTypes)
 },

 async getGoodsList() {

    var goodslist = [];
    var type = this.data.leftMenuList[this.data.currentIndex];
    this.AllGoods.forEach(element => {
      if(element.type == type)
      goodslist.push(element)
    });
    this.setData({goodsList:goodslist})
},


//下面三个函数是点击购物车图片时使用的
  handleCartAdd(options) {
    if (!app.globalData.islogin) {
      showToast("请登录")
      return
    }
    let goodsname = options.target.dataset.goodsname;
    let goodsInfo;
    this.data.goodsList.forEach(v=>{if(v.name==goodsname)goodsInfo = v})
    
    var cart = wx.getStorageSync("cart") || []
    
    console.log("goodsInfo = ", goodsInfo)
    var index = cart.findIndex(v => v.goodsName == goodsInfo.name)
    //判断购物车缓存中是否存在当前商品，如果有就返回该商品在缓存中的下标。如果不存在返回-1
    console.log("cart = ", cart, "--goodsInfo = ", goodsInfo)
    console.log(index)
    if (index == -1) {
      //如果缓存中不存在
      goodsInfo.weight = 1 //再多给他一个属性weight，记录当前商品在购物车中的数量
      //下面将这个商品添加到数据库中的cart表中
      this.addCart(goodsInfo);
    } else {
      cart[index].weight++
      wx.setStorageSync('cart', cart)
      this.updateCart(cart[index]);
    }
    //更新缓存中的cart表
    //app.getCartFromMysql()
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
    //更新缓存中的cart列表
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

})