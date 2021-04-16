// pages/category/index.js
var request_index = require("../../request/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单的数据
    leftMenuList: [],
    //右侧的商品数据
    rightContent: [],
    //被点击的左侧菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0

  },
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
      1.先判断本地存储中有没有旧数据
        缓存数据： {time:Date.now(),data:[...]}
      2.没有的话就发送请求获取数据
      3.有就数据的话 同时就数据没有过期 就是用旧数据，不再发送请求
    */

    //1.先判断本地的缓存是否有数据
    const Cates = wx.getStorageSync("cates")
    if (!Cates) {
      //如果不存在
      this.getCatesByEs7()
    } else {
      //有旧的数据
      if (Date.now() - Cates.time > 1000 * 60) {
        //旧数据已经超过一分钟
        this.getCatesByEs7()
      } else {
        console.log("从缓存中读取数据,不用发送请求")
        //查看是否发送请求：调试器-->Network-->选择XHR。
        //如果下面的Name有，就是发送了请求（且是请求连接的最后一个单词）。如果没有就是为发送请求
        this.Cates = Cates.data //左边Cates是要用的数据，右边的Cates是缓存中的数据

        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[this.data.currentIndex].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }

    }
  },

  getCates() {
    //getCates方法和getCatesFromCloud作用完全一样，就是为了获取数据。知识getCatesFromCloud是从我的云数据库中获取的，二getCates是从别人的api获取的。如果想换直接在调用的地方换一下函数名即可
    request_index.request("https://api-hmugo-web.itheima.net/api/public/v1/categories")
      .then(res => {
        console.log("获取到的全部数据：", res)
        this.Cates = res.data.message;
        //把请求到的数据放入缓存中
        wx.setStorageSync('cates', {
          time: Date.now(),
          data: this.Cates
        })

        //取每个第一层的数组的属性为cat_name的值作为一个数组
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[this.data.currentIndex].children
        // 右侧的商品信息是一个数组类型。每一个是一大类，例如大家电、热门推荐、海外购

        this.setData({
          leftMenuList,
          rightContent
        })
        //console.log("rightContent:  ", rightContent)
      })
      .catch(res => {
        console.log("失败", res)
      })
  },

  handleMenuItem(e) {
    let idx = e.currentTarget.dataset.idx
    //点击不同的分类以后，要更新右侧的商品信息。即从Cates数组里面取出对应的商品
    let rightContent = this.Cates[idx].children
    this.setData({
      currentIndex: idx,
      rightContent: rightContent,
      //重新设置scroll-view距离顶部的距离，使页面的scroll-top刷新
      scrollTop: 0
    })
  },

  getCatesFromCloud() {
    //getCates方法和getCatesFromCloud作用完全一样，就是为了获取数据。知识getCatesFromCloud是从我的云数据库中获取的，二getCates是从别人的api获取的。如果想换直接在调用的地方换一下函数名即可
    wx.cloud.callFunction({
      name: "getJMYPGoods",
      success: res => {
        this.Cates = res.result.data
        console.log("云函数获取数据成功：", this.Cates)
        //把请求到的数据放入缓存中
        wx.setStorageSync('cates', {
          time: Date.now(),
          data: this.Cates
        })

        //取每个第一层的数组的属性为cat_name的值作为一个数组
        let leftMenuList = this.Cates.map(v => v.cat_name)
        let rightContent = this.Cates[this.data.currentIndex].children
        // 右侧的商品信息是一个数组类型。每一个是一大类，例如大家电、热门推荐、海外购

        this.setData({
          leftMenuList,
          rightContent
        })
      },
      fail: res => {
        console.log("获取失败", res)
      }
    })
  },

  async getCatesByEs7() {
    /*async就是加载片普通函数前面，会将那个函数改成异步函数，
    await关键字，只能在async里面出现，两者结合，异步代码可以写成同步形式
    不需要再写.then函数以及.catch函数
    wx.request()本身是一种异步请求*/
    const res = await request_index.request("https://api-hmugo-web.itheima.net/api/public/v1/categories")
    console.log("通过es7的async获取到的全部数据：", res)
    this.Cates = res.data.message;
    //把请求到的数据放入缓存中
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    })

    //取每个第一层的数组的属性为cat_name的值作为一个数组
    let leftMenuList = this.Cates.map(v => v.cat_name)
    let rightContent = this.Cates[this.data.currentIndex].children
    // 右侧的商品信息是一个数组类型。每一个是一大类，例如大家电、热门推荐、海外购

    this.setData({
      leftMenuList,
      rightContent
    })
    //console.log("rightContent:  ", rightContent)
  }

})

/*
AJAX的核心是客户端的JavaScript程序能够实现异步执行,异步执行是相对与同步执行的.同步执行意味着代码必须顺序执行,在此给你举个例子,你就会明白了!

Line_1
Line_2
Line_3

Line_1必须执行完后,才能执行Line_2.Line_1可能调用的是一个函数,有可能这个函数很复杂,需要运行几小时能才运算完毕,而这个时候,你必须等,等到Line_1完全执行完毕,你才能执行Line_2,同理,Line_3也是!

异步则不同,还是假定Line_1,要调用的函数要执行几个小时,而这个时候,你就不必要等Line_1执行完毕才去执行Line_2,同理,Line_3也是!

异步执行中有一个非常特殊的功能,那就是回调.同样是上面的那个例子,Line_1在调用函数时可以指定函数执行完后要调用的另一个函数.当过了几个小时后,函数执行完毕了(当然这中意也有可能会出现错误),它会发出一个回调命令,这个命令会调用指定的另一个函数,从而通知程序"执行完了".如果可以,还会传递一些参数,这些参数可能就是几个小时以来运算的结果!

不知道我这样讲你有没有明白!至于AJAX怎么用,如何去解决AJAX出现的问题(比如书签问题,后退按钮的问题等),你可以自己去找这方面的资料看看
*/