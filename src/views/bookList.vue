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
        v-if="this.$store.state.userinfo.permissions.includes('book:add')"
        type="primary"
        icon="el-icon-circle-plus"
        size="small"
        @click="addRow">
        添加图书
      </el-button>
      <el-button
        v-if="this.$store.state.userinfo.permissions.includes('book:add')"
        type="primary"
        icon="el-icon-circle-plus"
        size="small"
        @click="addRowByCamera">
        扫码添加
      </el-button>
      <el-input placeholder="请输入内容" v-model="searchForm.value" class="input-with-select" style="width: 350px;"
                :clearable="true">
        <el-select v-model="searchForm.item" slot="prepend" placeholder="请选择"
                   style="width: 100px;height:20px;border-color: #409EFF;" :clearable="true">
          <el-option label="书名" value="book_name"></el-option>
          <el-option label="类别" value="book_category"></el-option>
          <el-option label="作者" value="book_author"></el-option>
          <el-option label="出版社" value="book_pub"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
      </el-input>

      <!--------------------START-使用js-xlsx导入导出数据-START-------------------->
      <!--      <el-upload-->
      <!--        class="upload-demo"-->
      <!--        action="/wm/upload/"-->
      <!--        :on-change="readExcel"-->
      <!--        :show-file-list="false"-->
      <!--        :auto-upload="false"-->
      <!--        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"-->
      <!--        style="float: right">-->
      <!--        <el-button size="small">导入数据<i class="el-icon-upload2 el-icon&#45;&#45;right"></i></el-button>-->
      <!--      </el-upload>-->

      <!--        <download-excel-->
      <!--          class = "export-excel-wrapper"-->
      <!--          :fetch   = "fetchData"-->
      <!--          :before-generate = "startDownload"-->
      <!--          :before-finish = "finishDownload"-->
      <!--          :data = "this.outputData.json_data"-->
      <!--          :fields = "this.outputData.json_fields"-->
      <!--          name = "图书列表信息.xls"-->
      <!--          style="float: right">-->
      <!--        </download-excel>-->
      <!-----------------------END-使用js-xlsx导入导出数据-END-------------------->
      <el-button
        size="small"
        @click="exportExcel"
        style="float: right"
      >
        导出数据
        <i class="el-icon-download el-icon--right"></i>
      </el-button>

      <el-table
        :data="bookList"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="bookIsbn"
          label="ISBN"
          width="110px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="书名"
          width="200px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="类别"
          width="90px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bookPrice"
          label="价格"
          width="80px"
          align="center">
        </el-table-column>

        <el-table-column
          prop="bookAuthor"
          label="作者"
          width="90px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bookRepertorySize"
          label="库存"
          width="80px"
          align="center">
        </el-table-column>
        <el-table-column
          prop="pubName"
          label="出版社"
          align="center">
        </el-table-column>

        <el-table-column
          v-if="this.$store.state.userinfo.permissions.includes('book:modify')
            && this.$store.state.userinfo.permissions.includes('book:remove')"
          label="操作"
          align="center">
          <template
            slot-scope="scope">
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
        <el-form-item label="ISBN" :label-width="formLabelWidth"  prop="bookIsbn" style="height: 44px; width: 400px">
          <el-input v-model="dialogForm.bookIsbn" autocomplete="off"></el-input>
        </el-form-item>
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

    <el-dialog title="扫码添加" :visible.sync="dialogByCameraVisible"
               @close='closeDialogByCamera'
               width="40%" >
      <el-button
        type="primary"
        icon="el-icon-camera-solid"
        size="small"
        @click="startOrStopScan">
        {{startOrStopScanText}}
      </el-button>
      <video id="video" v-if="CameraVideoVisible" width="50%" height="10%" style="border: 1px solid gray"></video>
      <el-form :model="dialogFormByCameraVideo" :rules="rulesByCameraVideo"  ref="dialogFormByCameraVideo" v-if="dialogFormByCameraVisible">
        <el-form-item label="ISBN" :label-width="formLabelWidth"  prop="bookIsbn" style="height: 44px; width: 400px">
          <el-input v-model="dialogFormByCameraVideo.bookIsbn" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="书名" :label-width="formLabelWidth"  prop="bookName" style="height: 44px; width: 400px">
          <el-input v-model="dialogFormByCameraVideo.bookName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别" :label-width="formLabelWidth"  prop="bookCategory" style="height: 44px;width: 400px">
