var utils = require('../../utils/util.js');
import Config from '../../config/config.js';

var app = getApp();

Page({

  data: {
    is_root: false,
    is_admin: false,
    is_author: false,

    activity_id: null,
    activityName: '',
    roster: [],
    tips: '',
    progress: 0,

    showModal: false,
    modalContent: '',
    modalTips: ''
  },

  onLoad: function (options) {
    this.setData({
      "activity_id": options.activity_id,
      "activityName": decodeURIComponent(options.activityName),
      "is_root": app.globalData.is_root,
      "is_admin": app.globalData.is_admin,
      "is_author": (options.is_author=='1'?true:false)
    })

    wx.showLoading({
      title: '玩命加载中',
    })

    var that = this;

    wx.request({
      url: Config.URI,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        type: 10,
        activity_id: that.data.activity_id
      },

      success: function (res) {
        //console.log(res.data);
        that.setData({
          'roster': res.data
        })

        if(that.data.roster.length == 0) {
          that.setData({
            tips: "暂时无人报名"
          })
        }

        wx.hideLoading();
      }
    })
  },

  // 下载活动名单
  downloadRoster() {
    if (this.data.roster.length == 0) {
      wx.showModal({
        title: '提示',
        content: '暂时无人报名',
        showCancel: false
      });
      return;
    }

    wx.showLoading({
      title: '加载中',
    })

    var that = this;
    wx.request({
      url: Config.URI,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        type: 12,
        activity_id: that.data.activity_id,
        openid: app.globalData.openid
      },

      success: function (res) {
        wx.hideLoading();
        //console.log(res);

        var filename = "roster_" + that.data.activity_id + "_" + utils.md5(app.globalData.openid) + ".xlsx";
        const downloadTask = wx.downloadFile({
          url: Config.URI + "data/activity/temp/" + filename,
          filePath: wx.env.USER_DATA_PATH + '/' + filename,
          success: function (res) {
            //console.log(res);
            var filePath = res.filePath;
            //var filePath = res.tempFilePath;

            /*
            wx.showToast({
              title: '下载成功',
              icon: 'success',
              duration: 2000
            });
            //*/

            /*
            wx.showModal({
              title: '保存到',
              content: filePath,
              showCancel: false
            });//*/

            wx.openDocument({
              filePath: filePath,
              fileType: 'xlsx',
              success: function(res) {
                var link = Config.URI + "?type=100&target=roster&activity_id=" + that.data.activity_id + "&uid=" + utils.md5(app.globalData.openid);
                that.setData({
                  showModal: true,
                  modalContent: link,
                  modalTips: '有些手机打开文档之后右上角没有分享按钮，可以复制以下链接到浏览器中进行操作：'
                });
              }
            })//*/

            

            /*
            wx.getFileSystemManager().rename({
              oldPath: res.savedFilePath, 
              newPath: res.savedFilePath + '.xlsx', // 目标文件必须有写权限
              complete: function(res) {
                console.log(res);
                wx.showModal({
                  title: '提示',
                  content: res.errMsg,
                  showCancel: false
                });
              }
            });
            //*/
          },
          fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '下载失败',
              showCancel: false
            });
          }
        });

        downloadTask.onProgressUpdate((res) => {
          if (res.progress === 100) {
            that.setData({
              progress: 0
            });
          } else {
            that.setData({
              progress: res.progress
            });
          }
        });
      }
    });
  },

  // 上传参赛号码
  uploadNumber() {
    var link = Config.URI + "?type=101&activity_id=" + this.data.activity_id + "&uid=" + utils.md5(app.globalData.openid);
    this.setData({
      showModal: true,
      modalTips: '目前小程序只支持上传图片和视频，且个人类型的小程序不支持打开外链，因此请复制以下链接到浏览器中进行操作：',
      modalContent: link
    });
  },

  // 上传参赛成绩
  uploadResult() {
    var link = Config.URI + "?type=102&activity_id=" + this.data.activity_id + "&uid=" + utils.md5(app.globalData.openid);
    this.setData({
      showModal: true,
      modalTips: '目前小程序只支持上传图片和视频，且个人类型的小程序不支持打开外链，因此请复制以下链接到浏览器中进行操作：',
      modalContent: link
    });
  },

  // 复制内容
  copyText() {
    wx.setClipboardData({
      data: this.data.modalContent,
      success: function (res) {
        wx.showToast({
          title: '复制成功'
        });
      }
    });
  },

  //关闭蒙层
  closeModal: function (e) {
    this.setData({
      showModal: false,
      modalContent: ''
    })
  },

  preventTouchMove: function (e) {
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