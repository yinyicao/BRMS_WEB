module.exports = {
  publicPath: './',
  lintOnSave: false,
  devServer: {
    https: false,
    proxy: {
      // 请求ShowApi接口
      '/api/showapi': {
        target: 'http://route.showapi.com/1626-1',
        changeOrigin: true,
        pathRewrite: {
          '^/api/showapi': ''
        }
      },
      // 请求我的后台地址
      '/api':{
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '' // 要求后端的请求地址必须是根路径，否则出现session不一致问题https://www.cnblogs.com/strinkbug/p/6073806.html
        }
      }
    },
    disableHostCheck: true
  }
}
