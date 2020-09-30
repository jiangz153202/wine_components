const formatTime = date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

/**
 * 两位数字，补全0位 ex: 1 -> 01
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isValidPhoneNumber = str => {
  var mobileReg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!mobileReg.test(str)) {
    return false;
  } else {
    return true;
  }
}
const throttle= function(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 300 ;//间隔时间，如果interval不传，则默认300ms
  return function() {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context,arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}


/*函数防抖*/
const debounce = function (fn, interval) {
  var timer;
  var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  return function() {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn.call(context,args);
    }, gapTime);
  };
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  formatNumber: formatNumber,
  isValidPhoneNumber: isValidPhoneNumber,
  throttle:throttle,
  debounce:debounce
}