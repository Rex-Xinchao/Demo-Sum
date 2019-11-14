<template>
  <svg id="circle" width="600" height="600"></svg>
</template>
<script>
import * as d3 from 'd3'

const data = [
  [11975, 5871, 8916, 2868],
  [1951, 10048, 2060, 6171],
  [8010, 16145, 8090, 8045],
  [1013, 990, 940, 6907]
]

export default {
  name: 'chart',
  data () {
    return {
      svg: null,
      arc: null, // 环生成器
      chords: null, // 弦
      ribbon: null, // 弦长
      radius: {
        outer: 0,
        inner: 0
      }
    }
  },
  methods: {
    initChart () {
      // 设置svg
      this.initSvg()
      // 设置圆环和弦
      this.initArc()
      // 绘制图表
      this.drawChart()
    },
    initSvg () {
      this.svg = d3.select('#circle')
      const width = this.svg.attr('width')
      const height = this.svg.attr('height')
      this.svg
        .attr('viewBox', [-width / 2, -height / 2, width, height])
        .attr('font-size', 10)
        .attr('font-family', 'sans-serif')
      this.radius.outer = Math.min(width, height) * 0.5 - 30
      this.radius.inner = this.radius.outer - 20
    },
    initArc () {
      const chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.descending)
      this.arc = d3.arc()
        .innerRadius(this.radius.inner)
        .outerRadius(this.radius.outer)
      this.ribbon = d3.ribbon()
        .radius(this.radius.inner)
      this.chords = chord(data)
    },
    drawChart () {
      const group = this.initGroup() // 设置外圈分组
      const groupTick = this.initGroupTick(group) // 设置外圈刻度
      const path = this.initPath() // 弦图连线
    },
    initGroup () {
      const color = this.getColor()
      const group = this.svg.append('g')
        .selectAll('g')
        .data(this.chords.groups)
        .join('g')
      group.append('path')
        .attr('fill', d => color(d.index))
        .attr('stroke', d => d3.rgb(color(d.index)).darker())
        .attr('d', this.arc)
      return group
    },
    initGroupTick (group) {
      const formatValue = d3.formatPrefix(',.0', 1e3)
      let groupTick = group.append('g')
        .selectAll('g')
        .data(d => this.getTicks(d, 1e3))
        .join('g')
        .attr('transform', d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${this.radius.outer},0)`)
      groupTick.append('line')
        .attr('stroke', '#000')
        .attr('x2', 6)
      groupTick
        .filter(d => d.value % 5e3 === 0)
        .append('text')
        .attr('x', 8)
        .attr('dy', '.35em')
        .attr('transform', d => d.angle > Math.PI ? 'rotate(180) translate(-16)' : null)
        .attr('text-anchor', d => d.angle > Math.PI ? 'end' : null)
        .text(d => formatValue(d.value))
      return groupTick
    },
    getTicks (d, step) {
      const k = (d.endAngle - d.startAngle) / d.value
      return d3.range(0, d.value, step).map(value => {
        return { value: value, angle: value * k + d.startAngle }
      })
    },
    initPath () {
      const color = this.getColor()
      this.svg.append('g')
        .attr('fill-opacity', 0.67)
        .selectAll('path')
        .data(this.chords)
        .join('path')
        .attr('d', this.ribbon)
        .attr('fill', d => color(d.target.index))
        .attr('stroke', d => d3.rgb(color(d.target.index)).darker())
    },
    getColor () {
      return d3.scaleOrdinal()
        .domain(d3.range(4))
        .range(['#000000', '#FFDD89', '#957244', '#F26223'])
    }
  },
  mounted () {
    this.initChart()
  }
}
</script>

<style scoped>
  #circle {
    width: 100%;
    height: 100%;
  }
</style>
