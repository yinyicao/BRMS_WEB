<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">书店分销管理系统—BRMS</h3>
      </div>

      <el-form-item prop="loginname">
        <span class="svg-container">
          <i class="el-icon-user"></i>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.loginname"
          placeholder="Username"
          name="loginname"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写字母输入模式已打开" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-lock"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <i v-if="passwordType==='password'" class="el-icon-view"></i>
            <i v-else class="el-icon-close"></i>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                 @click.native.prevent="handleLogin">登录
      </el-button>

      <div style="position:relative">
        <div class="tips">
          欢迎登录图书分销管理系统V1.0
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
  import {setToken,getToken} from '../utils/auth'
  import MD5 from 'md5'

  export default {
    name: 'Login',
    data() {
      const validateLoginname = (rule, value, callback) => {
        if (value === undefined || value === "") {
          callback(new Error('请输入登录名'));
        } else if(! /^(?!\d+$)[\da-zA-Z]+$/.test(value)){
          callback(new Error('登录名必须为字母或字母数字组合'));
        }else{
          callback();
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value === undefined || value === "") {
          callback(new Error('请输入密码'));
        }else if(value.length < 6 ){
          callback(new Error('密码长度至少6位'));
        } if(! /^[\w_-]{6,}$/.test(value)){
          callback(new Error('密码只能是字母数字组成'));
        }else{
          callback();
        }
      }
      return {
        loginForm: {
          loginname: 'admin',
          password: 'a123456',
          rememberme: false
        },
        loginRules: {
          loginname: [{required: true, validator: validateLoginname}],
          password: [{required: true, validator: validatePassword}]
        },
        passwordType: 'password',
        capsTooltip: false,
        loading: false,
        turnOnCapsLock : false
      }
    },
    mounted() {
      if (this.loginForm.username === '') {
        this.$refs.username.focus()
      } else if (this.loginForm.password === '') {
        this.$refs.password.focus()
      }
    },
    destroyed() {
      // window.removeEventListener('storage', this.afterQRScan)
    },
    methods: {
      /**
       * 监听键盘、是否大写模式
       * @param shiftKey 'shift'按键是否按下，值为True和False。只有与其它按键组合时才为true
       * @param key  key表示按下的按键名称，Shift+'a'===>key='A' ,CapsLock+Shift+'a' ===>key = 'a'
       */
      checkCapslock({shiftKey, key} = {}) {
        if (key && key.length === 1) {
          if ((shiftKey && (key >= 'A' && key <= 'Z'))) {//同时按下‘Shift’和字母键，认定为大写状态
            this.capsTooltip = true
          }else if(key >= 'A' && key <= 'Z'){//只按字母键，输出为大写字母，认定为大写状态且当前打开了‘CapsLock’键
            this.turnOnCapsLock = true
            this.capsTooltip = true
          } else {//其它情况都是小写状态
            this.capsTooltip = false
          }
        }else if((key && key ==='CapsLock') || (key === 'Shift' && this.turnOnCapsLock)){
              /*
              * 1.按下‘CapsLock’ ===> 打开/关闭‘CapsLock’
              * 2.当前‘CapsLock’键处于打开状态，按下了‘Shift键’ ===> 关闭‘CapsLock’
              * */
              this.turnOnCapsLock = !this.turnOnCapsLock
              this.capsTooltip = !this.capsTooltip
        }
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        let obj = JSON.parse(JSON.stringify(this.loginForm));
        obj.password = MD5(obj.password);
        this.loading = true;

        this.$http.post('/main/login', obj).then(res => {
          // console.log(res)
          this.loading = false
          if (res.code === 2000) { //登录成功
            this.$message.success(res.msg)
            // if (setToken(res.data.token)){//浏览器Cookies开启，存储成功
            //   //将Token设置到每次请求的header中
            //   axios.defaults.headers.common['Token'] =  getToken();
            // } else {
            //   axios.defaults.headers.common['Token'] =  res.data.token;
            // }
            // let id = res.data.user.id;
            let data = res.data;
            //获取用户信息存储到全局变量中
            this.$store.dispatch('getUserInfo', data).then(res => {

              this.$router.replace('/main/index');
            });

          } else {
            this.$message.error(res.msg)
          }

        }).catch(() => {
          this.loading = false
        })
      },
    }
  }
</script>

<style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 0;
      bottom: 6px;
    }

    @media only screen and (max-width: 470px) {
      .thirdparty-button {
        display: none;
      }
    }
  }
</style>
