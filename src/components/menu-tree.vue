<template>
  <div>
    <div v-for="item in list">
      <el-menu-item v-if="!item.children && !item.hidden && isAdminShow(item.meta)"
                    :index="headUrl+strUrl+item.path">
        <i :class="item.meta.icon"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
      <el-submenu v-if="item.children && item.children.length && isAdminShow(item.meta)"
                  :index="headUrl+strUrl+item.path">
        <template slot="title">
          <i :class="item.meta.icon"></i>
          <span>{{item.name}}</span>
        </template>
        <menu-tree :list="item.children" :path="strUrl+item.path"></menu-tree>
      </el-submenu>
    </div>
  </div>
</template>

<script>
  export default {
    name: "menu-tree",
    props: ['list', 'path'],
    data() {
      return {
        headUrl: '/main/',
        strUrl: '',
      }
    },
    created() {
      if (this.path) {
        this.strUrl += this.path + '/';
      }
    },
    methods: {
      isAdminShow(meta) {
        // 默认为false,所以要求每一条路由的meta都要有permissions
        let res = false;
        if (meta.permissions && this.$store && this.$store.state && this.$store.state.userinfo) {
          // 拥有权限
          let havePermissions = this.$store.state.userinfo.permissions;
          // 需要权限
          let requirePermissions = meta.permissions;
          // 循环遍历-只要有其中一个权限就显示
          requirePermissions.some(rp =>{
            if (havePermissions.includes(rp)){
              res = true;
              // some()函数遍历，在其内部，只要返回true就会跳出some函数
              return true
            }
          })
          // console.log(havePermissions)
          // console.log(requirePermissions)
        }
        return res;
      }
    }
  }
</script>

<style scoped>

</style>
