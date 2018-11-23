var utils = require('../../utils/util.js');
import Config from '../../config/config.js';

var app = getApp();

Page({

  data: {
    activity_id: null,
    activityName: '',
    activityDay: '',
    activityTime: '',
    is_first: true,
    participate_id: null,
    disabled: false,
    expired: false,

    names: ['name', 'sex', 'phone', 'project', 'identity', 'card_type', 'card_id',
      'country', 'school', 'stu_id', 'enter_school', 'department', 'major', 'education',
      'job', 'email', 'address', 'birth', 'blood', 'body_height', 'body_weight',
      'cloth_size', 'shoe_size', 'history', 'leader', 'pb', 'pb_activity', 'contact_man',
      'contact_phone', 'attach', 'remark'],
    json_names: { 'name': 0, 'sex': 0, 'phone': 0, 'project': 0, 'identity': 0,'card_type':0, 'card_id':0,
      'country': 0, 'school': 0, 'stu_id': 0, 'enter_school': 0, 'department': 0, 'major': 0, 'education': 0, 
      'job': 0, 'email': 0, 'address': 0, 'birth': 0, 'blood': 0, 'body_height': 0, 'body_weight': 0, 
      'cloth_size': 0, 'shoe_size': 0, 'history': 0, 'leader': 0, 'pb': 0, 'pb_activity': 0, 'contact_man': 0,
      'contact_phone': 0, 'attach': 0, 'remark': 0 },
    name: '',
    sexs: ['男', '女'],
    sex_idx: 0,
    phone: '',
    projects: [],
    project_idx: 0,
    identity: '',
    card_types: ['身份证','军官证','护照','学生证'],
    card_type_idx: 0,
    card_id: '',
    country: '',
    school: '',
    stu_id: '',
    enter_school: 2011,
    department: '',
    major: '',
    educations: ['小学','初中','高中','中专','高职','专科','本科','硕士研究生','博士研究生'],
    education_idx: 6,
    job: '',
    email: '',
    address: '',
    birth: utils.formatDay(new Date),
    bloods: ['O','A','B','AB'],
    blood_idx: 0,
    body_height: '',
    body_weight: '',
    cloth_sizes: ['XXS','XS','S','M','L','XL','XXL'],
    cloth_size_idx: 3,
    shoe_sizes: [35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,40,40.5,41,41.5,42,42.5,43,43.5,44,44.5,45,45.5,46],
    shoe_size_idx: 12,
    history: '',
    leader: '',
    pb: '',
    pb_activity: '',
    contact_man: '',
    contact_phone: '',
    attach: '',
    remark: ''
  },

  onLoad: function (options) {
    var selected_names = app.globalData.activity_data['selected_names'];
    var json_names = this.data.json_names;
    for (var i = 0; i < selected_names.length; i++) {
      json_names[selected_names[i]] = 1;
    }

    var projects = app.globalData.activity_data['activityProject'].replace(/，/g, ',');
    projects = projects.split(',');

    this.setData({
      'activity_id': options.activity_id,
      "activityName": app.globalData.activity_data['activityName'],
      "activityDay": app.globalData.activity_data['activityDay'],
      "activityTime": app.globalData.activity_data['activityTime'],
      'projects': projects,
      'json_names': json_names
    })

    //console.log(this.data);
    app.globalData.activity_data = null;

    var that = this;
    wx.request({
      url: Config.URI,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        type: 7,
        activity_id: that.data.activity_id,
        openid: app.globalData.openid
      },
      success: function (res) {
        if (res.data != '') {                     
          that.setData({
            'is_first': false,
            'disabled': true,
            'participate_id': res.data.participate_id
          })

          var names = that.data.names;
          for (var i = 0; i < names.length; i++) {
            if (that.data.json_names[names[i]] == 1) {
              if (names[i] == 'sex' || names[i] == 'project' || names[i] == 'card_type' || names[i] == 'education' ||
                names[i] == 'blood' || names[i] == 'cloth_size' || names[i] == 'shoe_size') {
                for (var j = 0; j < that.data[names[i] + 's'].length; j++) {
                  if (that.data[names[i] + 's'][j] == res.data[names[i]]) {
                    var item = {};
                    item[names[i] + '_idx'] = j;
                    that.setData(item);
                    break;
                  }
                }
              }
              else {
                var item = {};
                item[names[i]] = res.data[names[i]];
                that.setData(item);
              }
            }
          }
        }

        //wx.hideLoading();
      }
    });

    var currentDay = utils.formatDay(new Date);
    var currentTime = utils.formatTime(new Date);
    if(currentDay + ' ' + currentTime > this.data.activityDay + ' ' + this.data.activityTime) {
      this.setData({
        'expired': true
      });

      wx.showToast({
        title: '报名已结束',
        duration: 3000
      });
    }
  },

  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },

  sexChange(e) {
    this.setData({
      sex_idx: e.detail.value
    })
  },

  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  projectChange(e) {
    this.setData({
      project_idx: e.detail.value
    })
  },

  identityInput(e) {
    this.setData({
      identity: e.detail.value
    })
  },

  card_typeChange(e) {
    this.setData({
      card_type_idx: e.detail.value
    })
  },

  card_idInput(e) {
    this.setData({
      card_id: e.detail.value
    })
  },

  countryInput(e) {
    this.setData({
      country: e.detail.value
    })
  },

  schoolInput(e) {
    this.setData({
      school: e.detail.value
    })
  },

  stu_idInput(e) {
    this.setData({
      stu_id: e.detail.value
    })
  },

  enter_schoolChange(e) {
    this.setData({
      enter_school: e.detail.value
    })
  },

  departmentInput(e) {
    this.setData({
      department: e.detail.value
    })
  },

  majorInput(e) {
    this.setData({
      major: e.detail.value
    })
  },

  educationChange(e) {
    this.setData({
      education_idx: e.detail.value
    })
  },

  jobInput(e) {
    this.setData({
      job: e.detail.value
    })
  },

  emailInput(e) {
    this.setData({
      email: e.detail.value
    })
  },

  addressInput(e) {
    this.setData({
      address: e.detail.value
    })
  },

  birthChange(e) {
    this.setData({
      birth: e.detail.value
    })
  },

  bloodChange(e) {
    this.setData({
      blood_idx: e.detail.value
    })
  },

  body_heightInput(e) {
    this.setData({
      body_height: e.detail.value
    })
  },

  body_weightInput(e) {
    this.setData({
      body_weight: e.detail.value
    })
  },

  cloth_sizeChange(e) {
    this.setData({
      cloth_size_idx: e.detail.value
    })
  },

  shoe_sizeChange(e) {
    this.setData({
      shoe_size_idx: e.detail.value
    })
  },

  historyInput(e) {
    this.setData({
      history: e.detail.value
    })
  },

  leaderInput(e) {
    this.setData({
      leader: e.detail.value
    })
  },

  pbInput(e) {
    this.setData({
      pb: e.detail.value
    })
  },

  pb_activityInput(e) {
    this.setData({
      pb_activity: e.detail.value
    })
  },

  contact_manInput(e) {
    this.setData({
      contact_man: e.detail.value
    })
  },

  contact_phoneInput(e) {
    this.setData({
      contact_phone: e.detail.value
    })
  },

  attachInput(e) {
    this.setData({
      attach: e.detail.value
    })
  },

  remarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  submitParticipate() {
    var submitData = {
      'activity_id': this.data.activity_id,
      'createDay': utils.formatDay(new Date),
      'createTime': utils.formatTime(new Date),
      'openid': app.globalData.openid,
      'is_first': this.data.is_first,
      'participate_id': this.data.participate_id
    };

    var names = this.data.names;
    for (var i = 0; i < names.length; i++) {
      if (this.data.json_names[names[i]] == 1) {
        if (names[i] == 'name') {
          if (this.data.name == '') {
            wx.showModal({
              title: '提示',
              content: '姓名不能为空',
              showCancel: false
            })
            return;
          }
          submitData['name'] = this.data.name;
        }
        else if (names[i] == 'sex') {
          submitData['sex'] = this.data.sexs[this.data.sex_idx];
        }
        else if (names[i] == 'phone') {
          if (!this.data.phone.match(/^\d{11}$/)) {
            wx.showModal({
              title: '提示',
              content: '请检查手机号码是否正确',
              showCancel: false
            })
            return;
          }
          submitData['phone'] = this.data.phone;
        }
        else if (names[i] == 'project') {
          if (this.data.projects.length > 0) {
            submitData['project'] = this.data.projects[this.data.project_idx];
          }
        }
        else if (names[i] == 'identity') {
          if (!isTrueIdentity(this.data.identity)) {
            wx.showModal({
              title: '提示',
              content: '请检查身份证是否正确',
              showCancel: false
            })
            return;
          }
          submitData['identity'] = this.data.identity;
        }
        else if (names[i] == 'card_type') {
          submitData['card_type'] = this.data.card_types[this.data.card_type_idx];
        }
        else if (names[i] == 'card_id') {
          if (this.data.card_type_idx == 0 && !isTrueIdentity(this.data.card_id)) {
            wx.showModal({
              title: '提示',
              content: '请检查身份证是否正确',
              showCancel: false
            })
            return;
          }
          submitData['card_id'] = this.data.card_id;
        }
        ////////////////////////////////////////
        else if (names[i] == 'country') {
          if (this.data.country == '') {
            wx.showModal({
              title: '提示',
              content: '国籍不能为空',
              showCancel: false
            })
            return;
          }
          submitData['country'] = this.data.country;
        }
        else if (names[i] == 'school') {
          if (this.data.school == '') {
            wx.showModal({
              title: '提示',
              content: '学校不能为空',
              showCancel: false
            })
            return;
          }
          submitData['school'] = this.data.school;
        }
        else if (names[i] == 'stu_id') {
          if (this.data.stu_id == '') {
            wx.showModal({
              title: '提示',
              content: '学号不能为空',
              showCancel: false
            })
            return;
          }
          submitData['stu_id'] = this.data.stu_id;
        }
        else if (names[i] == 'enter_school') {
          submitData['enter_school'] = this.data.enter_school;
        }
        else if (names[i] == 'department') {
          if (this.data.department == '') {
            wx.showModal({
              title: '提示',
              content: '院系不能为空',
              showCancel: false
            })
            return;
          }
          submitData['department'] = this.data.department;
        }
        else if (names[i] == 'major') {
          if (this.data.major == '') {
            wx.showModal({
              title: '提示',
              content: '专业不能为空',
              showCancel: false
            })
            return;
          }
          submitData['major'] = this.data.major;
        }
        else if (names[i] == 'education') {
          submitData['education'] = this.data.educations[this.data.education_idx];
        }
        /////////////////////////////////////////////
        else if (names[i] == 'job') {
          if (this.data.job == '') {
            wx.showModal({
              title: '提示',
              content: '职业不能为空',
              showCancel: false
            })
            return;
          }
          submitData['job'] = this.data.job;
        }
        else if (names[i] == 'email') {
          if (this.data.email.match(/^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@([a-zA-Z0-9]+[-.])+[a-zA-Z0-9]{2,5}$/) == null) {
            wx.showModal({
              title: '提示',
              content: '请检查邮箱是否正确',
              showCancel: false
            })
            return;
          }
          submitData['email'] = this.data.email;
        }
        else if (names[i] == 'address') {
          if (this.data.address == '') {
            wx.showModal({
              title: '提示',
              content: '通讯地址不能为空',
              showCancel: false
            })
            return;
          }
          submitData['address'] = this.data.address;
        }
        else if (names[i] == 'birth') {
          submitData['birth'] = this.data.birth;
        }
        else if (names[i] == 'blood') {
          submitData['blood'] = this.data.bloods[this.data.blood_idx];
        }
        else if (names[i] == 'body_height') {
          if (!this.data.body_height.match(/^\d+$/)) {
            wx.showModal({
              title: '提示',
              content: '身高不能为空，且必须是整数',
              showCancel: false
            })
            return;
          }
          submitData['body_height'] = this.data.body_height;
        }
        else if (names[i] == 'body_weight') {
          if (!this.data.body_weight.match(/^\d+$/)) {
            wx.showModal({
              title: '提示',
              content: '体重不能为空，且必须是整数',
              showCancel: false
            })
            return;
          }
          submitData['body_weight'] = this.data.body_weight;
        }
        ////////////////////////////////////////
        else if (names[i] == 'cloth_size') {
          submitData['cloth_size'] = this.data.cloth_sizes[this.data.cloth_size_idx];
        }
        else if (names[i] == 'shoe_size') {
          submitData['shoe_size'] = this.data.shoe_sizes[this.data.shoe_size_idx];
        }
        else if (names[i] == 'history') {
          submitData['history'] = this.data.history;
        }
        else if (names[i] == 'leader') {
          submitData['leader'] = this.data.leader;
        }
        else if (names[i] == 'pb') {
          if (this.data.pb == '') {
            wx.showModal({
              title: '提示',
              content: '最好成绩不能为空',
              showCancel: false
            })
            return;
          }
          submitData['pb'] = this.data.pb;
        }
        else if (names[i] == 'pb_activity') {
          if (this.data.pb_activity == '') {
            wx.showModal({
              title: '提示',
              content: '最好成绩比赛不能为空',
              showCancel: false
            })
            return;
          }
          submitData['pb_activity'] = this.data.pb_activity;
        }
        else if (names[i] == 'contact_man') {
          if (this.data.contact_man == '') {
            wx.showModal({
              title: '提示',
              content: '紧急联系人不能为空',
              showCancel: false
            })
            return;
          }
          submitData['contact_man'] = this.data.contact_man;
        }
        //////////////////////////////////////
        else if (names[i] == 'contact_phone') {
          if (!this.data.contact_phone.match(/^\d{11}$/)) {
            wx.showModal({
              title: '提示',
              content: '请检查紧急联系号码是否正确',
              showCancel: false
            })
            return;
          }
          submitData['contact_phone'] = this.data.contact_phone;
        }
        else if (names[i] == 'attach') {
          submitData['attach'] = this.data.attach;
        }
        else if (names[i] == 'remark') {
          submitData['remark'] = this.data.remark;
        }
      }
    }

    //console.log(submitData);

    var that = this;
    wx.request({
      url: Config.URI,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      data: {
        type: 8,
        data: JSON.stringify(submitData)
      },
      success: function (res) {
        console.log(res.data);
        var participate_id = res.data;
        that.setData({
          'participate_id': participate_id
        });

        wx.showModal({
          title: '提示',
          content: '提交报名成功',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              that.setData({
                'is_first': false,
                'disabled': true
              })
            }
          }
        });
      }
    })
  },

  editParticipate() {
    this.setData({
      disabled: false
    })

    wx.showToast({
      title: '可编辑模式',
      duration: 2000
    });
  },

  // 删除报名
  deleteParticipate() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请确认是否删除报名？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: Config.URI,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            data: {
              type: 9,
              openid: app.globalData.openid,
              activity_id: that.data.activity_id
            },

            success: function (res) {
              //console.log(res.data);
              wx.reLaunch({
                url: '../activity/activity?activity_id=' + that.data.activity_id + '&activityName=' + that.data.activityName
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

function isTrueIdentity(identity) {
  var arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];//加权因子
  var arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2];//校验码

  if (/^\d{17}(\d|x|X)$/i.test(identity)) {
    var sum = 0, idx;
    for (var i = 0; i < identity.length - 1; i++) {
      // 对前17位数字与权值乘积求和
      sum += parseInt(identity.substr(i, 1), 10) * arrExp[i];
    }

    // 计算模（固定算法）
    idx = sum % 11;

    // 检验第18为是否与校验码相等
    return arrValid[idx] == identity.substr(17, 1).toUpperCase();
  }
  else {
    return false;
  }
}