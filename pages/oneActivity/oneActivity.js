var utils = require('../../utils/util.js');
import Config from '../../config/config.js';

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_id: null,
    activityName: '',
    activityTag: '',
    activityProject: '',
    activityAddress: '',
    activityDay: '',
    activityTime: '',
    activityDescription: '',
    startEnterDay: '',
    startEnterTime: '',
    stopEnterDay: '',
    stopEnterTime: '',
    author_id: null,
    is_author: false,
    is_root: false,
    selected_names: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      "activity_id": options.activity_id,
      "activityName": decodeURIComponent(options.activityName),
      "is_root": app.globalData.is_root,
    })
    
    wx.showLoading({
      title: '玩命加载中',
    })
    //*/

    var that = this;

    wx.request({
      url: Config.URI,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        type: 4,
        activity_id: that.data.activity_id
      },

      success: function (res) {
        var activity = res.data;

        that.setData({
          "activityName": activity["activityName"],
          "activityTag": activity['activityTag'],
          "activityProject": activity['activityProject'],
          "activityAddress": activity['activityAddress'],
          "activityDay": activity['activityDay'],
          "activityTime": activity['activityTime'],
          "activityDescription": activity['activityDescription'].replace(/\\n/g, '\n'),
          "startEnterDay": activity['startEnterDay'],
          "startEnterTime": activity['startEnterTime'],
          "stopEnterDay": activity['stopEnterDay'],
          "stopEnterTime": activity['stopEnterTime'],
          "author_id": activity['author_id'],
          "is_author": activity['author_id'] == app.globalData.openid,
          "selected_names": activity['selected_names'].split('-')
        })

        wx.hideLoading();
      }
    })
  },

  //报名活动
  participateActivity() {
    var currentDay = utils.formatDay(new Date);
    var currentTime = utils.formatTime(new Date);

    if(currentDay + " " + currentTime < this.data.startEnterDay + " " + this.data.startEnterTime) {
      wx.showModal({
        title: '提示',
        content: '报名未开始',
        showCancel: false
      })
      return;
    }
    /*
    if (currentDay + " " + currentTime > this.data.stopEnterDay + " " + this.data.stopEnterTime) {
      wx.showModal({
        title: '提示',
        content: '报名已结束',
        showCancel: false
      })
      return;
    }
    //*/

    app.globalData.activity_data = this.data;
    var that = this;
    wx.navigateTo({
      url: '../participateActivity/participateActivity?activity_id=' + that.data.activity_id
    })
  },

  // 成绩证书
  showActivityCertificate() {
    var that = this;
    wx.navigateTo({
      url: '../certificate/certificate?activity_id=' + that.data.activity_id + '&activityName=' + encodeURIComponent(that.data.activityName)
    })
  },

  //活动名单
  showActivityRoster() {
    var that = this;
    wx.navigateTo({
      url: '../activityRoster/activityRoster?activity_id=' + that.data.activity_id 
           + '&is_author=' + (that.data.is_author?'1':'0') + '&activityName=' + encodeURIComponent(that.data.activityName)
    })
  },

  //删除活动
  deleteActivity() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请确认是否删除活动？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: Config.URI,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: {
              type: 5,
              openid: app.globalData.openid,
              activity_id: that.data.activity_id,
              author_id: that.data.author_id
            },

            success: function (res) {
              //console.log(res.data);
              wx.reLaunch({
                url: '../activity/activity',
              })
            }
          })
        } 
        else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },

  //编辑活动
  editActivity() {
    app.globalData.activity_data = this.data;

    var that = this;
    wx.reLaunch({
      url: '../create/create?activity_id=' + that.data.activity_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: 'THURUN | ' + decodeURIComponent(this.data.activityName),
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
    wx.hideNavigationBarLoading();
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