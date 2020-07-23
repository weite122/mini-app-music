// components/blog-ctrl/blog-ctrl.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    modalShow: false,
    content: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                this.setData({
                  modalShow: true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    onLoginsuccess(event) {
      userInfo = event.detail
      // 授权框消失，评论框显示
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true
        })
      })
    },


    onLoginfail() {
      wx.showModal({
        title: '授权用户才能进行评价',
        content: '',
      })
    },
    onSend(event) {
      let formId = event.detail.formId
      let content = event.detail.value.content
      if (content.trim() === '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: ''
        })
        console.log('xxxxxxxx')
        return
      }
      wx.showLoading({
        title: '评价中',
        mask: true
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res) => {
        let templateId = '702zfa_7t-BvP08DGbzk3QcB925lb_0pJbUrogpoNYc'
        wx.requestSubscribeMessage({
            tmplIds: [templateId],
            success: (res)=> {
                // 如果用户点击允许
                if(res[templateId] == 'accept'){
                    // console.log('点击了允许')
                    wx.cloud.callFunction({
                        name:'sendMessage',
                        data:{
                            templateId,
                            content,
                            blogId: this.properties.blogId
                        }
                    }).then(res => {                      
                        this.setData({
                            content:''
                        })
                    })
                } else {
                    // console.log('点击了取消')
                }
            }
            
        }) 
        wx.hideLoading()
        wx.showToast({
          title: '评论成功'
        })
        this.setData({
          modalShow: false,
          content: ''
        })
      })
    },

  }
})