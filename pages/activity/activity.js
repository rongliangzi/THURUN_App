var utils = require('../../utils/util.js');
import Config from '../../config/config.js';

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity_list: [],
    activity_len: 0,
    activity_max_id: 0,
    tips: "",

    showModal: false
  },

  //查看活动
  showActivity(e) {
    const match_id = e.currentTarget.dataset.matchid;
    const match_name = e.currentTarget.dataset.matchname;
    
    wx.navigateTo({
      url: '../oneActivity/oneActivity?activity_id=' + match_id + '&activityName=' + encodeURIComponent(match_name)
    })
  },

  //关闭蒙层
  closeModal: function (e) {
    this.setData({
      showModal: false
    })
  },

  preventTouchMove: function(e) {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.activity_id != null) {
      wx.navigateTo({
        url: '../oneActivity/oneActivity?activity_id=' + options.activity_id + '&activityName=' + options.activityName
      })
    }

    wx.showLoading({
      title: '玩命加载中',
    })

    get_activity_list(this, this.data.activity_len, this.data.activity_max_id);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: 'THURUN | 活动列表',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
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
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();

    get_activity_list(this, 0, 0);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '玩命加载中',
    })

    get_activity_list(this, this.data.activity_len, this.data.activity_max_id);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

function get_activity_list(that, activity_len, activity_max_id) {
  wx.request({
    url: Config.URI,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    data: {
      type: 3,
      len: activity_len,
      activity_max_id: activity_max_id
    },

    success: function (res) {
      //console.log(res);

      if (res.statusCode != 200) {
        that.setData({
          tips: "status code: " + res.statusCode
        })
      }
      else if (Object.prototype.toString.call(res.data) == '[object Array]') {
        var activity_list;
        if (activity_len == 0) {
          activity_list = res.data;
        }
        else {
          activity_list = that.data.activity_list.concat(res.data);
        }

        that.setData({
          activity_list: activity_list,
          activity_len: activity_list.length,
          activity_max_id: activity_list[0]["activity_id"]
        })

        if (that.data.activity_list.length == 0) {
          that.setData({
            tips: "暂无活动"
          })
        }
      }
      else {
        if (that.data.activity_list.length == 0) {
          that.setData({
            tips: res.data
          })
        }
      }

      wx.hideNavigationBarLoading();
      wx.hideLoading();
    }
  })
}