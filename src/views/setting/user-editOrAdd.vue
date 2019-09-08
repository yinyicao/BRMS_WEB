<template>
  <div>
    <el-button icon="el-icon-back" type="primary" class="m-b-20" @click.native.prevent="returnPage">Return</el-button>
    <el-row>
      <el-col :span="12">
        <el-form :label-position="labelPosition" :rules="rules" label-width="160px" :model="user" ref="user">
          <el-form-item label="Role" prop="role" style="height: 40px" required>
            <role-select :value.sync="user.role"/>
          </el-form-item>
          <el-form-item label="Username" prop="username" style="height: 40px" required>
            <el-input type="text" v-model="user.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Age" style="height: 40px" prop="age">
            <el-input type="number" v-model="user.age" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="showPassEdit" :label="this.passwordText" style="height: 40px" prop="password" required>
            <el-input type="password" v-model="user.password" autocomplete="off" ></el-input>
          </el-form-item>
          <el-form-item label="Nick Name" style="height: 40px">
            <el-input v-model="user.nickname" autocomplete="off"></el-input>
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
          callback(new Error('请输入作者'));
        } else if(! /^(?!\d+$)[\da-zA-Z]+$/.test(value)){
          callback(new Error('用户名必须为字母或数字组合'));
        }else{
          callback();
        }
      };
      let validateAge = (rule, value, callback) => { //年龄字段自定义验证规则
        if (value === undefined || value === "" || value === null) { //允许年龄为空
          callback();
        }if(! /^(?:[1-9]?\d|100)$/.test(value)){
          callback(new Error('年龄必须0-100的整数'));
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
          role: [
            {type: 'string', required: true, message: '请选择用户角色'}
          ],
          username: [
            {type: 'string', validator: validateUsername}
          ],
          age: [
            {validator: validateAge}
          ],
          password:[
            {validator:validatePassword}
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
        this.execURL = 'main/updateUserInfo'
        this.buttonText = '更新'
        this.getUserById()
      }else{ //添加
        this.showPassEdit = true //显示密码框
        this.passwordText = "Password"
        this.execURL = 'main/addUserInfo'
        this.buttonText = '添加'
        this.user={};
      }

    },
    methods: {
      getUserById () {
        this.$http.post('main/getUserInfo/' + this.$route.params.id).then(res => {
          this.user = JSON.parse(JSON.stringify(res.data))
        })
      },
      returnPage () {
        this.$router.back()
      },
      onSubmit (user) {
        this.$refs[user].validate((valid) => { //表单验证
          if(valid){
            let { username, password, nickname, role,age } = this.user
            let obj = {
              id: this.$route.params.id,
              password: password?MD5(password):null,
              username: username,
              nickname: nickname,
              role: role,
              age: age
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
