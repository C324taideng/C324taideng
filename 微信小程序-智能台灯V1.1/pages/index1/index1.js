const app = getApp();

Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index1/index1',
      success: function () { },
      fail: function () { }
    }
  },
  data: {
    charts: [{
     
      id: 'line',
      name: '折线图',
     
    }]
  },

  onReady() {
  },

  open: function (e) {
    wx.navigateTo({
      url: '../' + e.target.dataset.chart.id + '/line'
    });
  }
});
