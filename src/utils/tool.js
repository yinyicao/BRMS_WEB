const timeFormat = function (value, fmt) {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss'

  var o = {
    'M+': value.getMonth() + 1,                 //月份
    'd+': value.getDate(),                    //日
    'h+': value.getHours(),                   //小时
    'm+': value.getMinutes(),                 //分
    's+': value.getSeconds(),                 //秒
    'q+': Math.floor((value.getMonth() + 3) / 3), //季度
    'S': value.getMilliseconds()             //毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

const showApiforMatterDateTime = function formatterDateTime() {
  var date=new Date()
  var month=date.getMonth() + 1
  var datetime = date.getFullYear()
    + ""// "年"
    + (month >= 10 ? month : "0"+ month)
    + ""// "月"
    + (date.getDate() < 10 ? "0" + date.getDate() : date
      .getDate())
    + ""
    + (date.getHours() < 10 ? "0" + date.getHours() : date
      .getHours())
    + ""
    + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
      .getMinutes())
    + ""
    + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
      .getSeconds());
  return datetime;
}
export default timeFormat
export {showApiforMatterDateTime}
