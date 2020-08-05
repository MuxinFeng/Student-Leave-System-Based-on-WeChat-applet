const db = wx.cloud.database();
const student = db.collection("student");
const headTeacher = db.collection("headTeacher");
const counselor = db.collection("counselor");
var app = getApp();
Page({
  data:{
    id:'',
    pwd:''
  },
  onLoad: function (event) {
    var username = app.appUser.username
    db.collection('student').where({
      username: username
    }).get().then(res => {
      this.setData({
        id: res.data[0]._id,
        pwd:res.data[0].pwd
      })
    })
  } ,

  studentSubmit: function (event) {
    var oldpwd = event.detail.value.oldpwd
    var newpwd = event.detail.value.newpwd
    var username = app.appUser.username
    wx.setStorageSync('changesecretId', this.data.id)
    if(oldpwd == this.data.pwd){
      wx.showModal({
        title: '提示',
        content: '确定修改吗？',
        success: function (sm) {
          if (sm.confirm) {
            var idi = wx.getStorageSync('changesecretId')
            db.collection('student').doc(idi).update({
              data: {
                pwd: newpwd
              },
              success: res => {
                wx.showToast({
                  title: '提交成功',
                })
                wx.redirectTo({
                  url: '../loginChoose/loginChoose',
                })
                wx.clearStorage()
              },
              fail: err => {
                icon: 'none',
                  console.error('[数据库] [更新记录] 失败：', err)
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消');
          }
        }
      })
    }else{
      wx.showToast({
        title: '原密码错误',
      })
    }
  } 
})