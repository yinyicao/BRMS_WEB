<template>
  <div
    v-loading.fullscreen.lock="fullscreenLoading"
    :element-loading-text="this.fullscreenLoadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <el-row>
      <el-button
        type="info"
        icon="el-icon-refresh-left"
        size="small"
        @click="refreshTable">
        刷新
      </el-button>
      <el-button
        type="primary"
        icon="el-icon-circle-plus"
        size="small"
        @click="addRow">
        添加图书
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

      <el-upload
        class="upload-demo"
        action="/wm/upload/"
        :on-change="readExcel"
        :show-file-list="false"
        :auto-upload="false"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        style="float: right">
        <el-button size="small">导入数据<i class="el-icon-upload2 el-icon--right"></i></el-button>
      </el-upload>

        <download-excel
          class = "export-excel-wrapper"
          :fetch   = "fetchData"
          :before-generate = "startDownload"
          :before-finish = "finishDownload"
          :data = "this.outputData.json_data"
          :fields = "this.outputData.json_fields"
          name = "图书列表信息.xls"
          style="float: right">
          <el-button
            size="small"
            >
            导出数据
            <i class="el-icon-download el-icon--right"></i>
          </el-button>
        </download-excel>
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
          width="70px"
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
            @click.native.prevent="editRow(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="small">
            编辑
          </el-button>
            <el-button
              @click.native.prevent="delRow(scope.row)"
              type="danger"
              icon="el-icon-delete"
              size="small">
              删除
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

    <el-dialog :title="dialogStatus" :visible.sync="dialogFormVisible"
                width="40%" >
      <el-form :model="dialogForm" :rules="rules"  ref="dialogForm">
        <el-form-item label="书名" :label-width="formLabelWidth"  prop="bookName" style="height: 44px; width: 400px">
          <el-input v-model="dialogForm.bookName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别" :label-width="formLabelWidth"  prop="bookCategory" style="height: 44px;">
<!--          <el-input v-model="dialogForm.bookCategory" autocomplete="off"></el-input>-->
          <el-select v-model="dialogForm.bookCategory" placeholder="请选择"
                     size="small"
                     style="width: 290px"
                     :filterable= "true"
                     :clearable = "true"
                     v-on:visible-change="querySelectBookCategory"
                     :loading="bookCategorySelectLoading"
                     loading-text="加载中..."
             >
            <el-option
              v-for="item in bookCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格" :label-width="formLabelWidth"  prop="bookPrice" style="height: 44px;width: 400px" required>
          <el-input type="number" v-model="dialogForm.bookPrice" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth"  prop="bookAuthor" style="height: 44px;width: 400px" required>
          <el-input v-model="dialogForm.bookAuthor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版社" :label-width="formLabelWidth"  prop="bookPub" style="height: 44px;width: 400px">
<!--          <el-input v-model="dialogForm.bookPub" autocomplete="off"></el-input>-->
          <el-select v-model="dialogForm.bookPub" placeholder="请选择"
                     :filterable= "true"
                     :clearable = "true"
                     size="small"
                     style="width: 290px"
                     v-on:visible-change="querySelectBookPub"
                     :loading="bookPubSelectLoading"
                     loading-text="加载中..."
            >
            <el-option
              v-for="item in bookPubOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存" :label-width="formLabelWidth"  prop="bookRepertorySize" style="height: 44px;width: 400px" >
