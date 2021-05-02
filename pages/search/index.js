// pages/search/index.js
var utils = require("../../utils/util")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weserv:app.globalData.weserv,
    goodsList:[],
    content:""//搜索内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getContent(e){
    var content = e.detail;
    this.setData({content})
  },

  async toSearch(){
    let url = "http://localhost:8080/GoodsController/FuzzyQuery"
    let data={name:this.data.content}
    let res =await utils.getDataFromMysql(url,data)
    console.log(res)
    this.setData({goodsList:res.data})
  }
  
})