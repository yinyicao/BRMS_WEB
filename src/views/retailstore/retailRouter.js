

//图书零售管理

export default [
  {
    path: 'retailStore',
    name: '图书分销管理',
    meta: {title: '图书分销管理', icon: 'el-icon-s-goods'},
    component: () => import('./retailStore')
  },
  {
    path: 'orderMang',
    name: '分销订单管理',
    meta: {title: '订单管理', icon: 'el-icon-s-order'},
    component: () => import('./orderMang')
  }
]
