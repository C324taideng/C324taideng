Page({
  data:{
    word1:0,
    word2:0,
  },
  tap1: function () {
    var that = this
    //取得门限数据和报警规则

    //调用百度天气API
  const requestTask = wx.request({
    url: 'https://www.showdoc.cc/page/1159391730356948', 
    header: {
      'content-type': 'application/json',
    },

    success: function (res) {
      console.log(res.data)
     that.setData({
       word1:res.data.data.projects[0].address,
     })
    },
     })
  },
    tap2: function () {
    var that = this
    //取得门限数据和报警规则

    //调用百度天气API
    const requestTask = wx.request({
      url: 'http://showdoc.com/api/user/login',
      header: {
        'content-type': 'application/json',
      },

      success: function (res) {
        console.log(res.data)
      },
    })
  }
  })