//初始化数据库
const db = wx.cloud.database();
//获取学生基本信息集合
const student = db.collection("student");
Page({

  //提交按钮的响应事件
  studentSubmit:function(event){
    var username = event.detail.value.username
    var pwd = event.detail.value.pwd
    var name = event.detail.value.name
    var className = event.detail.value.className
    var usernametest = /^[0-9]{9}$/  //用正则表达式来检测账号是否合规范
    if (usernametest.test(username)) {  //检测输入的账号是否已被注册
      student.where({  
        username: username
      }).get().then(res => {
        if (res.data[0] == null) {  //如果未注册，就将学生基本信息写入数据库
          if (pwd !== null && name !== null && className !== null){
            student.add({
              data: {
                username: event.detail.value.username,
                pwd: event.detail.value.pwd,
                name: event.detail.value.name,
                className: event.detail.value.className
              }
            }).then(res => {
              //注册成功，跳转至登陆页面
              wx.showToast({
                title: '注册成功',
              })
              wx.redirectTo({
                url: '../login/login',
              })
            })
          }else{
            wx.showToast({
              title: '信息不完整',
            })
            return
          } 
        } else {
          wx.showToast({
            title: '用户名已被注册',
          })
          return
        }
      })
    }else{
      wx.showToast({
        title: '账号格式错误',
      })
    } 
  }
})