<!--          <el-input type="number" v-model="dialogForm.bookRepertorySize" autocomplete="off"></el-input>-->
          <el-input-number v-model="dialogForm.bookRepertorySize"
                           :min="1"
                           :max="1000"
                           size="small"
                           controls-position="right"
                           style="width: 290px"
                           ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit('dialogForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>


</template>

<script>
  import ProjectSelect from '../components/role-select'
  import UserlistSelect from '../components/userlist-select'
  import XLSX from 'xlsx'
  import Utils from '../utils/ev-utils'

  export default {
    name: 'bookList',
    components: {ProjectSelect, UserlistSelect},
    data() {
      let validateAuthor = (rule, value, callback) => { //作者字段自定义验证规则
        if (value === undefined || value === "") {
          callback(new Error('请输入作者'));
        } else if(! /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(value)){
          callback(new Error('名字必须为2-20个汉字'));
        }else{
          callback();
        }
      };
      let validateprice = (rule, value, callback) => { //价格字段自定义验证规则
        if (value === undefined || value === "") {
          callback(new Error('请输入价格'));
        } else if(! /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(value)){
          callback(new Error('价格必须为大于0的数字（两位小数）'));
        }else{
          callback();
        }
      };
      return {
        searchForm:{},
        bookCategoryOptions: [],
        bookPubOptions: [],
        fullscreenLoading: false,
        fullscreenLoadingText: '正在加载导出数据...',
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
        bookCategorySelectLoading:false,
        bookPubSelectLoading:false,
        dialogFormVisible: false,
        formLabelWidth: '110px',
        dialogStatus: "",
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
          bookName: [
            {type: 'string', required: true, message: '请输入书名'}
          ],
          bookCategory: [
            // {type: 'string', required: true, message: '请输入类别', trigger: 'change'}
            {type: 'number', required: true, message: '请输入类别'}
          ],
          bookPrice: [
            // {required: true, message: '请输入价格', trigger: 'blur'}
            // {type: 'string', required: true, message: '请输入价格'}
            { validator: validateprice,type: 'string'}
          ],
          bookAuthor: [
            { validator: validateAuthor,type: 'string'}
          ],
          bookRepertorySize: [
            {required: true, message: '请输入库存'}
          ],
          bookPub: [
            {type: 'number', required: true, message: '请输入出版社'}
          ]
        }
      }
    },
    created() {
      this.getBookList()
    },
    methods: {
      querySelectBookPub(isCollapse){
        if (isCollapse && this.bookPubOptions.length <=1){
          this.bookPubOptions = []//清空，否者有数据不加载
          this.bookPubSelectLoading = true;
          this.$http.get('getPublisherServiceSelectValueAndLabel').then(res => {
            this.bookPubOptions = res.data
          }).finally(()=>{
            this.bookPubSelectLoading = false;
          })
        } else{
          this.bookPubSelectLoading = false;
        }
      },
      querySelectBookCategory(isCollapse){
        if (isCollapse && this.bookCategoryOptions.length <=1){
          this.bookCategoryOptions = []//清空，否者有数据不加载
          this.bookCategorySelectLoading = true;
          this.$http.get('getBookCategoryMetaValueAndLabel').then(res => {
            this.bookCategoryOptions = res.data
          }).finally(()=>{
            this.bookCategorySelectLoading = false;
          })
        } else{
          this.bookCategorySelectLoading = false;
        }
      },
      async fetchData() {
        let obj = {
          currentPage: 0,
          pageSize: 0,
        }
        await this.$http.post('getBookList', obj).then(res => {
          let list = res.data.result.map(item => {
            return item
          })


          this.outputData.json_data = list
        }).catch((error) => {
          // setTimeout(() => {
          this.fullscreenLoading = false;
          this.$message.error('数据加载错误，请检查网络连接！');
          // }, 10000);
        })
        return this.outputData.json_data
      },
      searchData(){
          if(!(this.searchForm.item == undefined)){
            this.getBookList();
          }else{
            this.$message.warning("请输入内容再搜索")
          }

      },
      startDownload() {
        this.fullscreenLoading = true;

      },
      finishDownload() {
        setTimeout(() => { //简单的设置一下，显示加载页面，不然岂不是白写了？哈哈哈
          this.fullscreenLoading = false;
        }, 1000)

      },
      readExcel(file) { //导入数据并解析
        let _this = this;
        const fileReader = new FileReader();
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result;
            const workbook = XLSX.read(data, {
              type: 'binary'
            });
            for (let sheet in workbook.Sheets) {
              const sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
              _this.dealFile(sheetArray); //处理数据
            }
          } catch (e) {
            console.error(e)
            this.$message.warning('文件类型不正确！');
            return false;
          }
        }
        fileReader.readAsBinaryString(file.raw);
        },
      dealFile: function(data){ //处理数据
        if(data.length === 0){
          this.$message.warning('文件格式出错！');
          return false;
        }
        // 验证表头
        let json = data[0] //取第一条数据
        for (let key in json) //遍历第一条数据的key，验证是否有对应的key值，否则失败
        {
          if(false == (key == '书名' || key == '类别'||key == '作者' ||key == '价格' ||key == '库存' ||key == '出版社')){
              this.$message.warning('文件解析出错！');
              return false;
          }
        }

        let datas = {}
        datas.bookList = [];
        for (let i = 0; i < data.length ; i++) {
          let obj = {}
          obj.bookName = data[i].书名
          obj.bookCategory = data[i].类别
          obj.bookAuthor = data[i].作者
          obj.bookPrice = data[i].价格
          obj.bookRepertorySize = data[i].库存
          obj.bookPub = data[i].出版社
          datas.bookList.push(JSON.stringify(obj))
        }
        this.$http.post('importBookListData', datas).then(res => {
            if(res.code === 10006){
              this.$message.success("解析到 "+datas.bookList.length+" 条数据，导入成功 "+res.data+" 条数据！");
              this.getBookList();//刷新数据
            }else{
              this.$message.error(res.msg)
            }
        })

      },
      refreshTable(){
          this.searchForm = {};
          this.getBookList();
        },
      onSubmit(dialogForm){
          this.$refs[dialogForm].validate((valid) => { //表单验证
            if (valid) {
              if (this.dialogStatus === '添加') {//表单状态是添加
                this.$http.post('addBook', this.dialogForm).then(res => {
                  if (res.code === 10005) {
                    this.dialogFormVisible = false, this.getBookList();
                    this.$message.success(res.msg)
                  }else{
                    this.$message.error(res.msg)
                  }

                })
              } else {//编辑
                this.$http.post('modifyBook', this.dialogForm).then(res => {
                  if (res.code === 10004) {
                    this.dialogFormVisible = false,
                      this.getBookList();
                    this.$message.success(res.msg)
                  }else{
                    this.$message.error(res.msg)
                  }
                })
              }
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
      addRow(){
          this.dialogFormVisible = true;
          this.dialogStatus = '添加';
          this.dialogForm = {};//清空表单
          // this.dialogForm.bookRepertorySize = 10;

        },
      editRow(item){
          // 初始化表单数据
          this.dialogForm = item;
          // this.dialogForm.bookPub = item.pubName;
          // // this.$delete(this.dialogForm,'pubName');
          // // delete this.dialogForm.pubName;
          //初始化Select控件的Options数组，否者初次显示不正常
        if(this.bookCategoryOptions.length === 0 && this.bookPubOptions.length === 0){
          let bco = {},bpo = {}
          bco.value = item.bookCategory
          bco.label = item.categoryName
          bpo.value = item.bookPub
          bpo.label = item.pubName
          this.bookCategoryOptions.push(bco)
          this.bookPubOptions.push(bpo)
        }
          //显示表单
          this.dialogFormVisible = true;
          this.dialogStatus = '编辑';

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
      //分页查询
      handleCurrentChange(val){
          this.page.currentPage = val
          this.getBookList()
      },
      getBookList(){
          let obj = {
            searchItem: this.searchForm.item,
            searchValue: this.searchForm.value,
            currentPage: this.page.currentPage,
            pageSize: this.page.pageSize,
          }
          this.$http.post('book/getBookList', obj).then(res => {
            let list = res.data.result.map(item => {
              return item
            })
            this.page.total = res.data.total
            this.bookList = list
          })
        }
      }
  }
</script>

<style scoped>
</style>
