const db = wx.cloud.database();
var app = getApp();
Page({
  // 学生登陆
  clickToLogin(event) {
    db.collection('student').where({
      username: event.detail.value.username,
      pwd: event.detail.value.pwd
    }).get().then(res=>{
      if(res.data[0] == null){
        wx.showToast({
          title:'用户名或密码错误',
        })
        return
      }else{
        app.appUser = res.data[0];
        wx.switchTab({
          url: '../leave/leave',
        })
        wx.clearStorage()
      }
    })
  },

  //跳转至注册页
  registered:function(){
    wx.redirectTo({
      url: '/pages/addStudent/addStudent',
    })
  }
})