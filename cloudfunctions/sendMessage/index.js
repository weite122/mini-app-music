// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  try{
    const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      page: `/pages/blog-comment/blog-comment?blogId=${event.blogId}`,
      data: {
        phrase1: {
          value: '评价完成'
        },
        thing2: {
          value: event.content
        }
      },
      templateId: '702zfa_7t-BvP08DGbzk3QcB925lb_0pJbUrogpoNYc',
    })
    return result
  }catch (err) {
    return err
  }

}