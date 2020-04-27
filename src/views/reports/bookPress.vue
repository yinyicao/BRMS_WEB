<template>
  <div>
    <div style="color: #000000;font-weight: 900;font-size: 18px;
    text-align: center">出版社图书分析</div>
    <div style="width:100%;height:500px;margin-top: 20px" ref="chart1"></div>
    <div style="width:100%;height:500px" ref="chart2"></div>
  </div>

</template>

<script>
  export default {
    name: "bookPress",
    data() {
      return {}
    },
    created() {
      this.getBookPressData();
    },
    mounted() {
      // this.initCharts();
    },

    methods: {
      getBookPressData() {
        let bookPub = []
        let bookNumbers = []
        let bookCategoryNumbers = []
        this.$http.post('book/getBookPressData', null).then(res => {
          res.data.map(item => {
            bookPub.push(item.bookPub)  // 出版社
            bookNumbers.push(item.bookNumber) // 数量
            bookCategoryNumbers.push(item.bookCategoryNumber) // 种类
            return item
          })
          this.initCharts(bookPub, bookNumbers, bookCategoryNumbers);
        })
      },

      initCharts(bookPub, bookNumbers, bookCategoryNumbers) {
        // 基于准备好的dom，初始化echarts实例
        var myChart1 = this.$echarts.init(this.$refs.chart1);
        var myChart2 = this.$echarts.init(this.$refs.chart2);

        //数据
        var options1 = {
          title: {
            text: '图书数量（本）'
          },
          tooltip: {},
          legend: {
            data: ['图书数量']
          },
          // backgroundColor: 'rgb(128, 128, 128,0.5)',
          color: ['#e75555'],
          xAxis: {
            data: bookPub
          },
          yAxis: {},
          series: [{
            name: '图书数量',
            type: 'bar',
            data: bookNumbers
          }
          ]
        }
        var options2 = {
          title: {
            text: '图书种类（种）'
          },
          tooltip: {},
          legend: {
            data: ['图书种类']
          },
          // backgroundColor: 'rgb(128, 128, 128,0.5)',
          color: ['#2f4554'],
          xAxis: {
            data: bookPub
          },
          yAxis: {},
          series: [
            {
              name: '图书种类',
              type: 'bar',
              data: bookCategoryNumbers
            }
          ]
        }
        // 绘制图表
        myChart1.setOption(options1);
        myChart2.setOption(options2);
      }
    }
  }


</script>

<style scoped>

</style>
