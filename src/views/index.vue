<template>
    <div>
      <el-card class="" style="width: 1010px;margin-left: 50px;margin-bottom: 50px;font-size:18px;">
        <el-carousel trigger="click" height="150px">
          <el-carousel-item v-for="item in carouselData" :key="item.id">
            <img :src="item.src" style="width: 1010px;height: 70px"/>
            <h3>{{ item.text }}</h3>
          </el-carousel-item>
        </el-carousel>
      </el-card>
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="header clearfix">
          您当前的角色为：<span v-for="rn in roleNames">{{rn}}</span>
          <el-badge :value="permissionNames.length+'个'"  type="primary"
                    class="item" style="float: right; margin-right: 10px">
          <div>拥有权限</div>
          </el-badge>
        </div>
        <el-tag
          style="margin: 5px 5px"
          v-for="p in permissionNames"
          :key="p"
          effect="dark"
          size ="medium"
          type="warning">
          {{ p }}
        </el-tag>
      </el-card>
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="header clearfix">
          <span>本站数据统计</span>
          <div style="float: right; margin-right: 10px">统计时间：{{getDataTime}}</div>
      </div>
        <div v-for="(value,key) in siteData" :key="key" class="text item">
          <div><span style="margin-left: 20px;">{{key}}:</span><el-tag style="float:right;margin-right: 200px" type="success">{{value}}</el-tag></div>
          <el-divider></el-divider>
        </div>
      </el-card>
    </div>
</template>

<script>
    import back1 from "../assets/back1.jpg"
    import back2 from "../assets/back2.jpg"
    import back3 from "../assets/back3.jpg"
    export default {
        name: "index",
        data(){
          return{
            permissionNames:this.$store.state.userinfo.permissionNames,
            roleNames:this.$store.state.userinfo.rolenames,
            siteData: null,
            getDataTime:"",
            carouselData:[{
              id:1,
              src:back1,
              text:"欢迎您,"+this.$store.state.userinfo.username+"!"
            },{
              id:2,
              src:back2,
              text:"高效管理图书分销"
            },{
              id:3,
              src:back3,
              text:"图书分销管理系统"
            }]
          }
        },
      mounted(){
        this.getSiteData();
      },
      methods:{
          getSiteData(){
            this.$http.get('/main/getSiteData').then(res => {
              // console.log(res)
              if (res.code === 10002) { //查询成功
                this.siteData = res.data;
                this.getDataTime = this.$timeFormat(new Date(),null);
              }
            });
        }
      }
    }
</script>

<style lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
    height: 300px;
    float: left;
    margin-left: 50px;
    .header{
      font-size: 15px;
      color: rgba(21, 173, 255, 0.61);
    }
  }
  .el-divider{
    margin: 7px auto;
  }
</style>
