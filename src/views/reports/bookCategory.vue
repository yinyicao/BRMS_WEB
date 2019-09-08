<template>
  <div>
    <div style="width:100%;height:500px" ref="chart"></div>
  </div>
</template>

<script>
    export default {
        name: "bookCategory",
        data(){
          return{

          }
        },
      created() {
        this.getBookCategoryData();
      },
      mounted() {
        // this.initCharts();
      },

      methods: {
        getBookCategoryData() {
          let legendData = []
          let seriesData = []
          this.$http.post('getBookCategoryData', null).then(res => {
            res.data.map(item => {
              legendData.push(item.bookCategory)  // 类别
              seriesData.push({
                name:item.bookCategory,
                value:item.bookNumber
              }) // 数量
              return item
            })
            this.initCharts(legendData,seriesData);
          })
        },

        initCharts(legendData,seriesData) {

          // 基于准备好的dom，初始化echarts实例
          var myChart = this.$echarts.init(this.$refs.chart);

          //数据
          var options = {
            title : {
              text: '图书类别分析',
              subtext: '图书数量',
              x:'center'
            },
            tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              type: 'scroll',
              orient: 'vertical',
              right: 10,
              top: 20,
              bottom: 20,
              data:legendData
            },
            series : [
              {
                name: '数量',
                type: 'pie',
                radius : '55%',
                center: ['40%', '50%'],
                data: seriesData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          // 绘制图表
          myChart.setOption(options);
        },
      }
    }
</script>

<style scoped>

</style>
