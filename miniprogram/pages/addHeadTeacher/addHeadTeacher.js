const db = wx.cloud.database();
const student = db.collection("headTeacher");
Page({
  studentSubmit: function (event) {
    var username = event.detail.value.username
    var pwd = event.detail.value.pwd
    var name = event.detail.value.name
    var className = event.detail.value.className
    var usernametest = /^[0-9]{6}$/
    if (usernametest.test(username)) {
      db.collection('headTeacher').where({
        username: username
      }).get().then(res => {
          if (res.data[0] == null) {
            if (pwd !== null && name !== null && className !== null) {
              student.add({
                data: {
                  username: username,
                  pwd: pwd,
                  name:name,
                  className: className
                }
              }).then(res => {
                console.log(res)
                wx.showToast({
                  title: '注册成功',
                })
                wx.redirectTo({
                  url: '../headTeacherLogin/headTeacherLogin',
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