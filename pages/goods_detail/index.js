// pages/goods_detail/index.js
var request_index = require("../../request/index")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:[]
  },
  url:"",
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.goods_id = options.goods_id
    this.url = "https://api-hmugo-web.itheima.net/api/public/v1/goods/detail?goods_id="+this.goods_id
    this.getGoodsDetail(this.url)
  },

  async getGoodsDetail(url){
    const res = await request_index.request(url)
    this.setData({
      goodsDetail: res.data.message
    })
  },

  handlePrevewImage(e){
    //预览大图
    let urls = e.currentTarget.dataset.urls.map(v=>v.pics_mid)
    //上面的map是构造新数组，及取每一个元素中的pics_mid作为新数组。
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: urls,
    })
  },

  handleCartAdd(e){
    //加入购物车
    let cart = wx.getStorageSync("cart")||[]
    let goodsInfo = this.data.goodsDetail
    var index = cart.findIndex(v=>v.goods_id==goodsInfo.goods_id)
    //判断购物车缓存中是否存在当前商品，如果有就返回该商品在缓存中的下表。如果不存在返回-1
    console.log(index)
    if(index==-1){
      //如果缓存中不存在
      goodsInfo.num = 1 //再多给他一个属性num，记录加入购物车的数量
      cart.push(goodsInfo)
    }
    else{
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入购物车成功',
      mask: true
      // mask限制用户一直点击页面，1.5s后才可以点击
    })
  }

})