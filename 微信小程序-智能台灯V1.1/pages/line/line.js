import * as echarts from '../../ec-canvas/echarts';
var num1; var num2; var num3; var num4; var num5; var num6; var num7;var tmp;
const app = getApp();
function initChart(canvas, width, height) {
  var that=this;
  const requestTask = wx.request({
    url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=XSW2Ijvo7jFm1HFlGNY9sxhHggOvMutC',
    header: {
      'content-type': 'application/json',
    },

    success: function (res) {
      var str = res.data.results[0].weather_data[0].date;
      var tmp1 = str.match(/实时.+/);
      var tmp2 = tmp1[0].substring(3, tmp1[0].length - 2);
      tmp = +tmp2;
      that.setData({
        num1:tmp,
      })
    }
  })
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var option = {
    title: {
      text: '未来一周天气温度预报',
      left: 'center'
    },
    color: ["#37A2DA", "#67E0E3", "#9FE6B8"],
    legend: {
      data: ['未来一周天气'],
      top: 50,
      left: 'center',
      backgroundColor: 'white',
      z: 100
    },
    grid: {
      containLabel: true
    },
    tooltip: {
      show: true,
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['今天', '明天', '后天', '周四', '周五', '周六', '周日'],
      // show: false
    },
    yAxis: {
      x: 'center',
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
      // show: false
    },
    series: [{
     name: 'A',
      type: 'line',
      smooth: true,
      data: [num1, num2, num3, num4, num5, num6, num7]
    
    }]
  };


  chart.setOption(option);
  return chart;
}

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
    num1: 0,
    ec: {
      onInit: initChart
    },

  },

  onLord: function () {
    var that = this
    const requestTask = wx.request({
      url: 'https://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=XSW2Ijvo7jFm1HFlGNY9sxhHggOvMutC',
      header: {
        'content-type': 'application/json',
      },

      success: function (res) {
        var str = res.data.results[0].weather_data[0].date;
        var tmp1 = str.match(/实时.+/);
        var tmp2 = tmp1[0].substring(3, tmp1[0].length - 2);
        tmp = +tmp2;
        that.setData({
          num1: tmp,
        });
      }
    })
  }
});

