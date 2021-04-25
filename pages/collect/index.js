// pages/collect/collect.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //收藏数据
        collect: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function(options) {
        const collect = wx.getStorageSync('collect');
        this.setData({ collect })
    },
    
})