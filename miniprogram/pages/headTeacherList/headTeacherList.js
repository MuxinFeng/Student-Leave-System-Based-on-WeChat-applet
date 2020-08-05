const db = wx.cloud.database();
const classLeave = db.collection("classLeave");
const headTeacher = db.collection("headTeacher");
var app = getApp();
Page({
  data: {
    leaveArray: [],
    leaveArray1: [],
    activeNames: ['1'],
  },
 
  // onLoad: function (options) {
  //   this.setData({
  //     leaveArray: []
  //   })
  //   var userInfo = wx.getStorageSync('userInfo')
  //   var teacherName = userInfo.name
  //   classLeave.where({
  //     headTeacher: teacherName,
  //     deleteInfo: '0'
  //   }).orderBy('headTeacherAdvice', 'desc').orderBy('leaveTime', 'asc').get().then(res => {
  //     this.setData({
  //       leaveArray: res.data
  //     })
  //   })
  // },
  onLoad: function (options) {
    this.setData({
      leaveArray: []
    })
    var userInfo = wx.getStorageSync('userInfo')
    var teacherName = userInfo.name
    classLeave.where({
      headTeacher: teacherName,
      deleteInfo: '0',
      headTeacherAdvice: '待审核'
    }).orderBy('leaveTime', 'asc').get().then(res => {
      this.setData({
        leaveArray: res.data
      })
    })
    classLeave.where({
      headTeacher: teacherName,
      deleteInfo: '0',
      headTeacherAdvice: db.command.nin(['待审核'])
    }).orderBy('leaveTime', 'asc').limit(20).get().then(res => {
      this.setData({
        leaveArray1: res.data
      })
    })
  },
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

