// pages/demo3/demo3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id: 0,
        name: "首页",
        isActive: true
      },
      {
        id: 1,
        name: "原创",
        isActive: false
      },
      {
        id: 2,
        name: "分类",
        isActive: false
      },
      {
        id: 3,
        name: "关于",
        isActive: false
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  handleItemChange: function(e){
    //子组件把通过triggerEvent("itemChange",index)函数触发父组件的事件并执行函数handleItemChange。index传递到父组件中，父组件修改tabs中的数据再传递给子组件进行显示
    //console.log(e)
    let index = e.detail;
    let {tabs} = this.data;
    this.data.tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })

  }
})