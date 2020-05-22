<template>
  <div class="header-container">
    <div style="display: flex;justify-items: center">
      <div @click="toggleMenu" class="toggle">
        <i class="el-icon-s-fold font-20" v-if="$store.state.opened"></i>
        <i class="el-icon-s-unfold font-20" v-else></i>
      </div>

      <div class="m-l-20">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
            <span v-if="index==levelList.length-1">{{ item.meta.title }}</span>
            <a v-else>{{ item.meta.title }}</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <div class="log-out">
      <el-tag class="m-r-10">{{this.$store.state.userinfo.username}}</el-tag>
      <el-tooltip class="item" @click.native="logout" effect="dark" content="退出登录" placement="bottom">
        <i class="el-icon-switch-button font-20"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import {removeToken} from '../utils/auth'
  import {Msg} from "../utils/MessageTipsUtil";

  export default {
    name: 'header-bar',
    data() {
      return {
        levelList: []
      }
    },
    watch: {
      $route() {
        this.getLevelList()
      }
    },
    created() {
      this.getLevelList()
    },
    mounted() {
    },
    methods: {
      getLevelList() {
        let matched = this.$route.matched.filter(item => item.meta);
        this.levelList = matched
      },
      toggleMenu() {
        this.$store.commit('toggleState')
      },
      logout() {
        this.$confirm('确认退出登录？')
          .then(() => {
            // 清除sessionStorage和Vuex中的TOKEN数据
            this.$store.dispatch('removeToken')
            // 请求shiro自带的登出接口,FIXME: 退出登录后，token在有效期内仍然可以请求数据
            // 出现该问题的原因是由于使用Jwt集成了shiro,所以后端token并没有真正的被清除
            // 解决方法：后端可以将token存在内存数据库(如redis)中，验证token前先验证数据库中是否存在，退出登录时删除token。
            this.$http.get('/logout').then(res =>{
                this.$router.replace('/')
            })
          })
          .catch(_ => {
          })
      }
    }
  }
</script>

<style scoped>
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    background: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    height: 50px;
    overflow: hidden;
  }

  .log-out {
    margin-right: 20px;
    cursor: pointer;
  }

  .toggle {
    margin-left: 20px;
    cursor: pointer;
  }

  .font-20 {
    font-size: 20px;
  }
</style>
