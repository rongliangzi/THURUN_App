import Config from './config/config.js';

App({
  onLaunch: function () {
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this;

    // 用户登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openid, sessionKey
        wx.request({
          url: Config.URI,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data: {
            type: 1,
            code: res.code
          },
          success: function (res) {
            that.globalData.openid = res.data.openid;
            that.globalData.is_root = res.data.is_root;
            that.globalData.is_admin = res.data.is_admin;
            //console.log(res.data);
          }
        })
      }
    });

    // 获取用户当前的授权状态
    wx.getSetting({
      success: res => {
        // 已授权
        if (res.authSetting['scope.userInfo']) {
          //console.log("已授权")
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        // 未授权
        else {
          //console.log("未授权")
          
          wx.reLaunch({
            url: '../index/index',
          });
          //*/
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    openid: null,
    is_root: null,
    is_admin: null,
    activity_data: null
  }
})