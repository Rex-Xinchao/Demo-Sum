<template>
  <svg id="tree" width="600" height="600"></svg>
</template>
<script>
import * as d3 from 'd3'

const data = {
  name: 'flare',
  children: [
    {
      name: 'analytics',
      children: [
        {
          name: 'cluster',
          value: 8650
        },
        {
          name: 'graph',
          value: 1256
        },
        {
          name: 'optimization',
          value: 1856
        }]
    },
    {
      name: 'animate',
      children: [
        {
          name: 'Easing',
          value: 17010
        },
        {
          name: 'FunctionSequence',
          value: 5842
        },
        {
          name: 'interpolate',
          value: 1983
        }]
    },
    {
      name: 'data',
      children: [
        {
          name: 'converters',
          value: 1234
        },
        {
          name: 'DataField',
          value: 1759
        },
        {
          name: 'DataSchema',
          value: 2165
        }]
    }
  ]
}

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
      const svg = d3.select('#tree')
      const width = svg.attr('width')
      const height = svg.attr('height')
      const tree = data => {
        const root = d3.hierarchy(data)
          .sort((a, b) => (a.height - b.height) || a.data.name.localeCompare(b.data.name))
        root.dx = 10
        root.dy = width / (root.height + 1)
        return d3.cluster().nodeSize([root.dx, root.dy])(root)
      }

      const root = tree(data)

      svg.append('g')
        .attr('fill', 'none')
        .attr('stroke', '#555')
        .attr('stroke-opacity', 0.4)
        .attr('stroke-width', 1.5)
        .selectAll('path')
        .data(root.links())
        .join('path')
        .attr('d', d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}
      `)

      const node = svg.append('g')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-width', 3)
        .selectAll('g')
        .data(root.descendants())
        .join('g')
        .attr('transform', d => `translate(${d.y},${d.x})`)

      node.append('circle')
        .attr('fill', d => d.children ? '#555' : '#999')
        .attr('r', 2.5)

      node.append('text')
        .attr('dy', '0.31em')
        .attr('x', d => d.children ? -6 : 6)
        .text(d => d.data.name)
        .filter(d => d.children)
        .attr('text-anchor', 'end')
        .clone(true).lower()
        .attr('stroke', 'white')

      svg.attr('viewBox', [0, -height / 2, width, height])
    }
  },
  mounted () {
    this.initChart()
  }
}
</script>

<style scoped>
  #tree {
    width: 100%;
    height: 100%;
  }
</style>
