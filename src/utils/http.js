import axios from 'axios'
import qs from 'qs';
import {getToken,removeToken} from './auth'
import router from '../router/index'
import {Msg} from './MessageTipsUtil'

// Set config defaults when creating the instance
axios.defaults.baseURL = 'http://127.0.0.1:8081/SSM_war/'
//获取Token值为undefined,是因为这个语句在登录操作之前运行（main.js导入http.js，而main又是程序的入口-最开始执行）
//所以获取不到Token?
// axios.defaults.headers.common['Token'] =  getToken();
export default {
  get (url, param) {
    return new Promise((resolve, reject) => {
      axios.get(url, param).then(response => {
        resolve(response.data)
      }).catch((error) => {
        console.log(JSON.parse(JSON.stringify(error)));
        reject(error.message)
      }).finally((final) => {
        // console.log(final)
      })
    })
  },
  post (url, param) {
    return new Promise((resolve, reject) => {
      axios.post(
        url,
        qs.stringify(param),
        {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
      ).then(response => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      }).finally((final) => {
        // console.log(final)
      })
    })
  },
}

// http response 拦截器 ,拦截（token过期），重新登录
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          Msg.error("身份信息失效，请重新登录！")
          removeToken();
          router.replace('/login');
          break;
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });

