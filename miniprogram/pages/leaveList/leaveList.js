const db = wx.cloud.database();
const classLeave = db.collection("classLeave");
var app = getApp();
Page({
  data: {
    leaveArray:[],
    leaveArray1: [],
    activeNames: ['1']
  },

  onLoad: function (options) {
    // this.setData({
    //   leaveArray: [1]
    // })
    let username = app.appUser.username
    classLeave.where({
      studentId: username,
      deleteInfo:'0',
      headTeacherAdvice:'待审核'
    }).orderBy('leaveTime', 'asc').get().then(res => {
      this.setData({
        leaveArray: res.data
      }) 
    }) 
    classLeave.where({
      studentId: username,
      deleteInfo: '0',
      headTeacherAdvice: db.command.nin(['待审核'])
    }).orderBy('leaveTime', 'asc').limit(10).get().then(res => {
      res.data = res.data.map((item, index) => {
        let id = item._id
        if (item.counselorAdvice == '同意') {
          db.collection('classLeave').doc(id).update({
            data: {
              progressrate: '通过'
            }
          })
        } else if (item.counselorAdvice == '待审核' && item.headTeacherAdvice == '同意') {
          db.collection('classLeave').doc(id).update({
            data: {
              progressrate: '审核中'
            }
          })
        } else if (item.headTeacherAdvice == '不同意') {
          db.collection('classLeave').doc(id).update({
            data: {
              progressrate: '不通过'
            }
          })
        }
        return item
      })
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