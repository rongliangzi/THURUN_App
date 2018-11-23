var utils = require('../../utils/util.js');
import Config from '../../config/config.js';

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid_aes: '',
    is_root: false,
    is_admin: false,
    no_access_tips: '',

    activity_id: null,
    activityName: '',
    activityTags: ["马拉松", "接力赛", "长跑节", "拉练", "会刊征文", "志愿者招募", "其他"],
    tag_idx: 0,
    activityProject: '',
    activityAddress: '',
    activityDay: utils.formatDay(new Date),
    activityTime: utils.formatTime(new Date),
    activityDescription: '',
    startEnterDay: utils.formatDay(new Date),
    startEnterTime: utils.formatTime(new Date),
    stopEnterDay: utils.formatDay(new Date),
    stopEnterTime: utils.formatTime(new Date),
    author_id: null,
    author_nickName: null,
    info_items: [
      { name: 'name', value: '姓名', checked: 'true'},
      { name: 'sex', value: '性别', checked: 'true' },
      { name: 'phone', value: '手机', checked: 'true'},

      { name: 'project', value: '项目', checked: 'true' },
      { name: 'remark', value: '备注'},
      { name: 'attach', value: '附件' },

      { name: 'country', value: '国籍'},
      { name: 'email', value: '邮箱'},
      { name: 'card_type', value: '证件类型' },

      { name: 'birth', value: '生日' },
      { name: 'address', value: '地址' },
      { name: 'card_id', value: '证件号' },
      
      { name: 'blood', value: '血型' },
      { name: 'history', value: '病史' },
      { name: 'identity', value: '身份证' },
      
      { name: 'stu_id', value: '学号' },
      { name: 'school', value: '学校' },
      { name: 'enter_school', value: '入学年份' },

      { name: 'department', value: '院系' },
      { name: 'major', value: '专业' },
      { name: 'cloth_size', value: '衣服尺码' },

      { name: 'education', value: '学历' },
      { name: 'job', value: '职业' },
      { name: 'shoe_size', value: '鞋子尺码' },

      { name: 'body_height', value: '身高' },
      { name: 'body_weight', value: '体重' },
      { name: 'leader', value: '队长姓名' },

      { name: 'contact_man', value: '紧急联系人' },
      { name: 'contact_phone', value: '紧急联系号码' },

      { name: 'pb', value: '最好成绩' },
      { name: 'pb_activity', value: '最好成绩比赛' }
    ],
    selected_names: ['name', 'sex', 'phone', 'project']
  },

  onLoad: function(options) {
    this.setData({
      is_root: app.globalData.is_root,
      is_admin: app.globalData.is_admin
    });

    if(!this.data.is_root && !this.data.is_admin) {
      wx.showLoading({
        title: '加载中',
      });

      var that = this;
      wx.request({
        url: Config.URI,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data: {
          type: 13
        },
        success: function (res) {
          console.log(res.data);

          var aes_key_hexstr_16 = res.data.aes_key_hexstr_16;
          var aes_iv_hexstr_16 = res.data.aes_iv_hexstr_16;
          var openid_aes = utils.aes_enc(app.globalData.openid, aes_key_hexstr_16, aes_iv_hexstr_16);

          that.setData({
            no_access_tips: "您没有权限进行此操作，要申请 创建活动 权限，请复制如下代码并发送给管理员：",
            openid_aes: openid_aes
          });

          wx.hideLoading();
        }
      });

      return;
    }

    if (options.activity_id != null) {
      //console.log(app.globalData.activity_data)

      this.setData({
        'activity_id': options.activity_id,
        'activityName': app.globalData.activity_data['activityName'],
        'activityProject': decodeURIComponent(encodeURI(app.globalData.activity_data['activityProject'])),
        'activityAddress': app.globalData.activity_data['activityAddress'],
        'activityDay': app.globalData.activity_data['activityDay'],
        'activityTime': app.globalData.activity_data['activityTime'],
        'activityDescription': app.globalData.activity_data['activityDescription'],
        'startEnterDay': app.globalData.activity_data['startEnterDay'],
        'startEnterTime': app.globalData.activity_data['startEnterTime'],
        'stopEnterDay': app.globalData.activity_data['stopEnterDay'],
        'stopEnterTime': app.globalData.activity_data['stopEnterTime'],
        'author_id': app.globalData.activity_data['author_id'],
        'selected_names': app.globalData.activity_data['selected_names']
      })

      if (app.globalData.activity_data['author_nickName']) {
        this.setData({
          'author_nickName': app.globalData.activity_data['author_nickName']
        })
      }

      for (var i = 0; i < this.data.activityTags.length; i++) {
        if (this.data.activityTags[i] == app.globalData.activity_data['activityTag']) {
          this.setData({
            'tag_idx': i
          })
          break;
        }
      }

      var info_items = this.data.info_items;
      for (var i = 0; i < this.data.selected_names.length; i++) {
        for (var j = 0; j < info_items.length; j++) {
          if (this.data.selected_names[i] == info_items[j]['name']) {
            info_items[j]['checked'] = 'true';
            break;
          }
        }
      }
      this.setData({
        'info_items': info_items
      })

      //console.log(this.data)
      app.globalData.activity_data = null;
    }
  },

  // 复制内容到剪切板
  copyText() {
    wx.setClipboardData({
      data: this.data.openid_aes,
      success: function (res) {
        wx.showToast({
          title: '复制成功'
        });
      }
    });
  },

  onReady() {
    // 隐藏当前页面的转发按钮
    wx.hideShareMenu();
  },

  onHide: function () {
    this.data.activity_id = null;
  },

  onShow: function() {
    if (this.data.activity_id != null) {
      wx.setNavigationBarTitle({
        title: 'THURUN | 编辑活动',
      })
    }
    else {
      wx.setNavigationBarTitle({
        title: 'THURUN | 创建活动',
      })
    }
    //console.log(this.data.activity_id);
  },

  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },

  //输入活动名称
  activityNameInput(e) {
    this.setData({
      activityName: e.detail.value
    })
  },

  activityTagsChange(e) {
    this.setData({
      tag_idx: e.detail.value
    })
  },

  //输入活动项目
  activityProjectInput(e) {
    this.setData({
      activityProject: e.detail.value
    })
  },

  //输入活动地点
  activityAddressInput(e) {
    this.setData({
      activityAddress: e.detail.value
    })
  },

  //修改活动时间
  activityDayChange(e) {
    this.setData({
      activityDay: e.detail.value
    })
  },

  activityTimeChange(e) {
    this.setData({
      activityTime: e.detail.value + ":00"
    })
  },

  //输入活动描述
  activityDescriptionInput(e) {
    this.setData({
      activityDescription: e.detail.value
    })
  },

  //修改报名信息
  infoCheckboxChange(e) {
    var names = [];
    e.detail.value.forEach(selected_name => {
      for (var item of this.data.info_items) {
        if (selected_name === item.name) {
          names.push(selected_name);
          break;
        }
      }
    });

    this.setData({
      selected_names: names
    });
  },

  //修改开始报名时间
  startEnterDayChange(e) {
    this.setData({
      startEnterDay: e.detail.value
    })
  },

  startEnterTimeChange(e) {
    this.setData({
      startEnterTime: e.detail.value + ":00"
    })
  },

  //修改截止报名时间
  stopEnterDayChange(e) {
    this.setData({
      stopEnterDay: e.detail.value
    })
  },

  stopEnterTimeChange(e) {
    this.setData({
      stopEnterTime: e.detail.value + ":00"
    })
  },

  //点击提交
  submitCreate() {
    var submitData = {
      'activity_id': this.data.activity_id,
      'activityName': this.data.activityName,
      'activityTag': this.data.activityTags[this.data.tag_idx],
      'activityProject': this.data.activityProject,
      'activityAddress': this.data.activityAddress,
      'activityDay': this.data.activityDay,
      'activityTime': this.data.activityTime,
      'activityDescription': this.data.activityDescription,
      'startEnterDay': this.data.startEnterDay,
      'startEnterTime': this.data.startEnterTime,
      'stopEnterDay': this.data.stopEnterDay,
      'stopEnterTime': this.data.stopEnterTime,
      'selected_names': this.data.selected_names.join('-'),
      'author_id': app.globalData.openid,
      'author_nickName': app.globalData.userInfo.nickName
    };

    if(submitData.activityName.length == 0) {
      wx.showModal({
        title: '提示',
        content: '活动名称不能为空',
        showCancel: false
      })
      return;
    }

    if(submitData.startEnterDay + " " + submitData.startEnterTime >= submitData.stopEnterDay + " " + submitData.stopEnterTime) {
      wx.showModal({
        title: '提示',
        content: '截止报名时间必须大于开始报名时间',
        showCancel: false
      })
      return;
    }

    var type = 2;
    if (this.data.activity_id != null) {
      if (this.data.author_id == app.globalData.openid) {
        this.setData({
          'author_nickName': app.globalData.userInfo.nickName
        })
      }
      
      type = 6;
      submitData.author_id = this.data.author_id;
      submitData.author_nickName = this.data.author_nickName;
    }

    wx.request({
      url: Config.URI,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        type: type,
        data: JSON.stringify(submitData)
      },
      success: function (res) {
        var activity_id = res.data;

        wx.showModal({
          title: '提示',
          content: '活动创建成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '../activity/activity?activity_id=' + activity_id + '&activityName=' + encodeURIComponent(submitData.activityName)
              })
            }
          }
        })
      }
    })
  }
})