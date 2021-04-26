// pages/evaluate/index.js
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
var utils = require("../../utils/util")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: {},
    goodsDetail: {},
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let orderDetail = wx.getStorageSync('orderDetail');
    let goodsDetail = wx.getStorageSync('goodsDetail');
    this.setData({
      orderDetail,
      goodsDetail
    })
  },

  getContent(e) {
    let content = e.detail.value
    this.setData({
      content
    });
  },

  async submitEvaluation() {
    let time = utils.gettime()
    let url = "http://localhost:8080/EvaluationController/addEvaluation"
    let orderDetail = this.data.orderDetail
    let data = {
      orderId: orderDetail.orderId,
      openid: orderDetail.openid,
      goodsName: orderDetail.goodsName,
      time: time,
      content: this.data.content
    }
    await utils.Add(url, data)

    showToast("发表成功")
    //评价之后更改订单状态为4（已评价）
    await this.becomehaveEvaluated();
    //返回到订单界面
    setTimeout(function () {
      wx.navigateBack({
        delta: 2,
      })
    }, 1000)
  },

  async becomehaveEvaluated() {
    var url = "http://localhost:8080/OrderController/updateState"
    var data = {
      state: 4,
      orderId: this.data.orderDetail.orderId
    }
    await utils.Add(url, data)
  },
})