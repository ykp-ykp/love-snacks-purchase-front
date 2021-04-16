// pages/goods_list/index.js
/*
  用户上滑页面 滑动条触底 开始加载下一页数据
1.滚动条触底时出发的函数：onReachBottom
2.判断还有没有下一页数据
  1.获取总页数
    总页数 = Math.clie(总条数/页容量)
  2.获取当前的页码
  3.判断当前页码是否大于等于总页数，在进行提示数据已加载完毕  
*/
var request_index = require("../../request/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        name: "综合",
        isActive: true
      },
      {
        id: 1,
        name: "销量",
        isActive: false
      },
      {
        id: 2,
        name: "价格",
        isActive: false
      }
    ],
    goodsList:[]
  },

  QueryParams: {
    query: "",
    cat_id: "",
    pagenum: 1,
    pagesize: 10
  },
  url:"",
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cat_id = options.cat_id
    
    this.url = "https://api-hmugo-web.itheima.net/api/public/v1/goods/search?cid="+this.QueryParams.cat_id+"&pagenum="+this.QueryParams.pagenum+"&pagesize="+this.QueryParams.pagesize
    //console.log("url: ",this.url)
    this.getGoodsList(this.url)
  },

  async getGoodsList(url) {
    const res = await request_index.request(url)
    //console.log("res = ", res)
    const total = res.data.message.total  //商品信息总条数
    this.totalPages = Math.ceil(total/this.QueryParams.pagesize)
    //console.log("总页数：",this.totalPages)
    this.setData({
      goodsList: this.data.goodsList.concat(res.data.message.goods)
      //goodsList: [...this.data.goodsList,...res.data.message.goods]  解构之后再合并也可以
    })
    console.log("goodsList = ",this.data.goodsList)
    wx.stopPullDownRefresh()//加载完成，停止下拉刷新效果
  },

  handleItemChange(e) {
    let index = e.detail
    var {
      tabs
    } = this.data
    for (let i = 0; i < tabs.length; i++) {
      if (i == index)
        tabs[i].isActive = true
      else
        tabs[i].isActive = false
    }
    this.setData({
      tabs
    })
  },

  onReachBottom(){
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '无更多数据',
      })
    }
    else{
      this.QueryParams.pagenum++
      this.getGoodsList(this.url)
    }
  },

  onPullDownRefresh(){
    this.setData({
      goodsList:[]
    })
    this.QueryParams.pagenum = 1
    this.getGoodsList(this.url)
  }
})