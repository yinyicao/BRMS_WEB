<template>
  <el-select v-model="roleName"
             filterable clearable placeholder="Role"
             @change="selectOption"
             @visible-change="handleRoleSelectVisible"
             :loading="this.selectLoading">
    <el-option
      v-for="item in list"
      :key="item.id"
      :label="item.value"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'role-select',
    data () {
      return {
        list: [],
        roleName: '',
        selectLoading : false,
      }
    },
    props: {
      value: null
    },
    watch: {
      value (newValue) {
        this.roleName = newValue
      }
    },
    created () {
      this.roleName = this.value
    },

    methods: {
      selectOption () {
        this.$emit('update:value', this.roleName)
        // this.$emit('change')
      },
      /**
       * 角色选择下拉框加载数据，下拉框出现/隐藏时触发，
       * @param value 出现则为 true，隐藏则为 false
       */
      handleRoleSelectVisible(value){
        this.selectLoading = true;
        if(value){
          // 向后端获取角色列表
          this.$http.get('role/getRoleList').then(res => {
            if ((res.code+'').startsWith('1000')) {//成功
              let list = res.data.map(item => {
                return {id: item.id, value: item.role,desc:item.description,disabled: item.available === 0}
              })
              this.list = list;
            } else {
              this.$message.error('加载数据失败，请重试！')
            }
          }).finally(()=>{
            this.selectLoading = false;
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>
