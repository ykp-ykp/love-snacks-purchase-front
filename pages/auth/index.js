import { login } from "../../utils/asyncWx.js";
var request_index = require("../../request/index");
import regeneratorRuntime from '../../libs/runtime.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    async handleGetUserInfo(e) {
        //下面是获取token
            var res = await request_index.request("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3aa5fd77324397d1&secret=8da3f2130f904f306d8409720e643ae0")
            var token = res.data.access_token
            console.log("token = ",token)
            wx.setStorageSync('token', token)
        //获取token-----------完毕
            wx.navigateBack({
                delta: 1
            });
    }
})