var utils = require('../../utils/util.js');
import Config from '../../config/config.js';

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  clearAll() {
    if(!app.globalData.is_root) {
      wx.showModal({
        title: '提示',
        content: '您没有权限进行此操作',
        showCancel: false
      })
    }
    else {
      var that = this;
      wx.showModal({
        title: '提示',
        content: '请确认是否删除所有数据',
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '正在删除',
            })

            wx.request({
              url: Config.URI,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
              data: {
                type: 11,
                openid: app.globalData.openid
              },

              success: function (res) {
                wx.hideLoading();
                
                wx.showModal({
                  title: '提示',
                  content: '已删除所有数据',
                  showCancel: false
                })
              }
            })
          }
          else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: 'THURUN | 联系我们',
    })
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
    wx.stopPullDownRefresh();
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