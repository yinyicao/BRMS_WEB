

//图书零售管理

export default [
  {
    path: 'retailStore',
    name: '图书零售管理',
    meta: {title: '图书零售管理', icon: 'el-icon-s-goods'},
    component: () => import('./retailStore')
  },
  {
    path: 'orderMang',
    name: '订单管理',
    meta: {title: '订单管理', icon: 'el-icon-s-order'},
    component: () => import('./orderMang')
  }
]
