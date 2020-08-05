const db = wx.cloud.database();
const classLeave = db.collection("classLeave");
Page({
  data: {
    classLeave: {},
    index:0,
    array: ['待审核', '同意', '不同意'],
  },

  onLoad: function (options) {
    let id = options.id;
    classLeave.doc(id).get().then(res => {
      this.setData({
        classLeave: res.data
      })
    })
    wx.clearStorage()
    wx.setStorageSync('id', id)
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  onsubmitclass: function (event) {
    var id = wx.getStorageSync('id')
    var headTeacherAdvice = event.detail.value.headTeacherAdvice
    wx.cloud.callFunction({
      name: 'updateAdvice',
      data: {
        id: id,
        headTeacherAdvice: headTeacherAdvice
      },
      success(res) {
        console.log(res.result)
        wx.showToast({
          title: '提交成功',
        })
        wx.redirectTo({
          url: '../headTeacherList/headTeacherList',
        })
      },
      fail: console.error
    })
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.classLeave.guardianPhone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  }
})