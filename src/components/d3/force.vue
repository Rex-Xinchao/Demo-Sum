<template>
  <svg id="force" width="600" height="600"></svg>
</template>
<script>
import * as d3 from 'd3'

const nodesData = [
  { 'name': 'Lillian', 'sex': 'F' },
  { 'name': 'Gordon', 'sex': 'M' },
  { 'name': 'Sylvester', 'sex': 'M' },
  { 'name': 'Mary', 'sex': 'F' },
  { 'name': 'Helen', 'sex': 'F' },
  { 'name': 'Jamie', 'sex': 'M' },
  { 'name': 'Jessie', 'sex': 'F' },
  { 'name': 'Ashton', 'sex': 'M' },
  { 'name': 'Duncan', 'sex': 'M' },
  { 'name': 'Evette', 'sex': 'F' },
  { 'name': 'Mauer', 'sex': 'M' },
  { 'name': 'Fray', 'sex': 'F' },
  { 'name': 'Duke', 'sex': 'M' },
  { 'name': 'Baron', 'sex': 'M' },
  { 'name': 'Infante', 'sex': 'M' },
  { 'name': 'Percy', 'sex': 'M' },
  { 'name': 'Cynthia', 'sex': 'F' }
]

const linksData = [
  { 'source': 'Sylvester', 'target': 'Gordon', 'type': 'A' },
  { 'source': 'Sylvester', 'target': 'Lillian', 'type': 'A' },
  { 'source': 'Sylvester', 'target': 'Mary', 'type': 'A' },
  { 'source': 'Sylvester', 'target': 'Jamie', 'type': 'A' },
  { 'source': 'Sylvester', 'target': 'Jessie', 'type': 'A' },
  { 'source': 'Sylvester', 'target': 'Helen', 'type': 'A' },
  { 'source': 'Helen', 'target': 'Gordon', 'type': 'A' },
  { 'source': 'Mary', 'target': 'Lillian', 'type': 'A' },
  { 'source': 'Ashton', 'target': 'Mary', 'type': 'A' },
  { 'source': 'Duncan', 'target': 'Jamie', 'type': 'A' },
  { 'source': 'Gordon', 'target': 'Jessie', 'type': 'A' },
  { 'source': 'Sylvester', 'target': 'Fray', 'type': 'E' },
  { 'source': 'Fray', 'target': 'Mauer', 'type': 'A' },
  { 'source': 'Fray', 'target': 'Cynthia', 'type': 'A' },
  { 'source': 'Fray', 'target': 'Percy', 'type': 'A' },
  { 'source': 'Percy', 'target': 'Cynthia', 'type': 'A' },
  { 'source': 'Infante', 'target': 'Duke', 'type': 'A' },
  { 'source': 'Duke', 'target': 'Gordon', 'type': 'A' },
  { 'source': 'Duke', 'target': 'Sylvester', 'type': 'A' },
  { 'source': 'Baron', 'target': 'Duke', 'type': 'A' },
  { 'source': 'Baron', 'target': 'Sylvester', 'type': 'E' },
  { 'source': 'Evette', 'target': 'Sylvester', 'type': 'E' },
  { 'source': 'Cynthia', 'target': 'Sylvester', 'type': 'E' },
  { 'source': 'Cynthia', 'target': 'Jamie', 'type': 'E' },
  { 'source': 'Mauer', 'target': 'Jessie', 'type': 'E' }
]

export default {
  name: 'chart',
  data () {
    return {
      svg: null,
      simulation: null,
      linkForce: null
    }
  },
  methods: {
    initChart () {
      this.svg = d3.select('#force')
      const width = this.svg.attr('width')
      const height = this.svg.attr('height')
      const centerPoint = {
        x: width / 2,
        y: height / 2
      }
      // 构建模拟器
      this.simulation = d3.forceSimulation().nodes(nodesData)
      // 创建链接力
      this.linkForce = d3.forceLink(linksData).id((d) => {
        return d.name
      })
      // 添加定心力和充电力
      this.simulation
        .force('charge_force', d3.forceManyBody())
        .force('center_force', d3.forceCenter(centerPoint.x, centerPoint.y))
        // 添加到模拟器中
      this.simulation.force('links', this.linkForce)
      this.drawChart()
    },
    drawChart () {
      const node = this.initNodes()
      const link = this.initLinks()
      // 反复迭代出force图表
      this.simulation.on('tick', function () {
        node
          .attr('cx', (d) => {
            return d.x
          })
          .attr('cy', (d) => {
            return d.y
          })
        link
          .attr('x1', (d) => {
            return d.source.x
          })
          .attr('y1', (d) => {
            return d.source.y
          })
          .attr('x2', (d) => {
            return d.target.x
          })
          .attr('y2', (d) => {
            return d.target.y
          })
      })
    },
    initNodes () {
      return this.svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(nodesData)
        .enter()
        .append('circle')
        .attr('r', 10)
        .attr('fill', this.circleColor)
    },
    circleColor (d) {
      if (d.sex === 'M') {
        return 'blue'
      } else {
        return 'pink'
      }
    },
    initLinks () {
      return this.svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(linksData)
        .enter()
        .append('line')
        .attr('stroke-width', 2)
        .style('stroke', this.linkColor)
    },
    linkColor (d) {
      if (d.type === 'A') {
        return 'green'
      } else {
        return 'red'
      }
    }
  },
  mounted () {
    this.initChart()
  }
}
</script>

<style scoped>
  #force {
    width: 100%;
    height: 100%;
  }
</style>
