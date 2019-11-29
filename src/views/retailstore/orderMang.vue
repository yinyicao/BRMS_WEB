<template>
  <div>
    <el-row>
      <el-button
        type="info"
        icon="el-icon-refresh-left"
        size="small"
        @click="refreshTable">
        刷新
      </el-button>
    </el-row>
    <el-row>
      <el-table
        :data="orderList"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="书名"
          width="140px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="disName"
          label="分销商"
          width="170px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderTotalPrice"
          label="订单总额（元）"
          width="120px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          label="订单状态"
          width="100px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderDate"
          label="下单时间"
          width="180px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orderEndDate"
          label="结束时间"
          width="180px"
          align="center"
          v-if="orderEndDateIsShow">
        </el-table-column>

        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="small">
            </el-button>
            <el-button
              @click.native.prevent="delRow(scope.row)"
              type="danger"
              icon="el-icon-delete"
              size="small">
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-size="page.pageSize"
        :total="page.total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
    export default {
      name: "orderMang",
      data(){
        return{
          orderList:[],
          page: {
            currentPage: 1,
            pageSize: 9,
            total: 0
          },
        }
      },
      created() {
        this.getOrderList();
      },
      methods:{
        refreshTable(){
          this.getOrderList();
        },
        getOrderList(){
          let obj = this.page;
          this.orderEndDateIsShow = false;//初始化

          // 请求数据
          this.$http.post('getOrderList',obj).then(res => {
            let list = res.data.result.map(item => {
              //格式化时间
              item.orderDate = this.$timeFormat(new Date(item.orderDate))
              if(null != item.orderEndDate){ // 页面上v-if处理，如果为空，直接不显示
                item.orderEndDate = this.$timeFormat(new Date(item.orderEndDate))
                this.orderEndDateIsShow = true
              }
              return item
            })
            this.page.total = res.data.total
            this.orderList = list
          })
        },
        editRow(item){
          this.$confirm('此操作将修改该条订单状态为【已完成】', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let obj = {}
            obj.id = item.id
            this.$http.post('modifyOrderStatus', obj).then(res => {
              if (res.code === 10008) {
                this.getOrderList();
                this.$message({
                  type: 'success',
                  message: res.msg
                });
              }else{
                this.$message({
                  type: 'info',
                  message: res.msg
                });
              }

            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        },
        delRow(item){
          this.$confirm('此操作将取消该条订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let obj = {}
            obj.id = item.id
            this.$http.post('cancelOrder', obj).then(res => {
              if (res.code === 10009) {
                this.getOrderList();
                this.$message({
                  type: 'success',
                  message: res.msg
                });
              }else{
                this.$message({
                  type: 'info',
                  message: res.msg
                });
              }

            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        },
        //分页查询
        handleCurrentChange(val){
          this.page.currentPage = val
          this.getOrderList()
        },
      }

    }
</script>

<style scoped>

</style>
