//初始化数据库
const db = wx.cloud.database();
const classLeave = db.collection("classLeave"); 
var app = getApp();

//宿舍地址
const pos = ['东', '北'];
const pos2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const pos3 = ['A', 'B'];
const pos4 = [121, 122, 123, 124, 125, 415, 416];

//离校时间
const date = new Date();
const years = [];
const months = [];
const days = [];
const hours = [];
const minutes = [];
for (let i = 2020; i <= date.getFullYear() + 1; i++) {
  years.push("" + i);
}
for (let i = 1; i <= 12; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  months.push("" + i);
}
for (let i = 1; i <= 31; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  days.push("" + i);
}
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}

Page({
  data: {
    buttonName:'确认提交',
    //页签切换
    currentTab: 0,
    winWidht: 0,
    winHeight: 0,
    // show: false,
    // index: 0,
    appuser:'',

    //离校时间
    leavetime1: '',
    multiArray: [years, months, days, hours],
    multiIndex: [0, 9, 16, 10],
    choose_year: '',

    //返校时间
    backtime: '',
    multiArray2: [years, months, days, hours],
    multiIndex2: [0, 9, 16, 10],
    choose_year2: '',

    //宿舍位置
    dorm: '',
    multiArray3: [pos, pos2, pos3, pos4],
    multiIndex3: [0, 1, 1, 1],
  },


  //tab页切换
  switchNav: function (e) {
    var page = this;
    if (this.data.currentTab == e.target.dataset.current) {
      return false;
    } else {
      page.setData({ currentTab: e.target.dataset.current });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    wx.getSystemInfo({
      success: function (res) {
        page.setData({ winWidth: res.windowWidth });
        page.setData({ winHeight: res.windowHeight});
      }
    })
    var changeInfo = wx.getStorageSync('change')
    if (changeInfo.progressrate == '待审核') {  //修改假条时的加载信息
      this.setData({ //自动填写基本信息
        buttonName:'确认修改',
        className: changeInfo.className,
        username: changeInfo.studentId,
        name: changeInfo.name,
        reason: changeInfo.reason,
        leavetime: changeInfo.leaveTime,
        backtime: changeInfo.backTime,
        destination: changeInfo.destination,
        guardian: changeInfo.guardian,
        guardianPhone: changeInfo.guardianPhone,
        headTeacher: changeInfo.headTeacher,
        counselor: changeInfo.counselor,
        choose_year: this.data.multiArray[0][0],  //设置默认的年份-课堂离校
        choose_year2: this.data.multiArray2[0][0],  //设置默认的年份-课堂返校
      })
    } else {
        var info = app.appUser
        classLeave.where({
          studentId: info.username
        }).get().then(res => {
            if (res.data[0] == null) {
              this.setData({
                className: info.className,  //自动填写基本信息
                username: info.username,
                name: info.name,
                reason: null,
                leavetime: null,
                backtime: null,
                destination: null,
                choose_year: this.data.multiArray[0][0],   //设置默认的年份-课堂离校
                choose_year2: this.data.multiArray2[0][0],  //设置默认的年份-课堂返校
              })
            } else {
              this.setData({
                className: info.className,  //自动填写基本信息
                username: info.username,
                name: info.name,
                reason: null,
                leavetime: null,
                backtime: null,
                destination: null,
                guardian: res.data[0].guardian,
                guardianPhone: res.data[0].guardianPhone,
                headTeacher: res.data[0].headTeacher,
                counselor: res.data[0].counselor,
                choose_year: this.data.multiArray[0][0],  //设置默认的年份-课堂离校
                choose_year2: this.data.multiArray2[0][0],  //设置默认的年份-课堂返校
              })
            }  
        })
    }
  },
  onShow:function(e) {
    this.onLoad();
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
  },

  //将课堂假条写入数据库
  onsubmitclass:function(event){
    let data1 = event.detail.value
    if (data1.leaveTime !== null && data1.backTime !== null && data1.reason !== null
      && data1.className !== null && data1.studentId !== null && data1.name !== null
      && data1.guardian !== null && data1.guardianPhone !== null && data1.destination !== null
      && data1.headTeacher !== null && data1.counselor !== null){
      classLeave.add({
        data: {
          className: event.detail.value.className,
          studentId: event.detail.value.studentId,
          name: event.detail.value.name,
          guardian: event.detail.value.guardian,
          guardianPhone: event.detail.value.guardianPhone,
          reason: event.detail.value.reason,
          dorm: null,
          leaveTime: event.detail.value.leaveTime,
          backTime: event.detail.value.backTime,
          destination: event.detail.value.destination,
          headTeacher: event.detail.value.headTeacher,
          counselor: event.detail.value.counselor,
          progressrate: '待审核',
          headTeacherAdvice: '待审核',
          counselorAdvice: '待审核',
          deleteInfo:'0'
        }
      }).then(res => {
        wx.showToast({
          title: '提交成功',
        })
        wx.clearStorage()
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()  
      })
    }else{
      wx.showToast({
        title: '填写不完整',
      })
    }
  },

  //将住宿假条写入数据库
  onsubmitdorm: function (event) {
    let data1 = event.detail.value
    if (data1.leaveTime !== null && data1.backTime !== null && data1.reason !== null
       && data1.className !== null && data1.studentId !== null && data1.name !== null 
       && data1.guardian !== null && data1.guardianPhone !== null && data1.destination !== null
       && data1.headTeacher !== null && data1.counselor !== null && data1.dorm != null){
      classLeave.add({
        data: {
          className: event.detail.value.className,
          studentId: event.detail.value.studentId,
          name: event.detail.value.name,
          guardian: event.detail.value.guardian,
          guardianPhone: event.detail.value.guardianPhone,
          reason: event.detail.value.reason,
          dorm: event.detail.value.dorm,
          leaveTime: event.detail.value.leaveTime,
          backTime: event.detail.value.backTime,
          destination: event.detail.value.destination,
          headTeacher: event.detail.value.headTeacher,
          counselor: event.detail.value.counselor,
          progressrate: '待审核',
          headTeacherAdvice: '待审核',
          counselorAdvice: '待审核',
          deleteInfo: '0'
        }
      }).then(res => {
        // console.log(res)
        wx.showToast({
          title: '提交成功',
        })
        wx.clearStorage()
        const pages = getCurrentPages()
        const perpage = pages[pages.length - 1]
        perpage.onLoad()  
      })
    }else{
      wx.showToast({
        title: '填写不完整',
      })
    } 
  },


  //获取课堂离校时间
  //获取时间日期
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
    const index = this.data.multiIndex;
    const year = this.data.multiArray[0][index[0]];
    const month = this.data.multiArray[1][index[1]];
    const day = this.data.multiArray[2][index[2]];
    const hour = this.data.multiArray[3][index[3]];
    this.setData({
      leavetime: year + '年' + month + '月' + day + '日' + hour + '时'
    })
  },

  //监听picker的滚动事件
  bindMultiPickerColumnChange: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year = this.data.multiArray[e.detail.column][e.detail.value];
      console.log(choose_year);
      this.setData({
        choose_year
      })
    }
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray[2]);
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },


  //获取课堂返校时间
  //获取时间日期
  bindMultiPickerChange2: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex2: e.detail.value
    })
    const index = this.data.multiIndex2;
    const year = this.data.multiArray2[0][index[0]];
    const month = this.data.multiArray2[1][index[1]];
    const day = this.data.multiArray2[2][index[2]];
    const hour = this.data.multiArray2[3][index[3]];
    this.setData({
      backtime: year + '年' + month + '月' + day + '日' + hour + '时'
    })
  },

  //监听picker的滚动事件
  bindMultiPickerColumnChange2: function (e) {
    //获取年份
    if (e.detail.column == 0) {
      let choose_year2 = this.data.multiArray2[e.detail.column][e.detail.value];
      console.log(choose_year2);
      this.setData({
        choose_year2
      })
    }
    if (e.detail.column == 1) {
      let num = parseInt(this.data.multiArray2[e.detail.column][e.detail.value]);
      let temp = [];
      if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) { //判断31天的月份
        for (let i = 1; i <= 31; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray2[2]']: temp
        });
      } else if (num == 4 || num == 6 || num == 9 || num == 11) { //判断30天的月份
        for (let i = 1; i <= 30; i++) {
          if (i < 10) {
            i = "0" + i;
          }
          temp.push("" + i);
        }
        this.setData({
          ['multiArray2[2]']: temp
        });
      } else if (num == 2) { //判断2月份天数
        let year = parseInt(this.data.choose_year2);
        console.log(year);
        if (((year % 400 == 0) || (year % 100 != 0)) && (year % 4 == 0)) {
          for (let i = 1; i <= 29; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray2[2]']: temp
          });
        } else {
          for (let i = 1; i <= 28; i++) {
            if (i < 10) {
              i = "0" + i;
            }
            temp.push("" + i);
          }
          this.setData({
            ['multiArray2[2]']: temp
          });
        }
      }
      console.log(this.data.multiArray2[2]);
    }
    var data = {
      multiArray2: this.data.multiArray2,
      multiIndex2: this.data.multiIndex2
    };
    data.multiIndex2[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  //获取宿舍地址
  bindMultiPickerChange3: function (e) {
    this.setData({
      multiIndex3: e.detail.value
    })
    const index = this.data.multiIndex3;
    const pos = this.data.multiArray3[0][index[0]];
    const pos2 = this.data.multiArray3[1][index[1]];
    const pos3 = this.data.multiArray3[2][index[2]];
    const pos4 = this.data.multiArray3[3][index[3]];
    this.setData({
      dorm: pos + '区' + ' ' + pos2 + '栋' + ' ' + pos3 + '座' + ' ' + pos4 + '室'
    })
  },
  //监听picker的滚动事件
  bindMultiPickerColumnChange3: function (e) {
    //获取年份
    var data = {
      multiArray3: this.data.multiArray3,
      multiIndex3: this.data.multiIndex3
    };
    data.multiIndex3[e.detail.column] = e.detail.value;
    this.setData(data);
  }
})