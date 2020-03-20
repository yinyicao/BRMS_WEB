<template>
  <div
    v-loading.fullscreen.lock="loading"
    fullscreen
    element-loading-text="正在加载初始数据..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-row>
      <el-col :span="24">
        <el-form :label-position="labelPosition" :rules="rules" :model="roleForm" ref="roleForm" inline-message>
          <el-form-item label="角色名称" prop="roleName" required>
            <el-select v-model="roleForm.roleName"
                       style="width: 15%"
                       filterable
                       allow-create
                       default-first-option
                       placeholder="选择或新增角色"
                        @change="roleChangeEvent"
                       @visible-change="handleRoleSelectVisible"
                       :loading="this.selectLoading"
                        >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc" required>
            <el-input
              type="text"
              placeholder="请输入角色描述"
              v-model="roleForm.roleDesc"
              style="width: 40%"
              maxlength="20"
              show-word-limit
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="角色权限" style="margin-left: 10px">
              <el-transfer
                style="width: 80%;text-align: left; display: inline-block;"
                v-model="roleForm.existingPermissions"
                filterable
                :left-default-checked="[]"
                :right-default-checked="[]"
                :render-content="renderFunc"
                :titles="['未授权', '已授权']"
                :button-texts="['删除', '添加']"
                :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
                :data="data"
                ref="myTransfer"
              >
              </el-transfer>
          </el-form-item>
          <el-form-item>
            <div style="text-align: center;width: 50%">
            <el-button size="medium" type="primary" @click="onSubmit" :loading="submitBtnLoading">{{submitBtnText}}</el-button>
            <el-button style="margin-left: 5%" size="medium" @click="onReset">重 置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>

  export default {
    name: 'role-setting',
    data () {
      let validateRoleName = (rule, value, callback) => { //角色名字段自定义验证规则
        if (value === undefined || value === "") {
          callback(new Error('请输入/选择角色'));
        // } else if(value.contains('admin')){
        //   callback(new Error('您输入的角色包含非法字段'));
        }else if(! /^(?!\d+$)[\da-zA-Z]+$/.test(value)){
          callback(new Error('角色名必须为字母或字母数字组合'));
        }else{
          callback();
        }
      };
      return {
        selectLoading: true,
        submitBtnText: '确 认',
        submitBtnLoading: false,
        loading: true,
        roleList: [], //角色列表
        data: [], //transfer穿梭框数据源
        roleForm: {},
        labelPosition: 'left',
        rules: {
          roleName: [
            {type: 'string',required: true, validator: validateRoleName}
          ],
          roleDesc: [
            {type: 'string',required:true,message: '请输入角色描述'}
          ]
        }
      }
    },
    created() {
      //初始化权限数据
      this.getAllPermission()
    },
    methods: {

      /**
       * 角色选择下拉框加载数据
       */
      handleRoleSelectVisible(value){
        this.selectLoading = true;
        if (value){//显示下拉框
          // 向后端获取角色列表
          this.$http.get('role/getRoleList').then(res => {
            if ((res.code+'').startsWith('1000')) {//成功
              let list = res.data.map(item => {
                return {id: item.id, value: item.role,desc:item.description,disabled: item.available === 0}
              })
              this.roleList = list;
            } else {
              this.$message.error('加载数据失败，请重试！')
            }
          }).finally(()=>{
            this.selectLoading = false;
          })
        }
      },

      /**
       * 角色选择下拉框Change事件监听
       * @param value 回调值：选中项的ID
       */
      roleChangeEvent(value){ //也可以通过数组对象的查找来判断当前角色是否已经存在
        if (isNaN(value)){//非数字   !/\d+$/.test(value) ，是添加、不从后台获取
          this.submitBtnText='添 加';
          this.roleForm={//重置表单
            roleName:value,
            roleDesc:'',
            existingPermissions:[]
          }
        }else{ //是数字，说明是进行下拉选择的，表示修改，需要从后台查找已有信息
          this.submitBtnText='更 新';
          this.loading = true;
          //请求获取对应角色ID的所有权限ID
          this.$http.get('permission/getPermissionsByRoleId/' + value).then(res => {
            if ((res.code+'').startsWith('1000')) {//成功
              let ep = res.data;
              // 遍历之前返回的角色列表，查找我们想要的值
              let role = this.roleList.find((role)=>{
                if(role.id === value) return role;
              })

              //给表单赋值
              this.roleForm={
                roleName:role.value,
                roleDesc:role.desc,
                existingPermissions:ep
              }

            }else{
              this.$message.error("数据加载错误，请重新加载!")
            }
          }).finally(()=>{
            //取消数据加载
            const _this = this;
            setTimeout(function(){
              _this.loading = false
            },500)
          })

        }
      },

      renderFunc(h, option) {//自定义的数据项的渲染函数，此处为JSX 语法
        return h('span', `${option.key} - ${option.label} `)
      },
      doPostSubmit(){
        this.$http.post('/role/addOrUpdateRoleAndPermission', this.roleForm).then(res => {
          if ((res.code+'').startsWith('1000')) {//成功
            this.$message.success(res.msg)
            this.roleForm = {};
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      onSubmit(){

        if(this.roleForm != null){
          this.$refs['roleForm'].validate((valid)=>{ //验证表单
            if(valid){
              this.submitBtnLoading = true;
              this.submitBtnText = '   '
              //给用户一点提示
              if(this.roleForm.existingPermissions != null && this.roleForm.existingPermissions.length ==0){
                this.$confirm('该角色将没有任何权限，是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.doPostSubmit();
                }).catch(() => {
                  // this.$message.info("取消提交");
                }).finally(()=>{
                  this.submitBtnLoading = false;
                  this.submitBtnText = '确 认'
                });
              }else{
                this.$confirm('确认该角色权限信息?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.doPostSubmit();
                }).catch(() => {
                  // this.$message.info("取消提交");
                }).finally(()=>{
                  this.submitBtnLoading = false;
                  this.submitBtnText = '确 认'
                });
              }
            }else{
              this.$message.error("请完善信息！")
              console.log("submit error!")
              return false
            }
          })
        }else{//
          console.log("submit error!")
        }

      },
      getAllPermission: function () {
        this.$http.get('permission/getAllPermission').then(res => {
          if (res != null && res.code == 10002) { //遍历
            let list = res.data.map(item => {
              //这里可以使用props 属性为 key 和 label 设置别名
              // :props="{key: 'id',label: 'name',disabled: 'available'
              return {key: item.id, label: item.name, disabled: item.available === 0}
            })
            this.data = list;
          } else {
            this.$message.error("请求出错，请联系管理员！");
          }
        }).finally(()=>{
          //取消数据加载
          const _this = this;
          setTimeout(function(){
            _this.loading = false
          },500)
        })
      },
      onReset(){
        // 清空表单
        this.roleForm = {}
        //清空左右两个搜索框 https://blog.csdn.net/wendy_monkey/article/details/89212524
        if(this.$refs.myTransfer){
          this.$refs.myTransfer.$children["0"]._data.query = '';
          // 清空右边搜索
          this.$refs.myTransfer.$children["3"]._data.query = '';
        }
      }
    }
  }
</script>

<style scoped>
</style>
