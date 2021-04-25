//app.js
var request_index = require("request/index");
var utils = require("utils/util");
App({
  //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
  onLaunch: function(options){
    wx.cloud.init({
      env: "ykp01-5giep5nk41b0c14e"
    })
    this.getAllGoods();
    //首先加载收藏夹
    //this.getCollectionByOpenid()
  },

  async getAllGoods() {
    var res = await request_index.request("http://localhost:8080/GoodsController/getAllGoods");
    this.globalData.AllGoods = res.data
  },

  async getCartFromMysql() {
    let url = "http://localhost:8080/CartController/getPersonalCart";
        let data = {
            openid:this.globalData.openid
        }
        var res = await utils.getDataFromMysql(url,data)
        wx.setStorageSync('cart', res.data)
  },

  async getCollectionByOpenid(){
    //更新缓存中的收藏表数据
    let url = "http://localhost:8080/CollectionController/getByOpenid"
    let data = {openid:this.globalData.openid}
    let res =await utils.getDataFromMysql(url,data);
    wx.setStorageSync('collections', res.data)
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