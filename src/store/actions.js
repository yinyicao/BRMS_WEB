import axios from 'axios'

const userinfo = function (obj) {
  return new Promise((resolve => {
    axios.post('/main/getUserInfo/' + obj).then(res => {
      if (res.status) {
        window.localStorage.setItem('userinfo', JSON.stringify(res.data.data))
        resolve(res.data.data)
      }

    }).catch((error) => {
      console.log(error)
    })
  }))
}

export default {

  getUserInfo({commit}, obj) {
    return new Promise((resolve => {
      userinfo(obj).then(res => {
        commit('USERINFO', res);
        resolve()
      })
    }))

  },
  removeStorage(state) {
    state.userinfo = null
    localStorage.removeItem('userinfo')
  },
  deleteViewRoute({commit, state}, obj) {
    return new Promise(resolve => {
      commit('DELETEVIEW', obj);
      resolve([...state.visitedViews])
    })
  }
}
