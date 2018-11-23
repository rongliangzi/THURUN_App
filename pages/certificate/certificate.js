var utils = require('../../utils/util.js');
import Config from '../../config/config.js';

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id: null,

    type: null,
    content: '',
    progress: 0,
    img_url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "activity_id": options.activity_id,
      "activityName": decodeURIComponent(options.activityName),
    });

    wx.showLoading({
      title: '玩命加载中',
    });

    var that = this;
    wx.request({
      url: Config.URI,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        type: 14,
        activity_id: that.data.activity_id,
        openid: app.globalData.openid
      },
      success: function (res) {
        that.setData({
          'type': res.data.type,
          'content': res.data.content
        });

        wx.hideLoading();

        if(that.data.type == 4) {
          that.setData({
            'img_url': Config.URI + that.data.content
          });
        }
      }
    });
  },

  //在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
  previewImage() {
    var imglist = new Array;
    imglist.push(this.data.img_url);
    wx.previewImage({
      urls: imglist, 
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: 'THURUN | ' + decodeURIComponent(this.data.activityName),
    })

    // 隐藏当前页面的转发按钮
    wx.hideShareMenu();
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