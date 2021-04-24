//app.js
var request_index = require("request/index");
App({
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function(options){
    wx.cloud.init({
      env: "ykp01-5giep5nk41b0c14e"
    })
    this.getAllGoods();
  },

  async getAllGoods() {
    var res = await request_index.request("http://localhost:8080/GoodsController/getAllGoods");
    this.globalData.AllGoods = res.data
  },

  onShow: function(options){

  },
  onHide: function(){

  },
  onError: function(msg){

  },
  //options(path,query,isEntryPage)
  onPageNotFound: function(options){

  },
  globalData: {
    userInfo: "",
    isLogin:false,
    openid:"",
    AllGoods:[],
    secret:"secret:'8da3f2130f904f306d8409720e643ae0"
  }
});