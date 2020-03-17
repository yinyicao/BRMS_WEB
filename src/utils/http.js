import axios from 'axios'
import qs from 'qs';
import router from '../router/index'
import {Msg} from './MessageTipsUtil'
import store from "../store";

// Set config defaults when creating the instance
axios.defaults.baseURL = 'http://127.0.0.1:8081/SSM_war/'
// axios.defaults.baseURL = 'http://book.yinyicao.work/SSM/'
// 请求带上cookies
axios.defaults.withCredentials = true
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
      let resData = error.response.data;
      switch (error.response.status) {
        case 401:
          if (resData.code == 2002){//未登录授权
            Msg.warn(resData.msg)
            // 清除信息并跳转到登录页面
            store.dispatch("removeStorage").then(r => {
              router.replace('/login');
            })
          }else{ //没有权限操作
            Msg.warn(resData.msg)
          }
          break;
        case 500:
          Msg.error("网络错误！")
          break;
        case 404:

          break;
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });

