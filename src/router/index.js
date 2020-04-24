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
          // 需要有订单查询的权限 TODO 这里先写为book:get
          meta: {title: '图书分销管理系统', icon: 'el-icon-s-home',permissions:['book:get']},
          component: () => import( '../views/main')
        },
        {
          path: 'bookList',
          name: '图书信息管理',
          // permissions:['book:get'] 至少要有查询图书的权限
          meta: {title: '图书列表', icon: 'el-icon-s-management',permissions:['book:get']},
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ '../views/bookList')
        },
        {
          path: 'store',
          name: '分销系统管理',
          // ['disOrder:add','disOrder:get']至少拥有两个权限中的一个
          meta: {title: '分销系统管理', icon: 'el-icon-s-shop',permissions:['disOrder:add','disOrder:get']},
          component: Layout,
          children: [
            ...retailRouter
          ]
          },
        {
          path: 'reports',
          name: '报表统计视图',
          // meta: {title: 'tipoff-record', icon: 'el-icon-alarm-clock', role: 'admin'},
          // permissions:['book:get','publisher:get']要有图书查询的权限或查询出版社
          meta: {title: '报表统计', icon: 'el-icon-s-data',permissions:['book:get','publisher:get']},
          component: Layout,
          // component: () => import(/* webpackChunkName: "about" */ '../views/reports'),
          children:[
            ...reportsRouter
          ]
        },
        {
          path: 'setting',
          name: '人员管理',
          component: Layout,
          // ['user:get','permiss:get'] 至少要拥有其中一个权限才可以显示（在menu-tree.vue中进行了判断）
          meta: {title: '人员管理', icon: 'el-icon-setting',permissions:['user:get','permiss:get']},
          children: [
            {
              path: 'user-list-setting',
              name: '用户账号设置',
              meta: {title: '用户账号设置', icon: 'el-icon-user',permissions:['user:get']},
              // route level code-splitting
              // this generates a separate chunk (about.[hash].js) for this route
              // which is lazy-loaded when the route is visited.
              component: () => import(/* webpackChunkName: "about" */ '../views/setting/user-list-setting')
            },
            {
              path: 'user-editOrAdd:id',
              name: 'user-editOrAdd',
              meta: {title: '用户账号设置',permissions:['user:get']},
              hidden: true,
              component: () => import(/* webpackChunkName: "about" */ '../views/setting/user-editOrAdd')
            },
            {
              path: 'rolePermission-setting',
              name: '角色权限配置',
              meta: {title: '角色权限配置', icon: 'el-icon-s-check',permissions:['permiss:get']},
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
