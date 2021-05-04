// pages/orderdetail/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
var utils = require("../../utils/util")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weserv:app.globalData.weserv,
    orderId:"",
    goods:{},
    order:{},
    address:{},
    state : ["已付款-待发货...","已收货-待评价...","正在退货-处理中...","订单已评价...","已发货","订单已完成退货"],
    operate: ["申请退货","去评价","取消退货","确认收货"],
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
      //获取订单的评论信息
      this.getEvaluation()
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
    // <!-- 1：确认收货，2：去评价，3：取消退货，4：查看评价内容（无操作），5：申请退货 -->
    let operateType = options.target.dataset.state
    if(operateType == 1){
      console.log("确认收货")
      await this.becomeWaitEvaluated();
    }else if(operateType == 2){
      console.log("去评价")
      wx.navigateTo({
        url: '../../pages/evaluate/index'
      })
    }else if(operateType == 3){
      console.log("取消退货")
      await this.becomeToBeReceive();
    }else if(operateType ==5){
      console.log("申请退货")
      await this.becomeReturnGoods();
    }
    
  },

  //订单状态变为--已收货待评价状态
  async becomeWaitEvaluated(){
      var url = ""
      var data = {}
      let res =await showModal("是否确认收货")
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

  //订单取消退货，变成等待收获中的已发货
  async becomeToBeReceive(){
    var url = ""
    var data = {}
    let res =await showModal("是否取消退货")
    if(res.confirm){
      url = "http://localhost:8080/OrderController/updateState"
      data = {
        state: 5,orderId:this.data.orderId
      }
      utils.Add(url,data)
      .then(
        wx.navigateBack({
          delta: 1,
        })
      )
    }
  },

  //订单申请退货
  async becomeReturnGoods(){  
    var url = ""
    var data = {}
    let res =await showModal("是否申请退货")
    if(res.confirm){
      url = "http://localhost:8080/OrderController/updateState"
      data = {
        state: 3,orderId:this.data.orderId
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
    console.log(this.data.order.state)
    if(this.data.order.state == 4){
      let url = "http://localhost:8080/EvaluationController/getOneEvaluation"
      let data = {orderId:this.data.orderId,openid:app.globalData.openid}
      utils.getDataFromMysql(url,data)
      .then(res=>{
        this.setData({evaluation:res.data})
      })
    }
  },

})