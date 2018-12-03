//323.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ah:"7",
    am: "30",
    status:"ON", 
    lx:"255",
    lox:"568",
    up:23,
    upm:0,
    tired:60,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //加载时就获取后台的数据
    this.get_data()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  send4: function () {
    this.data.status = ((this.data.status == "ON" )?  "OFF" :  "ON"),
    this.setData({
      status: this.data.status 
    })
    wx.showToast({
      title: this.data.status,
      duration: 1000
    })
    this.sendRequset(this.makeObj(this.data.ah, this.data.am, this.data.status , this.data.lx, this.data.up, this.data.upm, ""));
  },
  send2: function () {
    this.data.lx + 50 < 255 ? this.data.lx += 50 : this.data.lx =255
    this.setData({
      lx: this.data.lx
    })
    wx.showToast({
      title: "level UP",
      duration: 1000
    })
    this.sendRequset(this.makeObj(this.data.ah, this.data.am, this.data.status, this.data.lx, this.data.up, this.data.upm, ""));
  },
  send6: function () {
    this.data.lx ? this.data.lx = 0 : this.data.lx = 255
    this.setData({
      lx: this.data.lx
    })

    this.sendRequset(this.makeObj(this.data.ah, this.data.am, this.data.status, this.data.lx, this.data.up, this.data.upm, "")),
      wx.showToast({
        title: "Loading",
        duration: 1000
      })
      
   // this.get_data()
  },
  send3: function () {
    this.data.lx - 150 >= 0 ? this.data.lx -= 150 : this.data.lx = 0
    this.setData({
      lx: this.data.lx
    })
    wx.showToast({
      title: "level DOWN",
      duration: 1000
    })
    this.sendRequset(this.makeObj(this.data.ah, this.data.am, this.data.status, this.data.lx, this.data.up,this.data.upm,""));
  },
        
  send1: function () {

 this.getDataFromOneNet1;
  },
  send5: function () {
    
    this.setData({
      lx: this.data.lx
    })
    wx.showToast({
      title: "SEND SUCCESS",
      duration: 1000
    })
    this.sendRequset(this.makeObj(this.data.ah, this.data.am, this.data.status, this.data.lx, this.data.up, this.data.upm, ""));
  },
  //Function of the function is to auto move slide  ,every second ++
  change1: function (e) {
    //当有输入时激活发送按钮，无输入则禁用按钮
    if (e.detail.value != "") {
      this.setData({
        ah: e.detail.value,

      })
    } 
    
  },
  change2: function (e) {
    //当有输入时激活发送按钮，无输入则禁用按钮
    if (e.detail.value != "") {
      this.setData({
        am:e.detail.value,

      })
    }

  },
  change3: function (e) {
    //当有输入时激活发送按钮，无输入则禁用按钮
    if (e.detail.value != "") {
      this.setData({
        lx: e.detail.value,

      })
    }

  },
  change4: function (e) {
    //当有输入时激活发送按钮，无输入则禁用按钮
    if (e.detail.value != "") {
      this.setData({
        up: e.detail.value,

      })
    }

  },
  change5: function (e) {
    //当有输入时激活发送按钮，无输入则禁用按钮
    if (e.detail.value != "") {
      this.setData({
        upm: e.detail.value,

      })
    }

  },
  sendRequset: function (obj) {
    wx.request(obj);
  },
  makeObj: function (h, m, sta, lo,sh,shm,msg) {
    var obj = {
      url: "http://api.heclouds.com/devices/504858653/datapoints?type=3",

      header: {
        "Content-Type": "application/json",
        "api-key": "6W7mMaznfXwQ4y0BM8zz56j4lpU=",
      },
      method: "post",
      data: {

        "ah": h,
        "am": m,
        "status": sta=="ON"? 1 : 2,
        "lx": lo,
        //"lox":lox,
        "up":sh,
        "upm":shm,
      },
      success: function (res) {
        if (msg != "") {
          wx.showToast({
            title: msg,
            duration: 2000
          })
      
        }
      }
    }
    return obj;
  },
 



  getDataFromOneNet: function () {
    //从oneNET请求我们的Wi-Fi气象站的数据
    const requestTask = wx.request({
      url: 'https://api.heclouds.com/devices/9939133/datapoints?datastream_id=Light,Temperature,Humidity&limit=15',
      header: {
        'content-type': 'application/json',
        'api-key': 'VeFI0HZ44Qn5dZO14AuLbWSlSlI='
      },
      success: function (res) {
        //console.log(res.data)
        //拿到数据后保存到全局数据
        var app = getApp()
        app.globalData.temperature = res.data.data.datastreams[0]
        app.globalData.light = res.data.data.datastreams[1]
        app.globalData.humidity = res.data.data.datastreams[2]
        console.log(app.globalData.light)
        //跳转到天气页面，根据拿到的数据绘图
        wx.navigateTo({
          url: '../wifi_station/tianqi/tianqi',
        })
      },

      fail: function (res) {
        console.log("fail!!!")
      },

      complete: function (res) {
        console.log("end")
      }
    })
  },

  change: function (e) {
    //当有输入时激活发送按钮，无输入则禁用按钮
    if (e.detail.value != "") {
      this.setData({
        threshold: e.detail.value,
        opacity: 1,
        disabled: false,
      })
    } else {
      this.setData({
        threshold: 0,
        opacity: 0.4,
        disabled: true,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
