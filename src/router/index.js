import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import {getToken, removeToken} from '../utils/auth'
import Layout from '../components/layout'
import reportsRouter from '../views/reports/reportsRouter'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/no-permission',
      name: 'no-permission',
      meta: {
        title: 'no permission',
      },
      component: () => import('../components/no-permission')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../components/Main'),
      meta: {title: '主页'},
      children: [
        {
          path: 'bookList',
          name: '图书信息管理',
          meta: {title: '图书列表', icon: 'el-icon-s-management'},
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '../views/bookList')
        },
        {
          path: 'reports',
          name: '报表统计视图',
          // meta: {title: 'tipoff-record', icon: 'el-icon-alarm-clock', role: 'admin'},
          meta: {title: '报表统计', icon: 'el-icon-s-data'},
          component: Layout,
          // component: () => import(/* webpackChunkName: "about" */ '../views/reports'),
          children:[
            ...reportsRouter
          ]
        },
        {
          path: 'setting',
          name: '设置',
          component: Layout,
          meta: {title: '设置', icon: 'el-icon-setting'},
          children: [
            {
              path: 'user-list-setting',
              name: '用户账号设置',
              meta: {title: '用户账号设置', icon: 'el-icon-user'},
              // route level code-splitting
              // this generates a separate chunk (about.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "about" */ '../views/setting/user-list-setting')
            },
            {
              path: 'project-setting',
              name: '待完成',
              meta: {title: 'project', icon: 'el-icon-goods'},
              component: () => import(/* webpackChunkName: "about" */ '../views/setting/project-setting')
            },
            {
              path: 'user-editOrAdd:id',
              name: 'user-editOrAdd',
              meta: {title: 'edit user'},
              hidden: true,
              component: () => import(/* webpackChunkName: "about" */ '../views/setting/user-editOrAdd')
            },
          ]
        },
      ]
    },

  ]
})

// 每次each路由就要check token
import axios from 'axios'
import store from '../store/index'
import {Msg} from '../utils/MessageTipsUtil'

router.beforeEach((to, from, next) => {
/*  const Token = getToken();
  const toPath  = to.path;
  console.log("to.path:"+to.path)
    axios.get(
      'http://127.0.0.1:8081/SSM_war/main/checkToken',
      {headers: {'Token': Token}}
    ).then(response => {
      let res = response.data;
      console.log(res.data)
      let tokenActive= res.data.isAuthorization;
      if(true === tokenActive){ //token有效
        if (to.path === '/login') {
          next('/main')
        } else{
          next()
        }
      }else{ // token 无效
        if (to.path === '/login') {
          next()
        } else{
          next('/login')
        }
      }

    }).catch((error) => {
      console.log(JSON.parse(JSON.stringify(error)));
    }).finally((final) => {
      // console.log(final)
    })*/

/*  if (to.path === '/') {
    next({path: '/login'})
  }
  else if (to.path !== '/login' ) {
    next('/login')
  } else if (to.meta.role === 'admin' && store && store.state && store.state.userinfo) {
    let isAdmin = store.state.userinfo.role === 'admin';
    if (!isAdmin) {
      next('/no-permission')
    } else {
      next()
    }
  } else {
    next()
  }*/

  if (to.path === '/') {
    next({path: '/login'})
  }

  // /!* 路由发生变化修改页面title *!/
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()

});


export default router
