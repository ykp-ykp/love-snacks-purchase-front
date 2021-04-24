// pages/addGoods/index.js

var utils = require("../../utils/util")
Page({

  data: {
    //options子组件需要的数据

    selectArray: [{
      "id": "1",
      "text": "无辣不欢"
    }, {
      "id": "2",
      "text": "饮料牛奶"
    },{
      "id": "3",
      "text": "方便面"
    }, {
      "id": "4",
      "text": "瓜子坚果"
    },{
      "id": "5",
      "text": "仙女专用"
    },{
      "id": "6",
      "text": "糖果果冻"
    }, {
      "id": "7",
      "text": "休闲零食"
    }, {
      "id": "8",
      "text": "纸品清洁"
    }, {
      "id": "9",
      "text": "日用百货"
    }],

    chooseResult:[],
    name:"",
    price:0.0,
    type:"",
    surplus:0,
    discount:0.0,
    information:"",
    imgurl:""
  },

  onLoad: function (options) {
    // this.setData({
    //   selectArray: wx.getStorageSync("allTypes")
    // })
    
    // var i = 1;
    // (this.data.selectArray).forEach(v=>{
    //   v.id = i++
    //   v.text = v.name
    // })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  getName(e){
    this.setData({name:e.detail.value})
  },
  getPrice(e){
    this.setData({price:e.detail.value})
  },
  //组建的getData代替了getType函数，该函数已无作用
  getType(e){
    this.setData({type:e.detail.value})
  },
  getSurplus(e){
    this.setData({surplus:e.detail.value})
  },
  getDiscount(e){
    this.setData({discount:e.detail.value})
  },
  getInformation(e){
    this.setData({information:e.detail.value})
  },

  uploadimage() {
    console.log("选择图片")
    // 让用户选择一张图片
    wx.chooseImage({
      success: chooseResult => {
        //先选择图片
        console.log(chooseResult)
        this.setData({chooseResult})
      }
    })
  },

  async AddGoods(){

    //因为上传图片到云端的函数wx.cloud.uploadFile是异步函数，所以需要用Promise封装起来实现同步
    var res = await utils.uploadFile(this.data.chooseResult.tempFilePaths[0])//传入选择的图片的临时路径
    this.setData({
      imgurl: res.fileID
    })

    var url = 'http://localhost:8080/GoodsController/addGoods'
    var data = {
        name:this.data.name,price:this.data.price,type:this.data.type,
        surplus:this.data.surplus,discount:this.data.discount,sales:0,
        image:this.data.imgurl,
        information:this.data.information
    }
    console.log("即将添加的商品：",data)
    var res = await utils.Add(url,data)
    console.log(res)
    
  },

  reset(){
    this.setData({name:"",price:0.0,
      surplus:0,discount:0.0,image:"",
      information:"",chooseResult:[]})
  },

  getDate(e){//options子组件触发事件
    this.setData({
      type:e.detail.text
    })
  }
})