

//图书零售管理

export default [
  {
    path: 'retailStore',
    name: '图书分销管理',
    // 至少要有添加订单的权限
    meta: {title: '图书分销管理', icon: 'el-icon-s-goods',permissions:['disOrder:add']},
    component: () => import('./retailStore')
  },
  {
    path: 'orderMang',
    name: '分销订单管理',
    // 至少要有查询订单的权限
    meta: {title: '订单管理', icon: 'el-icon-s-order',permissions:['disOrder:get']},
    component: () => import('./orderMang')
  }
]
