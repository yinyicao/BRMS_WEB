import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Layout from '../components/layout'
import reportsRouter from '../views/reports/reportsRouter'
import retailRouter from '../views/retailstore/retailRouter'

Vue.use(Router);

const router = new Router({
  mode:'hash',
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
      path: "/404",
      name: "notFound",
      component: () => import('../components/404')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../components/Main'),
      meta: {title: '主页'},
      children: [
        {
          path: 'index',
          name: '主页',
          meta: {title: '图书分销管理系统', icon: 'el-icon-s-home'},
          component: () => import( '../views/main')
        },
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
          path: 'store',
          name: '分销系统管理',
          meta: {title: '分销系统管理', icon: 'el-icon-s-shop'},
          component: Layout,
          children: [
            ...retailRouter
          ]
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
          meta: {title: '设置', icon: 'el-icon-setting',role:'admin'},
          children: [
            {
              path: 'user-list-setting',
              name: '用户账号设置',
              meta: {title: '用户账号设置', icon: 'el-icon-user',role:'admin'},
              // route level code-splitting
              // this generates a separate chunk (about.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "about" */ '../views/setting/user-list-setting')
            },
            {
              path: 'user-editOrAdd:id',
              name: 'user-editOrAdd',
              meta: {title: '用户账号设置',role:'admin'},
              hidden: true,
              component: () => import(/* webpackChunkName: "about" */ '../views/setting/user-editOrAdd')
            },
            {
              path: 'rolePermission-setting',
              name: '角色权限配置',
              meta: {title: '角色权限配置', icon: 'el-icon-s-check',role:'admin'},
              component: () => import(/* webpackChunkName: "about" */ '../views/setting/role-setting')
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
  }else if(to.meta.role === 'admin' && store && store.state && store.state.userinfo){
    let isAdmin = store.state.userinfo.rolenames.includes('admin');
    if (!isAdmin){//没有admin角色
      next('/no-permission')
    }else{
      next()
    }
  }else if (to.matched.length !== 0) {
    next()
  }else { //跳转404
    next({ path: '/404' })
  }

  // /!* 路由发生变化修改页面title *!/
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()

});


export default router
