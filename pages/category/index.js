// pages/category/index.js
var request_index = require("../../request/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单的数据
    leftMenuList: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0,
    //右侧商品列表
    goodsList:[]
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
}

})