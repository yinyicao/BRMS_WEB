<template>
  <div>
    <el-button type="primary" class="m-b-20" icon="el-icon-circle-plus-outline" @click.native="toAddUser">
      添加
    </el-button>
    <el-row>
      <el-col :span="20">
        <el-table
          :data="userList"
          style="width: 100%" border>
          <el-table-column
            type="index">
          </el-table-column>

          <el-table-column
            prop="userName"
            label="登录名">
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="用户名">
          </el-table-column>

          <el-table-column
            prop="role"
            label="角色">
          </el-table-column>
          <el-table-column
            prop="state"
            label="用户状态">
            <template slot-scope="scope">
              <i :class="addclassStatus(scope.row.state)"></i>
              {{scope.row.state | formatSatate}}
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click.native.prevent="toEditUser(scope.row)">编辑</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.row)"
                type="danger"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'user-setting',
    data() {
      return {
        userList: []
      }
    },
    created() {
      this.getUserList()
    },
    filters:{
      formatSatate(val){
        switch (val) {
          case 0 :return '锁定';
          case 1 :return '正常';
          default:return val;
        }
      }
    },
    methods: {
      addclassStatus(i){
        switch (i) {
          case 1: return 'el-icon-success green';
          case 0: return 'el-icon-error red';
        }
      },

      //删除某一行
      deleteRow(item) {

        console.log(item)
        this.$confirm('确认删除用户名为【'+item.nickName+'】的账户信息吗？')
          .then(() => {
            let obj = {id: item.id};
            this.$http.post('user/deleteUser', obj).then(res => {
              if (res.code === 10003) {
                this.$message.success(res.msg);
                this.getUserList();
              } else {
                this.$message.error(res.msg)
              }
            })
          })
          .catch(_ => {
          });


      },
      getUserList() {
        this.$http.get('user/getUserList').then(res => {
          this.userList = res.data
        })
      },
      toAddUser() {
        this.$router.push({
          name: 'user-editOrAdd',
          params : {id:0}
        })
      },
      toEditUser(item) {
        this.$router.push({name: 'user-editOrAdd', params: {id: item.id}})
      },
    }
  }
</script>

<style scoped>
  .green{
    color: #67C23A;
  }
  .red{
    color:#F56C6C;
  }
</style>
