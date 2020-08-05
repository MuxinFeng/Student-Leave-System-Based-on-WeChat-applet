const db = wx.cloud.database();
const classLeave = db.collection("classLeave");
Page({
  data: {
    classLeave:{},
    id1:''
  },

  onLoad: function (options) {
    var id = options.id
    this.setData({
      id1 : id
    })
    classLeave.doc(id).get().then(res=>{
      this.setData({
        classLeave:res.data
      })
    })
    //刷新上一页面
    const pages = getCurrentPages()
    const perpage = pages[pages.length - 2]
    perpage.onLoad()  
  },
  onsubmitclass:function(event){
    var changeInfo = this.data.classLeave
    wx.setStorageSync('change', changeInfo)
    var idid = this.data.id1
    db.collection("classLeave").doc(idid).update({
      data: {
        deleteInfo: '1'
      }
    })
    wx.switchTab({
      url: '../leave/leave',
    })
  },
  deleteInfo:function(event){
    var idid = this.data.id1
    wx.showModal({
      title: '提示',
      content: '确定要删除该假条吗？',
      success: function (sm) {
        if (sm.confirm) {
          db.collection("classLeave").doc(idid).update({
            data:{
              deleteInfo:'1'
            },
            success: function (res) {
              console.log("删除成功")
              wx.showToast({
                title: '删除成功',
              })
              wx.switchTab({
                url: '../leaveList/leaveList',
                success() {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad();
                }
              })
            }, 
            fail: err => {
              console.log(err);　　
            } 
          })
        } else if (sm.cancel) {
          console.log('用户点击取消');
        }
      }
    })
  }
})