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
<<<<<<< HEAD
    //评价之后更改订单状态为4（已评价）
    await this.becomehaveEvaluated();
    //返回到订单界面
=======
    //评价之后更改订单状态
    await this.becomehaveEvaluated();

>>>>>>> ae235de576df623a674cc90327334bfaa27f6f4c
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
<<<<<<< HEAD
=======
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
>>>>>>> ae235de576df623a674cc90327334bfaa27f6f4c
})