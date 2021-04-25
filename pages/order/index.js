var request_index = require("../../request/index");
var utils = require("../../utils/util");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        name:"全部",
        isActive:true
      },
      {
        id:1,
        name:"待收货",
        isActive:false
      },
      {
        id:2,
        name:"待评价",
        isActive:false
      },
      {
        id:3,
        name:"退货中",
        isActive:false
      },
      {
        id:4,
        name:"已评价",
        isActive:false
      }
    ],
    state : ["等待收货","待评价","退货中","已评价"]
  },

  onLoad(options){
    //首先获从“我的”页面点击的是什么类型的订单（范围是0-4）
    let state = options.state

    //根据点击的订单类型，更新顶部tabs选中状态
    let {tabs}=this.data;
    tabs.forEach((v,i)=>{i==state?v.isActive=true:v.isActive=false});
    this.setData({tabs})
    //根据点击的订单类型，更新顶部tabs选中状态-----end

  },

  async onShow(){
    /*
      每一次进入订单页面的时候，都获取一下tabs中被选中的类型，然后再根据这个类型去获取数据库中的订单
    */
    /*
    //onShow()函数不能通过options获取参数，onLoad可以通过options获取参数
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    var options = currentPage.options    //如果要获取url中所带的参数可以查看options
    var state = options.state   //通过navigate中的url传递过来的值可以使用e来获取
    */
    let {tabs}=this.data;
    var state;
    tabs.forEach((v,i)=>{
      if(v.isActive==true)
      state = i
    });

    await this.getOrders(state);
  },

  async getOrders(state){
    
    console.log("state = ",state)
    //0：全部，1：待收货，2：待评价，3：退货，4：已评价（把数据库中也设计成这样对应的关系）
    var url = ""
    var data = {};
    if(state == 0){
      url = "http://localhost:8080/OrderController/getOrderByOpenid"
      data = { openid:app.globalData.openid }
    }
    else{
      url = "http://localhost:8080/OrderController/getSpecialOrdersByOpenid"
      data = { openid:app.globalData.openid,state:state}
    }
    var res=await utils.getDataFromMysql(url,data)
    this.setData({orders:res.data})
  },

  changeTitleByIndex(index){
    let {tabs}=this.data;
    this.data.tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },

  handletabsitemchange(e){
    var index = e.detail;
    this.changeTitleByIndex(index);
    /*
      这里tabs里面刚好从0开始
      0对应 全部
      1对应 待收货 
      2对应 待评价
      3对应 退货
      数据库中的state对应也是如此
    */
    this.getOrders(index);  //重新获取不同类型订单
  },

  goOrderDetail(options){
    let orderId = options.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../../pages/orderdetail/index?orderId='+orderId
    })
  }
  
})