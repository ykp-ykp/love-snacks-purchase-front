// pages/demo2/demo2.js
var request_index = require("../../request/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    AccountList: [],
    hasAccount: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  async getAccounts(e) {
    //下面是调用ssm项目里面的tomcate服务器地址
    // http://localhost:8080/success
    var url = "http://localhost:8080/Controller/getAllAccounts"
    const res = await request_index.request(url)
    console.log("从ssm项目中获取的数据如下", res.data)

    this.setData({
      AccountList: res.data
    })
    if (this.data.AccountList)
      this.setData({
        hasAccount: true
      })
  },

  async InsertAccount(e) {
    let account = e.detail.value  //获取从表单form提交的数据

    wx.request({
      url: 'http://localhost:8080/Controller/insert',
      data: {
        id: account.id,
        name: account.name,
        money: account.money
      },
      
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: res => {
        if (res.data == "1"){
          wx.showToast({
            title: '添加成功',
          })
          this.getAccounts()
        }
          
        else
          wx.showToast({
            title: '添加失败',
          })
      }
    })
  },

  getPhoneNumber: function (e) {
    console.log(e)
  },

  getUserInfo: function (e) {
    console.log(e)

  },
  contact: function (e) {
    console.log(e)
  }
})