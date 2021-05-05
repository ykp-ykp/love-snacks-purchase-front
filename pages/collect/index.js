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
        islogin:false,
        nocollection:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onShow(options) {
        console.log("collection onShow")
        await app.getCollectionByOpenid()
        var collections =await wx.getStorageSync('collections');
        
        if(collections.length==0)
            this.setData({collections,nocollection:true})
        else
            this.setData({ collections ,nocollection:false})
        if(app.globalData.islogin)
            this.setData({islogin:true})
    },
    
})