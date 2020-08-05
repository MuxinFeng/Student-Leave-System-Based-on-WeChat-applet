const db = wx.cloud.database();
const classLeave = db.collection("classLeave");
const counselor = db.collection("counselor");
var app = getApp();
Page({

  data: {
    leaveArray: [],
    leaveArray1: [],
    activeNames: ['1'],
  },
  
  // onLoad: function (options) {
  //   var userInfo1 = wx.getStorageSync('userInfo1')
  //   var teacherName = userInfo1.name
  //   classLeave.where({
  //     counselor: teacherName,
  //     headTeacherAdvice : '同意',
  //     deleteInfo: '0'
  //   }).orderBy('leaveTime', 'asc').get().then(res => {
  //     this.setData({
  //       leaveArray: res.data
  //     })
  //   })
  // },
  onLoad: function (options) {
    var userInfo1 = wx.getStorageSync('userInfo1')
    var teacherName = userInfo1.name
    classLeave.where({
      counselor: teacherName,
      deleteInfo: '0',
      headTeacherAdvice: '同意',
      counselorAdvice:'待审核'
    }).orderBy('leaveTime', 'asc').get().then(res => {
      this.setData({
        leaveArray: res.data
      })
    })
    classLeave.where({
      counselor: teacherName,
      deleteInfo: '0',
      headTeacherAdvice: '同意',
      counselorAdvice: db.command.nin(['待审核'])
    }).orderBy('leaveTime', 'asc').limit(20).get().then(res => {
      this.setData({
        leaveArray1: res.data
      })
    })
  },
  //内容展开
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '刷新中...',
    })
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 1]
    perpage.onLoad()
    wx.hideLoading()
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  }
})