<!--          <el-input v-model="dialogFormByCameraVideo.bookCategory" autocomplete="off"></el-input>-->
          <el-select v-model="dialogFormByCameraVideo.bookCategory" placeholder="请选择"
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
          <el-input type="number" v-model="dialogFormByCameraVideo.bookPrice" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth"  prop="bookAuthor" style="height: 44px;width: 400px" required>
          <el-input v-model="dialogFormByCameraVideo.bookAuthor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="出版社" :label-width="formLabelWidth"  prop="bookPub" style="height: 44px;width: 400px">
          <el-input v-model="dialogFormByCameraVideo.bookPub" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="库存" :label-width="formLabelWidth"  prop="bookRepertorySize" style="height: 44px;width: 400px" >
          <!--          <el-input type="number" v-model="dialogForm.bookRepertorySize" autocomplete="off"></el-input>-->
          <el-input-number v-model="dialogFormByCameraVideo.bookRepertorySize"
                           :min="1"
                           :max="1000"
                           size="small"
                           controls-position="right"
                           style="width: 290px"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="dialogFormByCameraVisible">
        <el-button @click="dialogFormByCameraReset">重 置</el-button>
        <el-button @click="dialogByCameraVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitByCamera('dialogFormByCameraVideo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import ProjectSelect from '../components/role-select'
  import UserlistSelect from '../components/userlist-select'
  // import XLSX from 'xlsx'
  import Utils from '../utils/ev-utils'
  import axios from 'axios'
  import {BrowserMultiFormatReader} from "@zxing/library";
  import {showApiforMatterDateTime} from "../utils/tool"

  export default {
    name: 'bookList',
    components: {ProjectSelect, UserlistSelect},
    data() {
      let validateAuthor = (rule, value, callback) => { //作者字段自定义验证规则
        if (value === undefined || value === "") {
          callback(new Error('请输入作者,多个以空格分开'));
        } else if(! /^[\u4E00-\u9FA5\uf900-\ufa2d\u0020·s]{2,20}$/.test(value)){
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
      let validateIsbn = (rule, value, callback)=>{ //ISBN字段自定义规则
        if (value === undefined || value === "") {
          callback(new Error('请输入ISBN号'));
        } else if(! /(^\d{10}|\d{13})$/.test(value)){
          callback(new Error('请输入正确的ISBN（10/13位）'));
        }else{
          callback();
        }
      }
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
        dialogByCameraVisible: false,
        dialogFormByCameraVisible: false,
        CameraVideoVisible: false,
        startOrStopScanText: '开始扫描',
        firstDeviceId:'',
        formLabelWidth: '110px',
        dialogStatus: "",
        list: [],
        dialogForm: {},
        dialogFormByCameraVideo:{},
        labelPosition: 'right',
        bookList: [],
        page: {
          currentPage: 1,
          pageSize: 9,
          total: 0
        },
        rules: {
          bookIsbn:[
            {type: 'number', required: true,validator: validateIsbn}
          ],
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
        },
        rulesByCameraVideo: {
          bookIsbn:[
            {type: 'number', required: true,validator: validateIsbn}
          ],
          bookName: [
            {type: 'string', required: true, message: '请输入书名'}
          ],
          bookCategory: [
            // {type: 'string', required: true, message: '请输入类别', trigger: 'change'}
            {type: 'number', required: true, message: '请输入类别'}
          ],
          bookPrice: [
            // {required: true, message: '请输入价格', trigger: 'blur'}
            {type: 'string', required: true, message: '请输入价格'}
            // { validator: validateprice,type: 'string'}
          ],
          bookAuthor: [
            {type: 'string', required: true, message: '请输入作者'}
            // { validator: validateAuthor,type: 'string'}
          ],
          bookRepertorySize: [
            {required: true, message: '请输入库存'}
          ],
          bookPub: [
            {type: 'string', required: true, message: '请输入出版社'}
          ]
        }
      }
    },
    created() {
      this.getBookList()
    },
    mounted() {
      // this.getCompetence();

    },
    methods: {
      querySelectBookPub(isCollapse){
        if (isCollapse && this.bookPubOptions.length <=1){
          this.bookPubOptions = []//清空，否者有数据不加载
          this.bookPubSelectLoading = true;
          this.$http.get('publisher/getPublisherServiceSelectValueAndLabel').then(res => {
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
          this.$http.get('book/getBookCategoryMetaValueAndLabel').then(res => {
            this.bookCategoryOptions = res.data
          }).finally(()=>{
            this.bookCategorySelectLoading = false;
          })
        } else{
          this.bookCategorySelectLoading = false;
        }
      },
      exportExcel(){
        this.fullscreenLoading = true;
        axios({
          method: 'get',
          responseType: 'blob',
          url: 'book/export',
        }).then(res =>{
              let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
              let href = window.URL.createObjectURL(blob);
              // window.location.href = href;//本来是直接跳转就可以下载了，但是文件名由后端设置，需要获取一下
              // 获取后端设置的header中文件名参数值
              let filename = res.headers['content-filename'];
              //由于后端使用utf8对文件名进行了编码，需要转一下
              filename = Utils.getCharFromUtf8(filename)
              let downloadElement = document.createElement('a');
              downloadElement.href = href;
              downloadElement.download = filename; //下载后文件名
              document.body.appendChild(downloadElement);
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              window.URL.revokeObjectURL(href); //释放掉blob对象
        }).finally(()=>{
          this.fullscreenLoading = false;
        })
      },
      searchData(){
          if(!(this.searchForm.item == undefined)){
            this.getBookList();
          }else{
            this.$message.warning("请输入内容再搜索")
          }

      },

      /****************************************************************************
       * 使用 js-xlsx 导入导出数据------START
       * *************************************************************************
       */
      /*
      async fetchData() {
        let obj = {
          currentPage: 0,
          pageSize: 0,
        }
        await this.$http.post('book/getBookList', obj).then(res => {
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
        return this.outputData.json_data;
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
        this.$http.post('book/importBookListData', datas).then(res => {
            if(res.code === 10006){
              this.$message.success("解析到 "+datas.bookList.length+" 条数据，导入成功 "+res.data+" 条数据！");
              this.getBookList();//刷新数据
            }else{
              this.$message.error(res.msg)
            }
        })

      },
      */
      /****************************************************************************
       * 使用 js-xlsx 导入导出数据------END
       * *************************************************************************
       */

      refreshTable(){
          this.searchForm = {};
          this.getBookList();
        },
      onSubmit(dialogForm){
          this.$refs[dialogForm].validate((valid) => { //表单验证
            if (valid) {
              if (this.dialogStatus === '添加') {//表单状态是添加
                this.$http.post('book/addBook', this.dialogForm).then(res => {
                  if (res.code === 10005) {
                    this.dialogFormVisible = false, this.getBookList();
                    this.$message.success(res.msg)
                  }else{
                    this.$message.error(res.msg)
                  }

                })
              } else {//编辑
                this.$http.post('book/modifyBook', this.dialogForm).then(res => {
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
      onSubmitByCamera(dialogFormByCameraVideo){
        this.$refs[dialogFormByCameraVideo].validate((valid) => { //表单验证
          if (valid) {
              this.$http.post('book/addBookByCamera', this.dialogFormByCameraVideo).then(res => {
                if (res.code === 10005) {
                  // 不显示表单
                  this.dialogFormByCameraVisible = false;
                  //按钮文字
                  this.startOrStopScanText = '再加一本'
                  this.getBookList();
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
      addRow(){
          this.dialogFormVisible = true;
          this.dialogStatus = '添加';
          this.dialogForm = {};//清空表单
          // this.dialogForm.bookRepertorySize = 10;

        },
      addRowByCamera(){
        this.dialogByCameraVisible = true;
        this.dialogForm = {};//清空表单
        // this.dialogForm.bookRepertorySize = 10;

      },
      openFullScreen(){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        return loading;
      },
      dialogFormByCameraReset(){
        const _this = this;
        console.log('dialogFormByCameraReset...')
        // 按钮状态为stop
        _this.startOrStop = 'stop'
        // 按钮文字
        _this.startOrStopScanText = '开始扫描'
        // 不显示接收视频的video
        _this.CameraVideoVisible = false;
        // 关闭表单显示
        _this.dialogFormByCameraVisible = false;
        // 重置codeReader关闭摄像头扫描
        if(_this.codeReader!=null)
          _this.codeReader.reset()
      },
      closeDialogByCamera(){
        const _this = this;
        console.log('closeDialogByCamera')
        // 按钮状态为stop
        _this.startOrStop = 'stop'
        // 按钮文字
        _this.startOrStopScanText = '开始扫描'
        // 不显示接收视频的video
        _this.CameraVideoVisible = false;
        // 重置表单数据
        _this.dialogFormByCameraVideo={};
        // 关闭表单显示
        _this.dialogFormByCameraVisible = false;
        // 重置codeReader关闭摄像头扫描
        if(_this.codeReader!=null)
                _this.codeReader.reset()
      },
      startOrStopScan(){
        const _this = this;
        // 扫码之前
        function scanBefore() {
          console.log('scanBefore...')
          // 初始化设备（相机），创建codeReader对象
          _this.codeReader = new BrowserMultiFormatReader();
          _this.codeReader
            .listVideoInputDevices()
            .then(videoInputDevices => {
              // videoInputDevices.forEach(device =>
              //   console.log(`${device.label}, ${device.deviceId}`)
              //
              // );
              //只获取第一个设备
              _this.firstDeviceId = videoInputDevices[0].deviceId;
              console.log(_this.firstDeviceId)
            })
            .catch(err => console.error(err));
          // 按钮状态为start
          _this.startOrStop = 'start'
          // 按钮文字
          _this.startOrStopScanText = '停止扫描'
          // 显示接收视频的video
          _this.CameraVideoVisible = true
          // 关闭表单显示
          // _this.dialogFormByCameraVisible = false;
        }
        // 扫码成功
        function scanSuccess(result) {
          console.log('scanSuccess...')
          console.log('扫描结果为：'+result.text)
          const isbn = result.text;
          // 按钮状态为stop
          _this.startOrStop = 'stop'
          // 按钮文字
          _this.startOrStopScanText = '重新扫描'
          // 不显示接收视频的video
          _this.CameraVideoVisible = false;
          // 重置codeReader关闭扫描
          _this.codeReader.reset()

          // 打开全局加载loading动画
          const loading = _this.openFullScreen()

          // 构造请求对象
          let obj = {
            "showapi_timestamp": showApiforMatterDateTime(), //注意要使用当前时间。服务器只处理时间误差10分钟以内的请求
            "showapi_appid": 'id', //TODO:这里需要改成自己的appid
            "showapi_sign": 'sign',  //TODO:这里需要改成自己的密钥
            "isbn": isbn //ISBN号
          }
          // 请求showapi.com接口 根据isbn查询图书
          _this.$http.post('/showapi', obj).then(res => {
            console.log(res)
            loading.close();
            /**{
                  "showapi_res_error": "",
                  "showapi_res_id": "5eac3b618d57baae12dab5a0",
                  "showapi_res_code": 0,
                  "showapi_res_body": {
                    "ret_code":0,
                    "remark":"success",
                    "showapi_fee_code":0,
                    "data":{
                      "edition":"1",
                      "pubdate":"2004-09",
                      "paper":"胶版纸",
                      "img":"http://app2.showapi.com/isbn/img/55af224035004a45bbb424891ad59ac3.jpg",
                      "gist":"　C#是一门简单、现代、优雅、面向对象、类型安全、平台独立的组件编程语言，是.NET的关键性语言，也是整个.NET平台的基础，它使程序员能快速地为新一代Microsoft.Net平台开发出应用程序。全书以通俗易懂的语言，精辟丰富的实例，从对C#的简介开始，全面讲解了C#编程语言规范以及各个层面的特性，内容包括C#的词法结构、类型、变量、表达式、类、结构、不安全代码、泛型，等等。",
                      "format":"其他",
                      "publisher":"电子工业出版社",
                      "author":"Anders Hejlsberg",
                      "title":"C#编程语言详解/.NET技术大系",
                      "price":"55.00",
                      "page":"482",
                      "isbn":"9787121002281",
                      "binding":"平装",
                      "produce":""}}
                }
             */
            /**
             *                 {
                  "showapi_res_error": "",
                  "showapi_res_id": "5ead00ac8d57baae12f95aaa",
                  "showapi_res_code": 0,
                  "showapi_res_body": {
                    "datas":[
                      {"series":"",
                      "pagesize":"",
                      "authorintro":"",
                      "edition":"",
                      "yinci":"",
                      "paper":"",
                      "subject":"",
                      "wordnum":"",
                      "img":"https://img.maimiaobook.com/cover/892TVU6S3B.jpg?x-oss-process=style/yuantu",
                      "bookcatalog":"",
                      "gist":"",
                      "publisher":
                      "电子工业出版社",
                      "annotation":"",
                      "author":"[美]AndersHejlsbergScottWiltamuthPeterGolde张晓",
                      "title":"植物大战僵尸图鉴全攻略全本",
                      "isbn10":"7121002280",
                      "page":"482",
                      "page_format":"",
                      "isbn":"9787121002281",
                      "publisher_pubdate":"",
                      "title_author":"",
                      "pubdate":"2004-09-01",
                      "keyword":"",
                      "levelnum":"",
                      "genus":"",
                      "format":"",
                      "heatnum":1,
                      "price":20.00,
                      "batch":"",
                      "pubplace":"",
                      "binding":"",
                      "language":"",
                      "ciptxt":"",
                      "produce":""}],"ret_code":0,"remark":"success","showapi_fee_code":0}
                }
             */
            if(res.showapi_res_code === 0){
              if(res.showapi_res_body.ret_code === 0){
                const resBookData = res.showapi_res_body.data;
                // 查询成功
                _this.dialogFormByCameraVisible = true;
                _this.$message.success('查询成功,请手动输入其它信息！')
                console.log(res)

                _this.dialogFormByCameraVideo={
                  bookIsbn:resBookData.isbn,
                  bookName:resBookData.title,
                  // bookCategory:resBookData.format,
                  bookPrice:resBookData.price,
                  bookPub:resBookData.publisher,
                  bookAuthor: resBookData.author,
                }
                // FIXME 由于目前的第三方接口无法查询图书类别，直接要求用户输入
                // const CategoryJSON={
                //   "A":"马克思主义、列宁主义、毛泽东思想、邓小平理论",
                //   "B":"哲学、宗教",
                //   "C":"社会科学总论",
                //   "D":"政治、法律",
                //   "E":"军事",
                //   "F":"经济",
                //   "G":"文化、科学、教育、体育",
                //   "H":"语言、文字",
                //   "I":"文学",
                //   "J":"艺术",
                //   "K":"历史、地理",
                //   "N":"自然科学总论",
                //   "O":"数理科学和化学",
                //   "P":"天文学、地球科学",
                //   "Q":"生物科学",
                //   "R":"医药、卫生",
                //   "S":"农业科学",
                //   "T":"工业技术",
                //   "U":"交通运输",
                //   "V":"航空、航天",
                //   "X":"环境科学、安全科学",
                //   "Z":"综合性图书"
                // }
                console.log(_this.dialogFormByCameraVideo)
              }else{
                _this.$message.error(res.showapi_res_body.remark)
                console.log(res)
              }

            }else{
              // 查询失败
              /**
               * 0成功
               -1，系统调用错误
               -2，可调用次数或金额为0
               -3，读取超时
               -4，服务端返回数据解析错误
               -5，后端服务器DNS解析错误
               -6，服务不存在或未上线
               -7, API创建者的网关资源不足
               -1000，系统维护
               -1002，showapi_appid字段必传
               -1003，showapi_sign字段必传
               -1004，签名sign验证有误
               -1005，showapi_timestamp无效
               -1006，app无权限调用接口
               -1007，没有订购套餐
               -1008，服务商关闭对您的调用权限
               -1009，调用频率受限
               -1010，找不到您的应用
               -1011，子授权app_child_id无效
               -1012，子授权已过期或失效
               -1013，子授权ip受限
               -1014，token权限无效
               */
              console.log("查询失败，返回失败数据如下：")
              console.log(res)
              _this.$message.error('调用图书查询接口失败')
            }
          })
        }
        function scanDestroy() {
          console.log('scanDestroy...')
          // 按钮状态为stop
          _this.startOrStop = 'stop'
          // 按钮文字
          _this.startOrStopScanText = '开始扫描'
          // 不显示接收视频的video
          _this.CameraVideoVisible = false;
          // 重置codeReader关闭扫描
          _this.codeReader.reset()
        }

        if(null == _this.startOrStop || _this.startOrStop == 'stop'){
          // 开始扫
          scanBefore();
          _this.codeReader.decodeFromVideoDevice(_this.firstDeviceId, 'video', (result, err) => {
            if (result) {
              // result不为null即扫描成功
              scanSuccess(result)
            }
            // if (err && !(err instanceof ZXing.NotFoundException)) {
            //   console.error(err)
            // }
          })
        }else if (_this.startOrStop == 'start'){
          //停止扫
          scanDestroy()
        }
      },
      editRow(item){
          // 初始化表单数据
          console.log(item)
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
            this.$http.post('book/removeBook', obj).then(res => {
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
