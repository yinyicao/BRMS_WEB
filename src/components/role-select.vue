<template>
  <el-select v-model="roleName" filterable clearable placeholder="Role" @change="selectOption">
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
        roleName: ''
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
      this.getList()
    },

    methods: {
      selectOption () {
        this.$emit('update:value', this.roleName)
        // this.$emit('change')
      },
      //获取role list
      getList () {
        // 向后端获取列表
        // this.$http.get('getRoleList').then(res => {
        //   if (res.code === 0) {
        //     this.list = res.data
        //   }
        // })
        this.list = [{
          id:1,
          value:'admin'
        },{
          id:2,
          value:'user'
        }]
      },
    }
  }
</script>

<style scoped>

</style>
