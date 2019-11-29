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
          let legendData = []
          let seriesData = []
          this.$http.post('getDisOrderInterval7DayData', null).then(res => {
            let that = this // 传递this对象
            let dates = []
            res.data.date.forEach(function (e) {
              let date = that.$timeFormat(new Date(e),"yyyy-MM-dd")
              dates.push(date)
            })
            let orderBookNumbers = res.data.orderBookNumbers
            let orderNumbers = res.data.orderNumbers
            this.initCharts(orderNumbers,orderBookNumbers,dates);
          })
          // 模拟数据
          // var orderNumbers = [120, 132, 101, 134, 90, 230, 210];
          // var orderBookNumbers=[120*2, 132*1, 101*3, 134*5, 90*3, 230*1, 210*2];
          // var dates = ["2019-11-22","2019-11-23","2019-11-24","2019-11-25","2019-11-26",
          //   "2019-11-27","2019-11-28","2019-11-29"]
          // this.initCharts(orderNumbers,orderBookNumbers,dates);
        },

        initCharts(orderNumbers,orderBookNumbers,dates) {

          // 基于准备好的dom，初始化echarts实例
          var myChart = this.$echarts.init(this.$refs.chart);

          // 数据
          var options = {
            title: {
              text: '近7天动态订单数据'
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
              data: dates
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
