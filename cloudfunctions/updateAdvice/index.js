// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'leavesystemsata-4iipn',
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    console.log(event)
    return await db.collection('classLeave').doc(event.id).update({
      // data 传入需要局部更新的数据
      
      data: {
        _openid: wxContext.OPENID,
        headTeacherAdvice: event.headTeacherAdvice
      }
    })
  } catch (e) {
    console.error(e)
  }
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}