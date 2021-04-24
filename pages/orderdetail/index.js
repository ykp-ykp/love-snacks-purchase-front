// pages/orderdetail/index.js
var utils = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    goods:{},
    order:{},
    address:{},
    state : ["已付款-等待收货...","已收货-待评价...","正在退货-处理中..."],
    operate: ["确认收货","去评价","取消退货"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取收货地址
    const address = wx.getStorageSync('address')
    this.setData({address})
    //获取订单编号
    this.setData({orderId:options.orderId})
  },
  onShow(){
    console.log("orderId = ",this.data.orderId)
    this.getTheOrder()   //获取订单之后，再根据商品名获取具体的商品
  },

  
  async getTheOrder(){
    let url = "http://localhost:8080/OrderController/getOrderByOrderId"
    let data = {orderId:this.data.orderId}
    utils.getDataFromMysql(url,data)
    .then(res=>{
      this.setData({order:res.data})
      this.getTheGoods();
    })
  },

  async getTheGoods(){
    let url = "http://localhost:8080/GoodsController/getGoodsByname"
    let data = {name:this.data.order.goodsName}
    utils.getDataFromMysql(url,data)
    .then(res=>{this.setData({goods:res.data})})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})