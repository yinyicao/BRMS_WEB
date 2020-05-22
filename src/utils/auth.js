import Cookies from 'js-cookie'

/**
 * 登录验证的Token信息,JWT+Shiro
 * @type {string}
 */
const TokenKey = 'Admin-Token'

export function getToken() {
  if(navigator.cookieEnabled) { //浏览器开启Cookies
    return Cookies.get(TokenKey)
  }else{
    console.log("浏览器未开启Cookies!")
    return false;
  }

}

export function setToken(token) {
  if(navigator.cookieEnabled){ //浏览器开启Cookies
    Cookies.set(TokenKey, token, {expires: 0.1}) //设置token，并设置有效期为0.1天
    return true;
  }else{
    console.log("浏览器未开启Cookies!")
    return false;
  }

}

export function removeToken() {
  if(navigator.cookieEnabled) { //浏览器开启Cookies
    Cookies.remove(TokenKey)
    return true;
  }else{
    console.log("浏览器未开启Cookies!")
    return false;
  }
}
