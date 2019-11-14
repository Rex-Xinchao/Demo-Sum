<template>
  <div id="chart-demo-3d">
  </div>
</template>

<script>
  import Highcharts from 'highcharts/highstock';
  import HighchartsMore from 'highcharts/highcharts-more';
  import HighchartsDrilldown from 'highcharts/modules/drilldown';
  import Highcharts3D from 'highcharts/highcharts-3d';

  HighchartsMore(Highcharts)
  HighchartsDrilldown(Highcharts);
  Highcharts3D(Highcharts);
  export default {
    name: 'HelloWorld',
    data() {
      return {
        chart: null
      }
    },
    methods: {
      initChart() {
        const vm = this
        const $el = document.getElementById('chart-demo-3d');
        const options = vm.initOptions();
        vm.chart = Highcharts.chart($el, options);
      },
      initOptions() {
        const vm = this
        const chart = {
          type: 'column',
          margin: 75,
          options3d: {
            enabled: true,
            alpha: 10,
            beta: 25,
            depth: 70,
            viewDistance: 100,      // 视图距离，它对于计算角度影响在柱图和散列图非常重要。此值不能用于3D的饼图
            frame: {                // Frame框架，3D图包含柱的面板，我们以X ,Y，Z的坐标系来理解，X轴与 Z轴所形成
              // 的面为bottom，Y轴与Z轴所形成的面为side，X轴与Y轴所形成的面为back，bottom、
              // side、back的属性一样，其中size为感官理解的厚度，color为面板颜色
              bottom: {
                size: 10
              },
              side: {
                size: 1,
                color: 'transparent'
              },
              back: {
                size: 1,
                color: 'transparent'
              }
            }
          },
        }
        const series = [{
          name: '销售',
          data: [2, 3, null, 4, 0, 5, 1, 4, 6, 3]
        }]
        return {
          chart: chart,
          title: {
            text: '包含空值的3D柱状图'
          },
          subtitle: {
            text: '请注意值为 0 和 null 的区别'
          },
          plotOptions: {
            column: {
              depth: 25
            }
          },
          xAxis: {
            categories: Highcharts.getOptions().lang.shortMonths
          },
          yAxis: {
            title: {
              text: null
            }
          },
          series: series
        }
      }
    },
    mounted() {
      this.initChart()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #chart-demo-3d {
    width: 1000px;
    height: 500px;
    margin: 0 auto;
  }
</style>
