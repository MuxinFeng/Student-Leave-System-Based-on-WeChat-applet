Page({ 
  toStudent: function () {
    wx.redirectTo({
      url: '/pages/login/login',
    })
  },
  headteacher: function () {
    wx.redirectTo({
      url: '/pages/headTeacherLogin/headTeacherLogin',
    })
  },
  counselor: function () {
    wx.redirectTo({
      url: '/pages/counselorLogin/counselorLogin',
    })
  }
})