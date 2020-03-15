<template>
  <div>
    <el-button icon="el-icon-back" type="primary" class="m-b-20" @click.native.prevent="returnPage">返回</el-button>
    <el-row>
      <el-col :span="12">
        <el-form :label-position="labelPosition" :rules="rules" label-width="160px" :model="user" ref="user">

          <el-form-item label="登录名" prop="username" style="height: 40px" required>
            <el-input type="text" v-model="user.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="nickname" style="height: 40px" required>
            <el-input v-model="user.nickname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="showPassEdit" :label="this.passwordText" style="height: 40px" prop="password" required>
            <el-input type="password" v-model="user.password" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role" style="height: 40px" required>
            <role-select :value.sync="user.role"/>
          </el-form-item>
          <el-form-item label="用户状态" style="height: 40px" prop="state" required>
            <el-switch
            v-model="user.state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value=1
            :inactive-value=0
            active-text="正常"
            inactive-text="锁定">
          </el-switch>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit('user')">{{ this.buttonText}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import roleSelect from '../../components/role-select'
  import MD5 from 'md5'

  export default {
    name: 'user-editOrAdd',
    components: { roleSelect },
    data () {
      let validateUsername = (rule, value, callback) => { //用户名字段自定义验证规则
        if (value === undefined || value === "") {
          callback(new Error('请输入登录名'));
        } else if(! /^(?!\d+$)[\da-zA-Z]+$/.test(value)){
          callback(new Error('登录名必须为字母或字母数字组合'));
        }else{
          callback();
        }
      };
      let validateNickname = (rule, value, callback) => { //用户名字段自定义验证规则
        if (value === undefined || value === "" || value === null) { //
          callback("请输入用户名");
        // }if(! /^(?:[1-9]?\d|100)$/.test(value)){
        //   callback(new Error('年龄必须0-100的整数'));
        }else{
          callback();
        }
      };
      let validatePassword = (rule, value, callback) => { //密码字段自定义验证规则
        if (value === undefined || value === "") {
          callback(new Error('请输入密码'));
        }else if(value.length < 6 ){
          callback(new Error('密码长度至少6位'));
        } if(! /^[\w_-]{6,}$/.test(value)){
          callback(new Error('密码只能是字母数字组成'));
        }else{
          callback();
        }
      };
      return {
        labelPosition: 'right',
        buttonText:'',
        passwordText:'',
        execURL:'',
        showPassEdit: false,
        user: {},
        rules: {
          username: [
            {type: 'string', validator: validateUsername}
          ],
          nickname: [
            {type: 'string',validator: validateNickname}
          ],
          password:[
            {type: 'string',validator:validatePassword}
          ],
          role: [
            {type: 'number', required: true, message: '请选择用户角色'}
          ]
        }
      }
    },
    watch: {
      // 如果 `user` 发生改变，这个函数就会运行
      user : function (newUser,oldUser) {
        if(newUser.password != oldUser.password){ //如何密码发生变化

        }
      }
    },
    created () {
      if(this.$route.params.id != 0){ //编辑
        this.showPassEdit = false //隐藏密码框
        this.passwordText = "Reset password"
        this.execURL = 'user/updateUser'
        this.buttonText = '更新'
        this.getUserById()
      }else{ //添加
        this.showPassEdit = true //显示密码框
        this.passwordText = "密码"
        this.execURL = 'user/addUser'
        this.buttonText = '添加'
        this.user={state:1};
      }

    },
    methods: {
      getUserById () {
        this.$http.get('user/getUserInfoById/' + this.$route.params.id).then(res => {
          this.user = JSON.parse(JSON.stringify(res.data))
        })
      },
      returnPage () {
        this.$router.back()
      },
      onSubmit (user) {
        this.$refs[user].validate((valid) => { //表单验证
          if(valid){
            let { username, password, nickname, role,state } = this.user
            let obj = {
              id: this.$route.params.id,
              password: password?MD5(password):null,
              username: username,
              nickname: nickname,
              role: role,
              state: state
            }
            this.$http.post(this.execURL, obj).then(res => {
              if (res.code === 10004 || res.code === 10005) {//成功
                this.$message.success(res.msg)
                this.returnPage();
              } else {
                this.$message.error(res.msg)
              }
            })
          }else{
            console.log("submit error!")
            return false
          }

        })
      },
      onCancel () {
        this.user = {}
      }
    }

  }
</script>

<style scoped>

</style>
