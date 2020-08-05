const db = wx.cloud.database();
var app = getApp();
Page({

  // 登陆
  clickToLogin(event) {
    db.collection('counselor').where({
      username: event.detail.value.username,
      pwd: event.detail.value.pwd
    }).get().then(res => {
      if (res.data[0] == null) {
        wx.showToast({
          title: '用户名或密码错误',
        })
        return
      } else {
        app.appUser = res.data[0].username;
        var userInfo1 = res.data[0]
        wx.clearStorage()
        wx.setStorageSync('userInfo1', userInfo1)
        wx.redirectTo({
          url: '../counselorList/counselorList',
        })
      }
    })
  },
  registered: function () {
    wx.redirectTo({
      url: '/pages/addCounselor/addCounselor',
    })
  }
})