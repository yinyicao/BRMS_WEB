<template>
  <div>
    <el-row >
      <el-col :span="24">
        <el-form :label-position="labelPosition" :model="formLabelAlign" >
          <el-form-item label="角色名称" >
            <el-select v-model="roleForm.roleName"
                       style="width: 15%"
                       filterable
                       allow-create
                       default-first-option
                       placeholder="选择或新增角色"
                        @change="roleChangeEvent">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
                :disabled="item.disabled">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色描述">
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
          <el-form-item label="角色权限">
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
                @change="handleChange"
                :data="data"
                ref="myTransfer"
              >
              </el-transfer>
          </el-form-item>
          <el-form-item>
            <div style="text-align: center;width: 50%">
            <el-button size="medium" type="primary" @click="onSubmit">确 认</el-button>
            <el-button style="margin-left: 5%" size="medium" @click="onReset">重 置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import roleSelect from "../../components/role-select";

  export default {
    name: 'role-setting',
    components: { roleSelect },
    data () {
      return {
        roleList: [], //角色列表
        roleName: '',
        data: [], //transfer穿梭框数据源
        roleForm: {},
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶',
          disabled: true
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        labelPosition: 'left',
        formLabelAlign: {
          name: '',
          description: '',
        }
      }
    },
    created() {
      this.getAllPermission();
      this.getRoleList()
    },
    methods: {

      //角色选择
      roleChangeEvent(value){
        //从后台获取数据
        // this.$http.get('role/getRoleByRoleName/' + value).then(res => {
        //   if(res.data != [] && res.data != null){
        //         // this.roleForm = null;
        //   }
        //   // this.user = JSON.parse(JSON.stringify(res.data))
        // })
        this.roleForm={
          roleName:'admin',
          roleDesc:'管理员描述',
          existingPermissions:[1,3,5,9]
        }
      },
      //获取role list
      getRoleList () {
        // 向后端获取列表
        // this.$http.get('getRoleList').then(res => {
        //   if (res.code === 0) {
        //     this.list = res.data
        //   }
        // })
        this.roleList = [{
          id:1,
          value:'admin',
          disabled:false
        },{
          id:2,
          value:'user',
          disabled:false
        }]
      },

      renderFunc(h, option) {//自定义的数据项的渲染函数，此处为JSX 语法
        return h('span', `${option.key} - ${option.label} `)
      },
      handleChange(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys);
        console.log(value)
      },
      onSubmit () {
        console.log(this.formLabelAlign)
        console.log('submit!')
        this.$http.post('/addProject', this.formLabelAlign).then(res => {
          console.log(res)
          if (res.code === 0) {
            console.log('success')
            this.$message.success('Add success !')
            this.formLabelAlign = {}
          } else {
            this.$message.error(res.sqlMessage)
          }
        })
      },
      getAllPermission(){
        this.$http.get('permission/getAllPermission').then(res => {
          if(res != null && res.code == 10002){ //遍历
            let list = res.data.map(item => {
                  //这里可以使用props 属性为 key 和 label 设置别名
                  // :props="{key: 'id',label: 'name',disabled: 'available'
                 return {key:item.id,label:item.name,disabled:item.available === 0}
            })
            this.data = list;
          }else{
              this.$message.error("请求出错，请联系管理员！");
          }
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
