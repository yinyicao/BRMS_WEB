let fullTime = function (time) {
  return time > 9 ? time : '0' + time
};
export default {

  //判断对象不为空
  isNotEmpty(obj) {
    if (JSON.stringify(obj) === "{}") {
      return false
    }
    return true
    // 或者 return Object.keys(obj).length === 0
  },
  //判断对象是数组
  isArray(arr) {
    if (Array.isArray(arr)) {
      return true
    }
    return false
  },

  //判断是字符串
  isString(str) {
    if (Object.prototype.toString.call(str) === "[object String]") {
      return true
    }
    return false
  },
  //获取当天凌晨时间
  getTodayDate() {
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth()+1;
    let day = fullTime(time.getDate());
    //2019-06-06 11:56:04
    return year + '-' + month + '-' + day + ' 00:00:00'
  },
  //将编码转换成字符
  utf8ToChar(str) {
    var iCode, iCode1, iCode2;
    iCode = parseInt("0x" + str.substr(1, 2));
    iCode1 = parseInt("0x" + str.substr(4, 2));
    iCode2 = parseInt("0x" + str.substr(7, 2));
    return String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));
  },
   //将URL中的UTF-8字符串转成中文字符串
  getCharFromUtf8(str) {
    var cstr = "";
    var nOffset = 0;
    if (str == "")
      return "";
    str = str.toLowerCase();
    nOffset = str.indexOf("%e");
    if (nOffset == -1)
      return str;
    while (nOffset != -1) {
      cstr += str.substr(0, nOffset);
      str = str.substr(nOffset, str.length - nOffset);
      if (str == "" || str.length < 9)
        return cstr;
      cstr += this.utf8ToChar(str.substr(0, 9));
      str = str.substr(9, str.length - 9);
      nOffset = str.indexOf("%e");
    }
    return cstr + str;
  },

}
