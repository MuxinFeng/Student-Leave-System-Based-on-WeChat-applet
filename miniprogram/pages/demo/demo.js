const db = wx.cloud.database();
const classLeave = db.collection("classLeave");
const headTeacher = db.collection("headTeacher");
var app = getApp();
Page({
  data: {
    leaveArray: [],
    leaveArray1: [],
    activeNames: ['1'],
    searchVal: "",
    searchresult:[]
  },

  
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

  input(e) {
    this.setData({
      searchVal: e.detail.value
    })
    console.log(e.detail.value)
  },
  clear: function () {
    this.setData({
      searchVal: ""
    })
  },
  //商品关键字模糊搜索
  search: function () {
    wx: wx.showLoading({
      title: '加载中',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    //重新给数组赋值为空
    this.setData({
      searchresult: []
    })
    // 数据库正则对象
    db.collection('classLeave').where({
      title: db.RegExp({
        regexp: this.data.searchVal,//做为关键字进行匹配
        options: 'i',//不区分大小写
      })
    }).get().then(res => {
      this.setData({
        searchresult: []
      })
      }).catch(err => {
        console.error(err)
        wx.hideLoading();
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


