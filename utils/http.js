var app = getApp();

function request(options) {
  if (!options) {
    console.log('缺有效的参数')
    return
  }
  var url = options.url
  if (!url) {
    console.log('需有效的Url')
    return
  }
  var data = options.data || {}
  wxRequest(url, data, options.method, options.success, options.failure)
}

function oauth(options) {
  if (!options) {
    console.log('缺有效的参数')
    return
  }
  var data = options.data || {}
  var success = options.success
  if (!success) {
    console.log("缺少回调参数")
    return
  }
  wxAuth0Request(data, options.success, options.failure)
}

function requestWithAuth(options) {
  if (!options) {
    console.log('缺有效的参数')
    return
  }
  var url = options.url
  if (!url) {
    console.log('需有效的Url')
    return
  }
  var data = options.data || {}
  wxAuthRequest(url, data, options.method, options.success, options.failure)
}

// 普通访问 
function wxRequest(url, data, method, callback, errCallback) {
  if (url.indexOf('http') == -1) {
    url = app.globalData.baseUrl + url;
  }
  method = method ? method : 'GET';
  callback = callback ? callback : method;
  wx.request({
    url: url,
    method: method,
    data: data,
    header: {
      'Content-Type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    dataType: 'json',
    success(res) {
      if (callback)
        callback(res.data)
    },
    fail(res) {
      if (errCallback)
        errCallback(res)
      else
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 3000
        })
    }
  })
}

// 请求登录
function wxAuth0Request(data, callback, errCallback) {
  wx.request({
    url: app.globalData.baseUrl + '/authentication/weixinmp',
    //url: 'https://capi.wm.dddingjiu.com' + '/authentication/weixinmp',
    //url: 'http://localhost:9998' + '/authentication/weixinmp',
    method: 'POST',
    data: data,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
      // 'Authorization': 'Basic ZGRkal93aW5lX2FwcDpkZGRqX3dpbmVfYXBwX3NlY3JldA=='
    },
    dataType: 'json',
    success(res) {
      if (callback)
        callback(res.data)
    },
    fail(res) {
      if (errCallback)
        errCallback(res)
    }
  })
}

//  需要个人信息访问的
function wxAuthRequest(url, data, method, callback, errCallback) {
  if (url.indexOf('http') == -1) {
    url = app.globalData.baseUrl + url;
  }
  method = method ? method : 'GET';
  callback = callback ? callback : method;
  var access_token = wx.getStorageSync("access_token") || {}
  var header = {
    'Content-Type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  }
  if (access_token.access_token) {
    header.Authorization = access_token.token_type + ' ' + access_token.access_token
  }
  wx.request({
    url: url,
    method: method,
    data: data,
    header: header,
    dataType: 'json',
    success(res) {
      if (res.data.resultCode === 401 || res.data.resultCode === 4001 || res.data.code == 401 || res.data.code == 4001 || res.data.code === 4000) {
        toLogin()
        return
      } else if (callback) {
        callback(res.data)
      }
    },
    fail(res) {
      if (errCallback)
        errCallback(res)
    }
  })
}

function toLogin() {
  if (app.globalData.isOauthing) return
  app.globalData.isOauthing = true
  var pages = getCurrentPages()
  var url = pages[pages.length - 1].route
  wx.navigateTo({
    url: '/pages/login/oauth?redirectUrl=' + url
  })
}

function loginUser() {
  wx.login({
    success(res) {
      if (res.code) {
        wxAuth0Request({
          code: res.code,
          userInfo: JSON.stringify(app.globalData.userInfo)
        }, res => {
          if (res.resultCode) {
            console.log(res.errmsg)
            return
          }
          wx.setStorageSync('access_token', res);
        }, res => {
          wx.showToast({
            title: '登录失败' || res,
            icon: 'none'
          })
          console.log('failure:' + res)
        })
      }
    }
  })
}

module.exports = {
  request: request,
  oauth: oauth,
  requestWithAuth: requestWithAuth
}