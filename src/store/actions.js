import axios from 'axios'

const userinfo = function (obj) {
  return new Promise((resolve => {
    //用户登录时已经返回足够的数据，这里不再需要去请求
    sessionStorage.setItem('userinfo', JSON.stringify(obj))
    resolve(obj)
    // axios.post('/main/setUserInfo/' + obj).then(res => {
    //   if (res.status) {
    //     window.localStorage.setItem('userinfo', JSON.stringify(res.data.data))
    //     resolve(res.data.data)
    //   }
    //
    // }).catch((error) => {
    //   console.log(error)
    // })
  }))
}

export default {

  setUserInfo({commit}, obj) {
    return new Promise((resolve => {
      userinfo(obj).then(res => {
        commit('USERINFO', res);
        resolve()
      })
    }))

  },
  removeStorage(state) {
    state.userinfo = null
    sessionStorage.removeItem('userinfo')
  },
  deleteViewRoute({commit, state}, obj) {
    return new Promise(resolve => {
      commit('DELETEVIEW', obj);
      resolve([...state.visitedViews])
    })
  }
}
