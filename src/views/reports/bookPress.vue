<template>
  <div>
    <div style="width:100%;height:500px" ref="chart"></div>
  </div>

</template>

<script>
  export default {
    name: "bookPress",
    data() {
      return {
      }
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
        let bookCategoryNumbers=[]
        this.$http.post('book/getBookPressData', null).then(res => {
          res.data.map(item => {
            bookPub.push(item.bookPub)  // 出版社
            bookNumbers.push(item.bookNumber) // 数量
            bookCategoryNumbers.push(item.bookCategoryNumber) // 种类
            return item
          })
          this.initCharts(bookPub,bookNumbers,bookCategoryNumbers);
        })
      },

      initCharts(bookPub,bookNumbers,bookCategoryNumbers) {
        // 基于准备好的dom，初始化echarts实例
        var myChart = this.$echarts.init(this.$refs.chart);

        //数据
        var options = {
          title: {
            text: '出版社图书分析'
          },
          tooltip: {},
          legend: {
            data: ['图书数量', '图书种类']
          },
          xAxis: {
            data: bookPub
          },
          yAxis: {},
          series: [{
            name: '图书数量',
            type: 'bar',
            data: bookNumbers
          },
            {
              name: '图书种类',
              type: 'bar',
              data:  bookCategoryNumbers
            }
          ]
        }
        // 绘制图表
        myChart.setOption(options);
      }
    }
  }


</script>

<style scoped>

</style>
