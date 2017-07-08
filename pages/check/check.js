// check.js
const host = require('../../config.js').host;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId:"",
    bookTitle:"",
    action:"",
    bookCover:"",
    bookStatusId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({//设置确认页面参数
      userId: options.userId,
      bookTitle: options.bookTitle,
      action: options.action,
      bookCover: options.bookCover,
      bookStatusId: options.bookStatusId
    })
  },
  onShow:function(){
    wx.hideLoading();    
  },
/**
 * 点击确定按钮完成借书/还书操作
 */
 check:function(){
   wx.showLoading({
     title: '加载中',
   });
    var that=this;
    var action='';
    var bookTitle=that.data.bookTitle;
    if(that.data.action=="借书"){//判断借/还动作
      action='borrow';
    }else if(that.data.action=="还书"){
      action='return';
    }

    wx.request({//请求服务器更新状态信息，并提醒用户
      url: host+'/scan/check',
      method:'post',
      data:{
        bookTitle:bookTitle,
        bookStatusId: that.data.bookStatusId,
        action:action
      },
      success:function(res){//成功请求服务器
        /**
         * 操作失败的判断
         */
        wx.hideLoading();
        var title="";
        if (res.data =="借书成功"||res.data=="还书成功"){
          title ="操作成功"
        }else{
          title="操作失败";
        }
        wx.showModal({
          title:title,
          content: res.data,
          showCancel: false,
          complete:function(){
            wx.navigateBack({});//完成提示后返回scan页面
          }
        })
      },
      fail:function(){//出现错误
      wx.hideLoading();
        wx.showModal({
          title: '操作失败',
          content: '请检查网络设置',
          showCancel:false,
          complete:function(){
            wx.navigateBack({});//完成提示后返回scan页面
          }
        })
      }
    })
 },
/**
 * 点击取消按钮返回上一页
 */
 cancel:function(){
  wx.navigateBack({});
 }
})