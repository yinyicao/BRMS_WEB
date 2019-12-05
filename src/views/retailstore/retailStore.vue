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
      <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" style="width: 350px;" :clearable="true">
        <el-select v-model="searchForm.item" slot="prepend" placeholder="请选择" style="width: 100px;height:20px;border-color: #409EFF;" :clearable="true" >
          <el-option label="书名" value="book_name"></el-option>
          <el-option label="类别" value="book_category"></el-option>
          <el-option label="作者" value="book_author"></el-option>
          <el-option label="出版社" value="book_pub"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
      </el-input>
    </el-row>
    <el-row>
      <el-table
        :data="bookList"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="书名"
          width="150px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="类别"
          width="100px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bookPrice"
          label="价格"
          width="100px"
          align="center">
        </el-table-column>

        <el-table-column
          prop="bookAuthor"
          label="作者"
          width="80px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bookRepertorySize"
          label="库存"
          width="100px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="pubName"
          label="出版社"
          align="center">
        </el-table-column>

        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="soldRow(scope.row)"
              type="primary"
              icon="el-icon-circle-plus"
              size="small">
              分销
            </el-button>
<!--            <el-button-->
<!--              @click.native.prevent="delRow(scope.row)"-->
<!--              type="danger"-->
<!--              icon="el-icon-delete"-->
<!--              size="small">-->
<!--              删除-->
<!--            </el-button>-->

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
    <el-dialog  title="分销下单" :visible.sync="dialogFormVisible"
               width="40%" >
      <el-form :model="dialogForm" :rules="rules"  ref="dialogForm">
        <el-form-item label="书名" :label-width="formLabelWidth"  prop="bookName" style="height: 44px; width: 400px">
          <el-input v-model="dialogForm.bookName" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth"  prop="bookAuthor" style="height: 44px;width: 400px">
          <el-input v-model="dialogForm.bookAuthor" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="单价" :label-width="formLabelWidth"  prop="bookPrice" style="height: 44px;width: 400px">
          <el-input type="number" v-model="dialogForm.bookPrice" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="分销商" :label-width="formLabelWidth"  prop="disNo" style="height: 44px;" required>
          <!--          <el-input v-model="dialogForm.bookCategory" autocomplete="off"></el-input>-->
          <el-select v-model="dialogForm.disNo" placeholder="请选择"
                     size="small"
                     style="width: 290px"
                     :filterable= "true"
                     v-on:visible-change="querySelectDis"
                     :clearable = "true"
                     :loading="disSelectLoading"
                     loading-text="加载中..."
            >
            <el-option
              v-for="item in distributorsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="本数" :label-width="formLabelWidth"  prop="orderNumber" style="height: 44px;width: 400px" >
          <el-input-number v-model="dialogForm.orderNumber" :min="1" :max="dialogForm.bookRepertorySize" :step="1" :controls="false" style="width: 100px"></el-input-number>
          <label>&nbsp;当前库存：&nbsp;{{this.dialogForm.bookRepertorySize}}</label>
        </el-form-item>
<!--        <el-form-item label="订单总额" :label-width="formLabelWidth"  prop="totalPrice" style="height: 44px;width: 400px" >-->
<!--          <label v-model="this.dialogForm.orderNumber * this.dialogForm.bookPrice"></label>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "retailStore",
      data(){
        return{
          searchForm:{},
          outputData: {
            json_fields: {
              "书名": "bookName",    //常规字段
              "类别": "bookCategory",
              "作者": "bookAuthor",
              "价格": "bookPrice",
              "库存": "bookRepertorySize",
              "出版社": "bookPub",
            },
            json_data: []
          },
          disSelectLoading:false,
          distributorsOptions:[],
          dialogFormVisible: false,
          formLabelWidth: '110px',
          list: [],
          dialogForm: {},
          labelPosition: 'right',
          bookList: [],
          page: {
            currentPage: 1,
            pageSize: 9,
            total: 0
          },
          rules: {
            disNo: [
              {type: 'number', required: true, message: '请选择分销商'}
            ]
          }
        }
      },
      created() {
        this.getBookList()
      },
      methods:{
        refreshTable(){
          this.searchForm = {};
          this.getBookList();
        },
        handleCurrentChange(val){
          this.page.currentPage = val
          this.getBookList()
        },
        searchData(){
          if(!(this.searchForm.item == undefined)){
            this.getBookList();
          }else{
            this.$message.warning("请输入内容再搜索")
          }
        },
        onSubmit(dialogForm){
          this.$refs[dialogForm].validate((valid) => { //表单验证
            if (valid) {
                this.$http.post('addOrder', this.dialogForm).then(res => {
                  if (res.code === 10007) {
                    this.dialogFormVisible = false, this.getBookList();
                    this.$message.success(res.msg)
                  }else{
                    this.$message.error(res.msg)
                  }

                })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        soldRow(item){
          this.dialogFormVisible = true;
          this.dialogForm = item;
          this.dialogForm.orderNumber = 1;
        },
        delRow(item){
          this.$confirm('此操作将永久删除该条图书信息, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let obj = {}
            obj.id = item.id
            this.$http.post('removeBook', obj).then(res => {
              if (res.code === 10003) {
                this.getBookList();
              }
              this.$message({
                type: 'success',
                message: res.msg
              });
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        getBookList(){
          let obj = {
            searchItem: this.searchForm.item,
            searchValue: this.searchForm.value,
            currentPage: this.page.currentPage,
            pageSize: this.page.pageSize,
          }
          this.$http.post('getBookList', obj).then(res => {
            let list = res.data.result.map(item => {
              return item
            })
            this.page.total = res.data.total
            this.bookList = list
          })
        },
        querySelectDis(isCollapse){
          // console.log(isCollapse)
          if (isCollapse && ! this.distributorsOptions.length){
            this.disSelectLoading = true;
            this.$http.get('getDistributorSelectValueAndLabel').then(res => {
              this.distributorsOptions = res.data
            }).finally(()=>{
              this.disSelectLoading = false;
            })
          } else{
            this.disSelectLoading = false;
          }
        }
      }
    }
</script>

<style scoped>

</style>
