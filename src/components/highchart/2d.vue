<template>
  <div id="chart-demo">
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts3D from 'highcharts/highcharts-3d'

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts)
Highcharts3D(Highcharts)
export default {
  name: 'HelloWorld',
  data () {
    return {
      chart: null
    }
  },
  methods: {
    initChart () {
      Highcharts.setOptions({
        lang: {
          resetZoom: '重置',
          resetZoomTitle: '重置缩放比例'
        }
      })
      const vm = this
      const $el = document.getElementById('chart-demo')
      const options = vm.initOptions()
      vm.chart = Highcharts.chart($el, options)
      vm.changeTitle()
    },
    initOptions () {
      const vm = this
      const chart = {
        zoomType: 'xy',
        events: {
          click: function (event) {
            vm.initLabel(event, this)
          }
        }
      }
      const series = [{
        name: 'line-one',
        data: [
          {
            x: new Date('2016/01/01').getTime(),
            y: 23,
            name: 'point 1',
            color: 'red'
          },
          {
            x: new Date('2016/01/02').getTime(),
            y: 51,
            name: 'point 2',
            color: 'green'
          },
          {
            x: new Date('2016/01/03').getTime(),
            y: 84,
            name: 'point 3',
            color: 'blue'
          },
          {
            x: new Date('2016/01/04').getTime(),
            y: 129,
            name: 'point 1',
            color: 'red'
          },
          {
            x: new Date('2016/01/05').getTime(),
            y: 15,
            name: 'point 2',
            color: 'green'
          },
          {
            x: new Date('2016/01/06').getTime(),
            y: 28,
            name: 'point 3',
            color: 'blue'
          },
          {
            x: new Date('2016/01/07').getTime(),
            y: 63,
            name: 'point 1',
            color: 'red'
          },
          {
            x: new Date('2016/01/08').getTime(),
            y: 79,
            name: 'point 2',
            color: 'green'
          },
          {
            x: new Date('2016/01/09').getTime(),
            y: 88,
            name: 'point 3',
            color: 'blue'
          }
        ],
        zones: [
          {
            value: 50,
            color: '#f7a35c',
            dashStyle: 'dot'
          },
          {
            value: 80,
            color: '#7cb5ec'
          },
          {
            color: '#90ed7d'
          }]
      }, {
        name: 'line-two',
        data: [
          {
            x: new Date('2016/01/01').getTime(),
            y: 5,
            name: 'point 1',
            color: 'red'
          },
          {
            x: new Date('2016/01/02').getTime(),
            y: 115,
            name: 'point 2',
            color: 'green'
          },
          {
            x: new Date('2016/01/03').getTime(),
            y: 48,
            name: 'point 3',
            color: 'blue'
          },
          {
            x: new Date('2016/01/04').getTime(),
            y: 29,
            name: 'point 1',
            color: 'red'
          },
          {
            x: new Date('2016/01/05').getTime(),
            y: 51,
            name: 'point 2',
            color: 'green'
          },
          {
            x: new Date('2016/01/06').getTime(),
            y: 82,
            name: 'point 3',
            color: 'blue'
          },
          {
            x: new Date('2016/01/07').getTime(),
            y: 36,
            name: 'point 1',
            color: 'red'
          },
          {
            x: new Date('2016/01/08').getTime(),
            y: 97,
            name: 'point 2',
            color: 'green'
          },
          {
            x: new Date('2016/01/09').getTime(),
            y: 88,
            name: 'point 3',
            color: 'blue'
          }
        ],
        zones: [
          {
            value: 50,
            color: '#f7a35c',
            dashStyle: 'dot'
          },
          {
            value: 80,
            color: '#7cb5ec'
          },
          {
            color: '#90ed7d'
          }]
      }]
      return {
        title: {
          useHTML: true,
          text: '<a href="https://www.baidu.com" target="_blank">a test demo</a>',
          style: {
            color: 'red'
          }
        },
        subtitle: {
          text: 'created by rex.sun',
          align: 'right'
        },
        colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
          '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
        xAxis: vm.initxAxis(),
        yAxis: vm.inityAxis(),
        chart: chart,
        tooltip: vm.initTooltip(),
        series: series,
        credits: {
          enabled: false
        }
      }
    },
    initxAxis () {
      const xAxis = {
        type: 'datetime',
        title: {
          text: 'x轴'
        },
        labels: {
          formatter: function () {
            this.value = new Date(this.value)
            let year = this.value.getFullYear()
            let month = this.value.getMonth() + 1
            let day = this.value.getDate()
            return `${year}-${month}-${day}`
          },
          step: 1, // 间距
          staggerLines: 1
        },
        tickLength: 3,
        tickWidth: 1,
        tickColor: 'red',
        tickmarkPlacement: 'on'
      }
      return xAxis
    },
    inityAxis () {
      const yAxis = {
        type: 'linear',
        title: {
          text: 'y轴'
        },
        labels: {
          formatter: function () {
            return this.value
          }
        },
        tickmarkPlacement: 'on',
        gridLineWidth: '1px',
        gridLineColor: '#C0C0C0',
        gridLineDashStyle: 'Dash'
      }
      return yAxis
    },
    initTooltip () {
      const tooltip = {
        backgroundColor: '#FCFFC5', // 背景颜色
        borderColor: 'black', // 边框颜色
        borderRadius: 10, // 边框圆角
        borderWidth: 3, // 边框宽度
        shadow: true, // 是否显示阴影
        animation: true, // 是否启用动画效果
        style: { // 文字内容相关样式
          color: '#ff0000',
          fontSize: '12px',
          fontWeight: 'blod',
          fontFamily: 'Courir new'
        },
        formatter: function () {
          return '<span style="color: ' + this.series.color + '">\u25CF</span> ' +
              this.series.name + ': <b>' + this.y + '</b>'
        }
      }
      return tooltip
    },
    initLabel (event, _self) {
      let label = _self.renderer
        .label(
          'x: ' + Highcharts.numberFormat(event.xAxis[0].value, 2) + ', y: ' + Highcharts.numberFormat(event.yAxis[0].value, 2),
          event.xAxis[0].axis.toPixels(event.xAxis[0].value),
          event.yAxis[0].axis.toPixels(event.yAxis[0].value)
        )
        .attr({
          fill: Highcharts.getOptions().colors[0],
          padding: 10,
          r: 5,
          zIndex: 8
        })
        .css({
          color: '#FFFFFF'
        })
        .add()
      setTimeout(function () {
        label.fadeOut()
      }, 1000)
    },
    changeTitle () {
      // 获取标题内容
      const title = this.chart.title.textStr
      // 动态改变标题
      setTimeout(e => {
        this.chart.setTitle({ text: title }, { text: 'subtitle changed' })
      }, 5000)
    }
  },
  mounted () {
    this.initChart()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #chart-demo {
    width: 100%;
    height: 100%;
  }
</style>
