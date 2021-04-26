import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/asyncWx.js";
var request_index = require("../../request/index")
var utils = require("../../utils/util")
var app = getApp()

Page({
  data: {
      //文本输入内容
      inputText: '',
      radioItem:""
  },

  //输入栏同步数据
  handleInputText(e) {
      this.setData({
          inputText: e.detail.value
      })
  },
  //提交表单
  async handleFormSubmit() {
      const { inputText } = this.data;
      if (!inputText.trim()) {
          wx.showToast({
              title: '输入不合法',
              icon: 'none',
              mask: true
          })
      }else{
        //把反馈信息上传到数据库中
        let time = utils.gettime()
        let url = "http://localhost:8080/FeedbackController/addFeedback"
        let data = {openid:app.globalData.openid,nickName:app.globalData.userInfo.nickName,
        type:this.data.radioItem,content:this.data.inputText,time:time}
        await utils.Add(url,data)
        showToast("反馈成功")
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000);
      }
  },
  
  radioChange(e){
    this.setData({radioItem:e.detail.value})
  }
})