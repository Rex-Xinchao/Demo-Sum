<template>
  <div class="chart-container" style="width: 600px; height: 600px">
    <div class="graph-box" @click="hideMenu">
      <svg id="graph-box-svg"></svg>
    </div>
    <el-dropdown placement="bottom-start" trigger="click" ref="menuBox"
                 class="graph-menu-card" @command="handleCommand">
      <div></div>
      <el-dropdown-menu slot="dropdown" :divided="true" class="graph-menu-item">
        <el-dropdown-item v-if="currentClickNode" command="all">查看上下游</el-dropdown-item>
        <el-dropdown-item v-if="currentClickNode" command="up">展开上游</el-dropdown-item>
        <el-dropdown-item v-if="currentClickNode" command="down">展开下游</el-dropdown-item>
        <el-dropdown-item v-if="currentClickLink" command="remove">移除关系</el-dropdown-item>
        <el-dropdown-item v-if="currentClickLink" command="edit">编辑权重</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import * as d3 from "d3"
  const ChartData = [
    {
      name: 'Test',
      root: true,
      children: [
        {
          name: 'test right-1',
          children: [
            {
              name: 'test right-1-1',
              children: [
                { name: 'test right-1-1-1', total: 1 },
                { name: 'test right-1-1-2', total: 2 },
                { name: 'test right-1-1-3', total: 3 },
              ]
            },
            { name: 'test right-1-2' },
            { name: 'test right-1-3' },
            {
              name: 'test right-1-4',
              children: [
                { name: 'test right-1-4-1', total: 1 },
                { name: 'test right-1-4-2', total: 2 },
                { name: 'test right-1-4-3', total: 3 },
              ]
            },
            { name: 'test right-1-5' },
            { name: 'test right-1-4-1', total: 1 }
          ]
        },
        {
          name: 'test right-2',
          children: [
            { name: 'test right-1-4-1', total: 1 }
          ]
        },
      ]
    },
    {
      name: 'Test',
      root: true,
      children: [
        {
          name: 'test left-1',
          children: [
            {
              name: 'test left-1-1',
              children: [
                { name: 'test left-1-3-2', total: 2 }
              ]
            },
            {
              name: 'test left-1-2',
              children: [
                { name: 'test left-1-2-1', total: 1 },
                { name: 'test left-1-2-2', total: 2 },
                { name: 'test left-1-2-3', total: 3 },
                { name: 'test left-1-2-4', total: 4 },
              ]
            },
            {
              name: 'test left-1-3',
              children: [
                { name: 'test left-1-3-1', total: 1 },
                { name: 'test left-1-3-2', total: 2 },
                { name: 'test left-1-3-3', total: 3 },
                { name: 'test left-1-3-4', total: 4 },
                { name: 'test left-1-3-5', total: 5 },
              ]
            },
            {
              name: 'test left-1-4',
              children: [
                { name: 'test left-1-3-1', total: 1 }
              ]
            },
            {
              name: 'test left-1-5',
              children: [
                { name: 'test left-1-3-2', total: 1 }
              ]
            },
          ]
        },
        { name: 'test left-2' }
      ]
    }]

  let copyData = [
    { target: 'left-1-5', source: 'left-1-3-2' },
    { target: 'left-1-4', source: 'left-1-3-1' },
    { target: 'left-1-1', source: 'left-1-3-2' },
    { target: 'right-1-1', source: 'right-1-4-1' },
    { target: 'right-1-2', source: 'right-1-1-3' }
  ]

  export default {
    name: 'myChart',
    data() {
      return {
        treeData: null,
        d3TreeBox: {
          margin: { top: 0, right: 0, bottom: 0, left: 0 },
          width: 0,
          height: 0,
          dx: 0,
          dy: 0
        },
        d3Zoom: null,
        svgInstance: null, // svg
        visInstance: null, // g
        params: {
          width: '',
          height: ''
        },
        currentClickNode: null,
        currentClickLink: null,
        line: [],
        ChartData: null
      }
    },
    methods: {
      getChain() {
        // todo 接口获取数据
        this.initData(ChartData)
      },
      initData(data) {
        let totalList = [];
        this.initTreeChart(judgeList(data))
        // 递归函数，找到所有重复的子节点并删除重复的一个
        function judgeList(item) {
          let list = []
          item.forEach(e => {
            if (e.name === 'Test' || !totalList.find(item => (item.name === e.name))) {
              totalList.push(e)
              e.children && (e.children = judgeList(e.children))
              list.push(e)
            }
          })
          return list
        }
      },
      initTreeChart(data) {
        console.log(data)
        let $graphBox = document.querySelector('.graph-box');
        let $chart = document.querySelector('.chart-container');
        this.params.width = $graphBox.offsetWidth;
        this.params.height = $graphBox.offsetHeight;
        $graphBox.innerHTML = ''; // 清空tree图
        this.initChartOptions();
        this.initSvg();
        if ( !data || !data.length ) {
          return false;
        }
        this.graphTree(data[0], true); //上游
        this.graphTree(data[1], false); //下游
        this.rootNode()
        //手动连线实验
        let vm = this
        setTimeout(e => {
          this.line.forEach(data => {
            let lineData = [];
            let startNode = this.visInstance.select("." + data.item.source);
            let endNode = this.visInstance.select("." + data.item.target);
            let startPosition = getPosition(startNode);
            let endPosition = getPosition(endNode);
            startPosition.y -= 20; // 在y轴上有20左右像素的偏差，未找到原因
            endPosition.y -= 20;
            let offset = (startPosition.x - endPosition.x) / 5;
            lineData.push(startPosition);
            lineData.push({ x: startPosition.x - offset, y: startPosition.y });
            lineData.push({ x: endPosition.x + offset, y: endPosition.y });
            lineData.push(endPosition);
            let line = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasis);
            data.line
              .attr("d", line(lineData))
              .attr("stroke", "#ccc")
              .attr("stroke-width", 2)
              .attr("fill", "none")
              .attr("transform", "translate(0,20)")
              .on('click', d => {
                vm.showMenu(d3.event, null, d)
              });
          })
        }, 1000)
        const getPosition = item => {
          console.log(item)
          let transformValue = item._groups[0][0].attributes.transform.value
          let regX = /translate\((.*)\,/.exec(transformValue)
          let regY = /\,(.*)\)/.exec(transformValue)
          return {
            x: parseFloat(regX[1]),
            y: parseFloat(regY[1])
          }
        };
      },
      initChartOptions() {
        this.d3TreeBox.width = this.params.width - this.d3TreeBox.margin.right - this.d3TreeBox.margin.left;
        this.d3TreeBox.height = this.params.height - this.d3TreeBox.margin.top - this.d3TreeBox.margin.bottom;
        this.d3TreeBox.dx = 25; // 节点间距
        this.d3TreeBox.dy = this.d3TreeBox.width / this.d3TreeBox.height;
        this.d3Zoom = d3.zoom().scaleExtent([0.1, 10]); // 缩放比例
      },
      initSvg() {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svg.id = "graph-box-svg";
        document.querySelector('.graph-box').appendChild(svg);
        // svg对象
        this.svgInstance = d3.select("#graph-box-svg")
          .attr("width", this.params.width)
          .attr("height", this.params.height)
          .style("font-size", "12px")
          .style("user-select", "none")
          .call(this.d3Zoom.on('zoom', () => {
            this.visInstance.attr('transform', d3.event.transform.toString())
          }))
          .on('dblclick.zoom', null);
        // g对象
        this.visInstance = this.svgInstance.append('g').attr("cursor", "pointer");
        this.line = []
        copyData.forEach(item => {
          this.line.push({
            line: this.visInstance.append('path').data(copyData),
            item: item
          })
        })
      },
      rootNode() {
        //中心点
        let vm = this;
        let rootNode = this.visInstance.select('g.isRoot.down');
        rootNode.on('click', d => {
          vm.showMenu(d3.event, { ...d.data }, null)
        });
        rootNode.select('text').remove();
        rootNode.append('rect')
          .attr('width', 130)
          .attr('height', 42)
          .attr('fill', '#6580a6')
          .attr('rx', 10)
          .attr('ry', 10)
          .attr('x', -65)
          .attr('y', -20)
          .attr('text-anchor', 'middle');
        rootNode.append('title').text(d => d.data.name);
        rootNode.append('text')
          .attr('fill', '#fff')
          .attr('x', 0)
          .attr('y', 5)
          .attr('text-anchor', "middle")
          .style('font', "12px sans-serif")
          .style('font-weight', "bold")
          .append('tspan')
          .text((d) => {
            return vm._substring(d.data.name, 14, true)
          })
      },
      graphTree(data, $pos) {
        let root = d3.hierarchy(data);
        root.x0 = this.d3TreeBox.width / 2;
        root.y0 = this.d3TreeBox.height / 2;
        root.descendants().forEach((d, i) => {
          d.id = d.id || ($pos ? 'up_' : 'down_') + i;
          if ( d.children ) {
            d._children = d.children;
          }
        });
        this.updateTree(root, root, $pos);
      },
      updateTree(source, originData, $pos) {
        let vm = this;
        let d3TreeData = d3.tree()/*.size([this.d3TreeBox.width, this.d3TreeBox.height])*/.nodeSize([this.d3TreeBox.dx, 0])(originData);
        let diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
        let duration = d3.event && d3.event.altKey ? 2500 : 250;
        let nodes = d3TreeData.descendants().reverse();
        let links = d3TreeData.links();
        // Compute the new tree layout.
        // Normalize for fixed-depth.
        nodes.forEach((d) => {
          d.y = ($pos ? 1 : -1) * d.depth * 180 + this.d3TreeBox.width / 2;
        });
        let left = originData;
        let right = originData;
        source.eachBefore(node => {
          if ( node.x < left.x ) left = node;
          if ( node.x > right.x ) right = node;
        });
        let height = right.x - left.x + this.d3TreeBox.margin.top + this.d3TreeBox.margin.bottom;
        let transition = this.svgInstance.transition()
          .duration(duration)
          .attr("viewBox", [-this.d3TreeBox.margin.left - 5, left.x - this.d3TreeBox.margin.top - this.d3TreeBox.margin.bottom, this.d3TreeBox.width, height])
          .tween("resize", window.ResizeObserver ? null : () => () => this.svgInstance.dispatch("toggle"));
        // Update the nodes…
        let node = this.visInstance.selectAll("g.node")
          .data(nodes, d => d.id);
        // Enter any new nodes at the parent's previous position.
        let nodeEnter = node.enter().append("g")
          .attr("class", (d) => {
            return (d.data.root ? 'isRoot ' : '') + "node " + ($pos ? 'up' : 'down') + ' ' + d.data.name
          })
          .attr('display', d => d.data.hidden ? 'none' : 'block')
          .attr("transform", () => `translate(${source.y0},${source.x0})`)
          .on('click', d => {
            if ( !d.data.root && !d.data.isType && !d.data.hidden ) {
              vm.showMenu(d3.event, { ...d.data }, null)
            }
          });
        nodeEnter.append("circle")
          .attr("r", 10)
          .attr("style", d => $pos ? "fill: lightsteelblue" : "fill: #e6a23c")
          .attr('display', d => d.data.isType ? 'none' : 'block');
        nodeEnter.append("text")
          .attr("dy", "0.35em")
          .attr("x", d => d.data.isType ? 0 : ($pos ? (d._children ? -16 : 16) : (d._children ? 16 : -16)))
          .attr("text-anchor", d => $pos ? (d._children ? "end" : "start") : (d._children ? "start" : "end"))
          .text(d => d.data.name);
        nodeEnter.append("text")
          .attr("dy", "0.35em")
          .attr("x", d => {
            let len = d.data.total || 0;
            return len > 9 ? -6 : -2.9
          })
          .attr("text-anchor", "start")
          .attr("fill", "white")
          .text(d => {
            return d.data.total || ''
          })
          .attr('display', d => d.data.isType ? 'none' : 'block');
        nodeEnter.append("svg:title")
          .text(d => d.data.name);
        // Transition nodes to their new position.
        let nodeUpdate = nodeEnter.transition(transition)
          .attr("transform", d => `translate(${d.y},${d.x})`);
        nodeUpdate.select('circle')
          .attr('r', 10);
        nodeUpdate.select('text')
          .style('fill-opacity', 1);
        // Update the links…
        let link = this.visInstance.selectAll("path.link")
          .data(links, d => d.target.id);
        // Enter any new links at the parent's previous position.
        let linkEnter = link.enter().insert("path", 'g')
          .attr("class", "link " + ($pos ? 'up' : 'down'))
          .attr("d", d => {
            let o = { x: source.x0, y: source.y0 };
            return diagonal({ source: o, target: o })
          })
          .on('click', d => {
            vm.showMenu(d3.event, null, d)
          });
        // Transition links to their new position.
        let linkUpdate = linkEnter.transition(transition)
          .attr("d", diagonal);
        // Stash the old positions for transition.
        nodes.forEach(function (d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
        this.visInstance.select('g.up.isRoot').attr('display', 'none');
      },
      showMenu(event, clickNode, link) {
        this.currentClickNode = clickNode;
        this.currentClickLink = link;
        console.log(link);
        this.hideMenu();
        setTimeout(() => {
          this.$refs.menuBox.$el.style.display = "block";
          this.$refs.menuBox.$el.style.top = `${event.pageY - 80}px`;
          this.$refs.menuBox.$el.style.left = `${event.pageX - 350}px`;
          this.$refs.menuBox.show();
        }, 100)
      },
      hideMenu() {
        this.$refs.menuBox.hide();
        this.$refs.menuBox.$el.style.display = "none"

      },
      handleCommand(command) {
        if ( command === 'all' && this.currentClickNode ) {
          this.currentNode = { ...this.currentClickNode };
          this.getChain(command)
        } else if ( command === 'up' && this.currentClickNode ) {
          this.currentNode = { ...this.currentClickNode };
          this.getChain(command)
        } else if ( command === 'down' && this.currentClickNode ) {
          this.currentNode = { ...this.currentClickNode };
          this.getChain(command)
        } else if ( command === 'remove' && this.currentClickLink ) {
          // todo
        } else if ( command === 'edit' && this.currentClickLink ) {
          // todo
        }
      },
      // common
      _substring(str, n, $dot) {
        let r = /[^\x00-\xff]/g;
        if ( str.replace(r, "mm").length <= n ) {
          return str;
        }
        let m = Math.floor(n / 2);
        for( let i = m; i < str.length; i++ ) {
          if ( str.substr(0, i).replace(r, "mm").length >= n ) {
            return str.substr(0, i) + ($dot ? '...' : '');
          }
        }
        return str;
      }
    },
    mounted() {
      setTimeout(e => {
        this.getChain()
      }, 0)
    }
  }
</script>

<style lang="scss">
  @import "../../styles/chart.scss";
</style>
