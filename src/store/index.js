import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import actions from './actions'
import evUtils from '../utils/ev-utils';

const store = new Vuex.Store({
  state: {
    locaScreen: true,
    timeRecords: [],
    opened: true,
    device: 'desktop',
    visitedViews: [],
    userinfo: null
  },
  getters: {
    getStorage(state) {
      // console.log("before refresh--->state.userinfo in vuex："+JSON.stringify(state.userinfo))
      if (!state.userinfo) {
        state.userinfo = JSON.parse(sessionStorage.getItem('userinfo'))
      }
      // console.log("refresh back--->state.userinfo in vuex："+JSON.stringify(state.userinfo))
      return state.userinfo
    }
  },
  mutations: {
    USERINFO(state, data) {
      state.userinfo = data
    },
    REMOVEUSERINFO(state) {
      state.userinfo = null
    },
    REMOVETOKEN(state) {
      state.userinfo.token = null
    },
    toggleState(state) {
      state.opened = !state.opened
    },
    toggleDevice(state, data) {
      state.device = data
    },
    closeSideBar(state, data) {
      state.opened = false
    },
    addViewRoute(state, data) {
      if (state.visitedViews.some(v => v.path === data.path)) return
      let params = data.params;
      //拼接params
      let obj = {};
      let pinString = "";
      if (evUtils.isNotEmpty(params)) {
        for (let i in params) {
          // console.log(params[i])
          pinString += ' - ' + params[i]
        }
      }
      obj.title = data.meta.title + pinString;
      Object.assign(obj, data);
      state.visitedViews.push(obj);
    },
    DELETEVIEW(state, data) {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === data.path) {
          state.visitedViews.splice(i, 1)
        }
      }
    }

  },
  actions
})
export default store
