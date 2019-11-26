<template>
  <div>
    <div style="width:100%;height:500px" ref="chart"></div>
  </div>
</template>

<script>
    export default {
      name: "main.vue",
      created() {
        //
      },
      mounted() {
        this.getBookOrdersData();
      },
      methods: {
        getBookOrdersData() {
          // let legendData = []
          // let seriesData = []
          // this.$http.post('getBookCategoryData', null).then(res => {
          //   res.data.map(item => {
          //     legendData.push(item.bookCategory)  // 类别
          //     seriesData.push({
          //       name: item.bookCategory,
          //       value: item.bookNumber
          //     }) // 数量
          //     return item
          //   })
          //   this.initCharts(legendData, seriesData);
          // })
          var orderNumbers = [120, 132, 101, 134, 90, 230, 210];
          var orderBookNumbers=[120*2, 132*1, 101*3, 134*5, 90*3, 230*1, 210*2];
          this.initCharts(orderNumbers,orderBookNumbers);
        },

        initCharts(orderNumbers,orderBookNumbers) {

          // 基于准备好的dom，初始化echarts实例
          var myChart = this.$echarts.init(this.$refs.chart);

          // 数据
          var options = {
            title: {
              text: '近7天动态订单数据（模拟）'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data:['订单量（单）','销售量（本）']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name:'订单量（单）',
                type:'line',
                stack: '总量',
                data:orderNumbers
              },
              {
                name:'销售量（本）',
                type:'line',
                stack: '总量',
                data:orderBookNumbers
              }
            ]
          };
          // 绘制图表
          myChart.setOption(options, true);
        }
      }
    }
</script>

<style scoped>

</style>
