

//报表

export default [
  {
    path: 'bookPress',
    name: '出版社分析',
    meta: {title: '出版社分析报表', icon: 'el-icon-data-analysis',permissions:['bookPressData:get']},
    component: () => import('./bookPress')
  },
  {
    path: 'bookCategory',
    name: '图书类别分析',
    meta: {title: '图书类别报表', icon: 'el-icon-pie-chart',permissions:['bookCategoryData:get']},
    component: () => import('./bookCategory')
  },
  {
    path: 'disOrderInterval7DayData',
    name: '近7天订单变化',
    // 需要有订单查询的权限
    meta: {title: '近7天订单数据变化情况', icon: 'el-icon-data-line',permissions:['disOrder:get']},
    component: () => import( './disOrderInterval7DayData')
  }
  // ,{
  //   path: 'bookVIP',
  //   name: '会员信息分析',
  //   meta: {title: '会员信息分析报表', icon: 'el-icon-data-line'},
  //   component: () => import('./bookVIP')
  // }
]
