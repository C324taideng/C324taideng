
var app = getApp()
var temp = []
var string_temp = ""
var serviceId = "0000ffe0-0000-1000-8000-00805f9b34fb"
var characteristicId = "0000ffe1-0000-1000-8000-00805f9b34fb"

Page({
  data: {
    isbluetoothready: false,
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    searchingstatus: false,
    receivedata: '666',
    onreceiving: false,
    id_text: string_temp,
    list: [],
    receive_data: 'none  ',
    value1: "000",
    value2: "000",
    value3: "000",
    items: [
      { name: '红色', value: '001' },
      { name: '蓝色', value: '100' },
      { name: '绿色', value: '010' },
      { name: '黄色', value: '101' },
      { name: '青色', value: '110' },
    ],
    yanchi: "1.00",
    yanchikg: "0",
    zhudeng:"0",
    pm25:"0"
  },
  switch2Change: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    var that = this;
    if (e.detail.value == 1) {
      this.setData({
        pm25: "1"
      })
    } else {
      this.setData({
        pm25: "0"
      })
    }

    console.log(this.data.yanchikg)
  },
  
  radioChange1: function (e) {
    var that = this;
    this.setData({
      value1: e.detail.value
    })
    console.log(this.data.value1);
  },
  radioChange2: function (e) {
    var that = this;
    this.setData({
      value2: e.detail.value
    })
    console.log(this.data.value2);
  },
  radioChange3: function (e) {
    var that = this;
    this.setData({
      value3: e.detail.value
    })
    console.log(this.data.value3);
    console.log(this.data.yanchikg);
    console.log(this.data.zhudeng);
    console.log(this.data.pm25);
  },
  switchChange: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    var that = this;
    if (e.detail.value == 1) {
      this.setData({
        yanchikg: "1"
      })
    } else {
      this.setData({
        yanchikg: "0"
      })
    }
    
    console.log(this.data.yanchikg)
  },
  switch1Change: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
    var that = this;
    if (e.detail.value == 1) {
      this.setData({
        zhudeng: "1"
      })
    } else {
      this.setData({
        zhudeng: "0"
      })
    }
    console.log(this.data.yanchikg)
  },
  onLoad: function () {

  },
  open_BLE: function () {
    var that = this

    that.setData({
      isbluetoothready: !that.data.isbluetoothready,
    })
    if (that.data.isbluetoothready) {
      //开启蓝牙模块并初始化
      wx.openBluetoothAdapter({
        success: function (res) {

        },
        fail: function (res) {
          wx.showModal({
            title: '提示',
            content: '请检查手机蓝牙是否打开',
          })
        }
      })
      //开启蓝牙模块并初始化

      //检查蓝牙模块是否初始化成功
      wx.getBluetoothAdapterState({
        success: function (res) {
          var available = res.available
          if (!available) {
            wx.showToast({
              title: '蓝牙初始化失败',
              icon: 'loading',
              duration: 2000
            })
          }
          else {
            wx.showToast({
              title: '蓝牙初始化成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
      //检查蓝牙模块是否初始化成功
    }
    else {
      wx.closeBLEConnection({
        deviceId: that.data.connectedDeviceId,
        complete: function (res) {
          that.setData({
            deviceconnected: false,
            connectedDeviceId: ""
          })
          wx.showToast({
            title: '蓝牙连接断开',
            icon: 'success',
            duration: 2000
          })
        }
      })
      setTimeout(function () {
        that.setData({
          list: []
        })
        //释放蓝牙适配器
        wx.closeBluetoothAdapter({
          success: function (res) {
            that.setData({
              isbluetoothready: false,
              deviceconnected: false,
              devices: [],
              searchingstatus: false,
              receivedata: ''
            })
            wx.showToast({
              title: '蓝牙适配器释放',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (res) {

          }
        })
        //释放蓝牙适配器
      }, 1000)
    }
  },

  search_BLE: function () {
    temp = []
    var that = this
    if (!that.data.searchingstatus) {
      var that = this
      //开始搜索附近蓝牙设备
      wx.startBluetoothDevicesDiscovery({
        success: function (res) {
          wx.showToast({
            title: '开始搜索BLE',
            icon: 'loading',
            duration: 2000
          })
          that.setData({
            searchingstatus: !that.data.searchingstatus
          })
        }
      })
      //开始搜索附近蓝牙设备
    } else {
      //停止搜索附近蓝牙设备
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          wx.showToast({
            title: '停止搜索BLE',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            searchingstatus: !that.data.searchingstatus
          })
        }
      })
      //停止搜索附近蓝牙设备
      setTimeout(function () {
        //获取发现的蓝牙设备
        wx.getBluetoothDevices({
          success: function (res) {
            for (var i = 0; i < 100; i++) {
              if (res.devices[i]) {
                string_temp = string_temp + '\n' + res.devices[i].deviceId
              }
            }
            
            that.setData({
              id_text: string_temp,
              list: res.devices
            })
          }
        })
        //获取发现的蓝牙设备
      }, 1000)
    }
  },

  connectTO: function (e) {
    var that = this
    wx.showLoading({
      title: '连接蓝牙设备中...',
    })
    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      success: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          deviceconnected: true,
          connectedDeviceId: e.currentTarget.id
        })
        // 启用 notify 功能
        wx.notifyBLECharacteristicValueChanged({
          state: true,
          deviceId: that.data.connectedDeviceId,
          serviceId: serviceId,
          characteristicId: characteristicId,
          success: function (res) {

          }
        })
        // 启用 notify 功能
        // ArrayBuffer转为16进制数
        function ab2hex(buffer) {
          var hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function (bit) {
              return ('00' + bit.toString(16)).slice(-2)
            }
          )
          return hexArr.join('');
        }
        // 16进制数转ASCLL码
        function hexCharCodeToStr(hexCharCodeStr) {
          var trimedStr = hexCharCodeStr.trim();
          var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
          var len = rawStr.length;
          var curCharCode;
          var resultStr = [];
          for (var i = 0; i < len; i = i + 2) {
            curCharCode = parseInt(rawStr.substr(i, 2), 16);
            resultStr.push(String.fromCharCode(curCharCode));
          }
          return resultStr.join("");
        }
        //监听回调，接收数据
        wx.onBLECharacteristicValueChange(function (characteristic) {
          var hex = ab2hex(characteristic.value)
          that.setData({
            receive_data: hexCharCodeToStr(hex)
          })
        })
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '连接设备失败',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          connected: false
        })
      }
    })
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {

      }
    })
  },

  formSubmit: function (e) {
    var that = this
    var senddata = this.data.value1 + this.data.value2 + this.data.value3 + this.data.yanchi + this.data.yanchikg+this.data.zhudeng+this.data.pm25
    let buffer = new ArrayBuffer(senddata.length)
    let dataView = new DataView(buffer)
    for (var i = 0; i < senddata.length; i++) {
      dataView.setUint8(i, senddata.charAt(i).charCodeAt())
    }
   console.log(senddata);
    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      value: buffer,
      success: function (res) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  moshi1: function (e) {
    var that = this
    var senddata = this.data.zifu1;
    let buffer = new ArrayBuffer(senddata.length)
    let dataView = new DataView(buffer)
    for (var i = 0; i < senddata.length; i++) {
      dataView.setUint8(i, senddata.charAt(i).charCodeAt())
    }

    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      value: buffer,
      success: function (res) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  moshi2: function (e) {
    var that = this
    var senddata = this.data.zifu2;
    let buffer = new ArrayBuffer(senddata.length)
    let dataView = new DataView(buffer)
    for (var i = 0; i < senddata.length; i++) {
      dataView.setUint8(i, senddata.charAt(i).charCodeAt())
    }

    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      value: buffer,
      success: function (res) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  moshi3: function (e) {
    var that = this
    var senddata = this.data.zifu3;
    let buffer = new ArrayBuffer(senddata.length)
    let dataView = new DataView(buffer)
    for (var i = 0; i < senddata.length; i++) {
      dataView.setUint8(i, senddata.charAt(i).charCodeAt())
    }

    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      value: buffer,
      success: function (res) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  moshi4: function (e) {
    var that = this
    var senddata = this.data.zifu4;
    let buffer = new ArrayBuffer(senddata.length)
    let dataView = new DataView(buffer)
    for (var i = 0; i < senddata.length; i++) {
      dataView.setUint8(i, senddata.charAt(i).charCodeAt())
    }

    wx.writeBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      value: buffer,
      success: function (res) {
        wx.showToast({
          title: '发送成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },


  receiveMessages: function () {
    var that = this;
    wx.readBLECharacteristicValue({
      deviceId: that.data.connectedDeviceId,
      serviceId: serviceId,
      characteristicId: characteristicId,
      success: function (res) {
      }
    })
  },


})