// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await cloud.database().collection("images").where({
    type: "home-swiper"
  })
  .get()
  .then(res=>{
    return res
  })
  .catch(res=>{
    return res
  })
}