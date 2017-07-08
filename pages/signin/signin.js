// sign_in.js
const host = require('../../config.js').host;

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
  account:'',
  password:'',
  userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  /**
   * 输入账号
   */
  bindAccount:function(e){
    this.setData({
      account: e.detail.value
    })
  },
  /**
   * 输入密码
   */
  bindPassword:function(e){
    this.setData({
      password: e.detail.value
    })
  },
/**
 * 登录
 */
  signin:function(){
    wx.showLoading({
      title: '加载中',
    });
    var that=this;
    wx.request({//发送账号密码
      url: host+'/signin/managerapp',
      method:'post',
      data:{
        account:that.data.account,
        password:that.data.password
      },
      success:function(res){//成功登陆跳转到scan页面

        if (res.data =='成功登录'){
          wx.redirectTo({
            url: '/pages/scan/scan?account='+that.data.account,         
          })
        }else{//登陆失败
        wx.hideLoading();
         wx.showModal({
           title: '登录失败',
           content: res.data,
           showCancel:false
         })
        }
      },
      fail:function(e){//上传失败
      wx.hideLoading();
        wx.showModal({
          title: '登录失败',
          showCancel: false,
          content: '网络错误'
        })
      } 

    });
  }
})