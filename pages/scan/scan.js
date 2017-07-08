// scan.js
const host = require('../../config.js').host;

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    managerAccount:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        managerAccount:options.account
      })
    });
  },
  onShow: function () {
    wx.hideLoading();
  },
  /**
   * 扫码并上传服务器,接收返回的书籍借阅信息
   */
  scan:function(){
    var bookStatusId = '';
    
    //带有扫码功能
    wx.scanCode({//扫码
      onlyFromCamera: true,
      success: function(res) {
        bookStatusId=res.result;
        //上传服务器
        wx.showLoading({
          title: '加载中',
        });
       wx.request({
      url: host + '/scan',
      method: 'post',
      data: {
        bookStatusId: bookStatusId
      },
      success: function (res) {
        var content='';
        if (res.data == '操作失败！找不到对应记录!') {//找不到对应记录
        wx.hideLoading();
          content ='二维码无效！'
          wx.showModal({
            title: '扫码失败',
            content: content,
            showCancel: false
          })
        } else if (res.data == '操作失败！图书已经被归还！') {//图书已经被归还
        wx.hideLoading();
          content = '图书已归还！'
          wx.showModal({
            title: '操作失败',
            content: content,
            showCancel: false
          })
          }else{

          //页面传参
          var userId = res.data.userId;
          var bookTitle=res.data.bookTitle;
          var action=res.data.action;
          var bookCover=res.data.bookCover;

          wx.navigateTo({//跳转到check页面
            url: '/pages/check/check?userId=' + userId + "&bookTitle=" + bookTitle +
            "&action=" + action + "&bookCover=" + bookCover + "&bookStatusId=" + bookStatusId
          })
        }
        

      },
      fail: function (res) {
        //上传失败
        wx.hideLoading();
        wx.showModal({
          title: '网络错误',
          content: '请检查网络设置',
          showCancel: false
        })
      }
    })
      },
      //扫码失败
      fail:function(res){
        if (res.errMsg == "scanCode:fail cancel"){}
        else{
        wx.showModal({
          title: '扫码失败',
          content: '请检查设备',
          showCancel: false
        })
        }
      }
    })
  }
 
})