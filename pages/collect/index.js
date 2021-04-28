// pages/collect/collect.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        weserv:app.globalData.weserv,
        //收藏数据
        collections: [],
        islogin:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onShow(options) {
        await app.getCollectionByOpenid()
        const collections = wx.getStorageSync('collections');
        this.setData({ collections })
        if(app.globalData.islogin)
            this.setData({islogin:true})
    },
    
})