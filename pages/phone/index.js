// pages/phone/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
var request_index = require("../../request/index")
var utils = require("../../utils/util")
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputText:"",
    openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({openid:options.openid})
  },

  async onShow(){
    var res =await utils.getDataFromMysql("http://localhost:8080/UserController/getUserByOpenid",{openid:this.data.openid})
    let user = res.data
    this.setData({inputText:user.phone})
  },

  handleInputPhone(e) {
    this.setData({
        inputText: e.detail.value
    })
  },

  handleFormSubmit(){
    var phone = this.data.inputText
    if(phone.length!=11){
      showToast("长度错误")
    }else{
      this.alterUser()
    }
  },

  async alterUser(){
    var phone = this.data.inputText
        let url = 'http://localhost:8080/UserController/updateUser';
        let data = {
            openid: this.data.openid,
            phone:phone
        }
        await utils.Update(url,data);
        showToast("修改成功")
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000);
  }

})