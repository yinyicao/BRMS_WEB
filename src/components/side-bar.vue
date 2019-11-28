<template>
  <div>
    <img :src="src"  :style="{height: logoHeight+'px',width: logoWidth+'%',marginLeft: logoMarginLeft+'px'}">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu router :default-active="$route.path" mode="vertical"
               :collapse="isCollapse"
               :collapse-transition="false"
               background-color="#304156"
               text-color="#bfcbd9" active-text-color="#409EFF">
        <menu-tree :list="routerList"></menu-tree>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import MenuTree from './menu-tree'

  import logo1 from '../assets/logo1.png'
  import logo2 from '../assets/logo2.png'
  export default {
    name: 'sidebar',
    components: {MenuTree},
    data() {
      return {
        number: true,
        src:logo1,
        logoHeight:50,
        logoWidth:100,
        logoMarginLeft:20
      }
    },
    computed: {
      isCollapse() {
        if(this.$store.state.opened){
          this.src = logo1;
          this.logoHeight = 50;
          this.logoWidth = 90;
          this.logoMarginLeft = 20;
        }else{
          this.src = logo2;
          this.logoHeight = 50;
          this.logoWidth = 90;
          this.logoMarginLeft = 0;
        }
        return !this.$store.state.opened
      },
    },
    created() {
      let routes = this.$router.options.routes;
      let result = routes.filter(item => item.name == 'main');
      this.routerList = result[0].children
    },
  }
</script>

<style scoped>

</style>
