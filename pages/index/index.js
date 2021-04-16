// import { request } from "../../request/index.js";
var request_index = require("../../request/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgs: [],
    cateList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getSwiperList();
    this.getCateList();
  },

  getSwiperList: function(){
    wx.cloud.callFunction({
      name: "getHomeSwiperImages",
      success: res=>{
        this.setData({
          swiperImgs: res.result.data
        })
        console.log("swiperImgs: ",this.data.swiperImgs)
        console.log("成功",res)
      },
      fail: res=>{
        console.log("失败",res)
      }
    })
  },

  getCateList: function(){
    var that = this;
    request_index.request("https://api-hmugo-web.itheima.net/api/public/v1/home/catitems")
    .then(function(result){
      //console.log(result)
      that.setData({
        cateList: result.data.message.splice(0,3)
      })
    })
  }
})