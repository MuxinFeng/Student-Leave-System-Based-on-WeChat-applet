const db = wx.cloud.database();
const counselor = db.collection("counselor");
Page({

  studentSubmit: function (event) {
    var username = event.detail.value.username
    var usernametest = /^[0-9]{6}$/
    if (usernametest.test(username)) {
      counselor.where({
        username: username
      }).get().then(res => {
          if (res.data[0] == null) {
            if (pwd !== null && name !== null && className !== null) {
              student.add({
                data: {
                  username: event.detail.value.username,
                  pwd: event.detail.value.pwd,
                  name: event.detail.value.name,
                  className: event.detail.value.className
                }
              }).then(res => {
                console.log(res)
                wx.showToast({
                  title: '注册成功',
                })
                wx.redirectTo({
                  url: '../counselorLogin/counselorLogin',
                })
              })
            } else {
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
    } else {
      wx.showToast({
        title: '账号格式错误',
      })
    }
  }
})