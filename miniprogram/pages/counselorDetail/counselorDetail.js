const db = wx.cloud.database();
const classLeave = db.collection("classLeave");
Page({

  data: {
    classLeave: {},
    index: 0,
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
    let id = wx.getStorageSync('id')
    let counselorAdvice = event.detail.value.counselorAdvice
    console.log(id+counselorAdvice)
    wx.cloud.callFunction({
      name: 'updateAdvice1',
      data: {
        id: id,
        counselorAdvice:counselorAdvice
      },
      success(res) {
        console.log(res.result)
        wx.showToast({
          title: '提交成功',
        })
        wx.redirectTo({
          url: '../counselorList/counselorList',
        })
      },
      fail: console.error
    })
    // db.collection('classLeave').doc(id).update({
    //   data: {
    //     counselorAdvice: counselorAdvice
    //   },
    //   success: res => {
    //     this.setData({
    //       counselorAdvice: counselorAdvice
    //     })
    //     wx.showToast({
    //       title: '提交成功',
    //     })
    //     wx.redirectTo({
    //       url: '../counselorList/counselorList',
    //     })
    //   },
    //   fail: err => {
    //     icon: 'none',
    //       console.error('[数据库] [更新记录] 失败：', err)
    //   }
    // })
    
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