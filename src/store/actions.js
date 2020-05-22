

const saveUserinfo = function (obj) {
  return new Promise((resolve => {
    // 保存到sessionStorage
    sessionStorage.setItem('userinfo', JSON.stringify(obj))
    resolve(obj)
  }))
}

const removeUserinfo = function () {
  return new Promise((resolve => {
    sessionStorage.removeItem('userinfo')
    resolve(true)
  }))
}

const removeToken = function () {
  return new Promise((resolve => {
    // 只删除userinfo中的token
    let userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
    userinfo.token = null
    sessionStorage.setItem('userinfo', JSON.stringify(userinfo))
    resolve(true)
  }))
}

export default {

  setUserInfo({commit}, obj) {
    return new Promise((resolve => {
      // 先保存到sessionStorage中
      saveUserinfo(obj).then(res => {
        commit('USERINFO', res);
        resolve()
      })
    }))

  },
  removeUserInfo({commit}) {
    return new Promise((resolve => {
      // 先删除sessionStorage中的信息
      removeUserinfo().then(res =>{
        commit('REMOVEUSERINFO');
        resolve()
      })
    }))
  },
  removeToken({commit}) {
    return new Promise((resolve => {
      removeToken().then(res =>{
        commit('REMOVETOKEN');
        resolve()
      })
    }))
  },
  deleteViewRoute({commit, state}, obj) {
    return new Promise(resolve => {
      commit('DELETEVIEW', obj);
      resolve([...state.visitedViews])
    })
  }
}
