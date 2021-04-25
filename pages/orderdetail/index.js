// pages/orderdetail/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
var utils = require("../../utils/util")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    goods:{},
    order:{},
    address:{},
    state : ["已付款-等待收货...","已收货-待评价...","正在退货-处理中...","订单已评价..."],
    operate: ["确认收货","去评价","取消退货"],
    evaluation:{}
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
    //获取订单的评论信息
    this.getEvaluation()
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
      wx.setStorageSync('orderDetail', res.data)
      this.getTheGoods();
    })
  },

  async getTheGoods(){
    let url = "http://localhost:8080/GoodsController/getGoodsByname"
    let data = {name:this.data.order.goodsName}
    utils.getDataFromMysql(url,data)
    .then(res=>{
      this.setData({goods:res.data})
      wx.setStorageSync('goodsDetail', res.data)
    })
  },

  async Operate(options){

    let operateType = options.target.dataset.state
    if(operateType == 1){
      console.log("确认收货")
      await this.becomeWaitEvaluated();
    }else if(operateType == 2){
      wx.navigateTo({
        url: '../../pages/evaluate/index'
      })
    }else if(operateType == 3){
      console.log("取消退货")
      await this.becomeWaitEvaluated();
    }
    
  },

  //订单状态变为--已收货待评价状态
  async becomeWaitEvaluated(){
      var url = ""
      var data = {}
      let res =await showModal("是取消退货")
      if(res.confirm){
        url = "http://localhost:8080/OrderController/updateState"
        data = {
          state: 2,orderId:this.data.orderId
        }
        utils.Add(url,data)
        .then(
          wx.navigateBack({
            delta: 1,
          })
        )
      }
  },

  async getEvaluation(){
    let url = "http://localhost:8080/EvaluationController/getOneEvaluation"
    let data = {orderId:this.data.orderId,openid:app.globalData.openid}
    utils.getDataFromMysql(url,data)
    .then(res=>{
      this.setData({evaluation:res.data})
    })
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