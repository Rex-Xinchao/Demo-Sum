<template>
  <div class="container">
    <div class="container-item">
      <span class="text">弦图</span>
      <Circle-Demo></Circle-Demo>
    </div>
    <div class="container-item">
      <span class="text">力引导图</span>
      <Force-Demo></Force-Demo>
    </div>
    <div class="container-item">
      <span class="text">树图</span>
      <Tree-Demo></Tree-Demo>
    </div>
  </div>
</template>

<script>
import CircleDemo from '@components/d3/circle'
import ForceDemo from '@components/d3/force'
import TreeDemo from '@components/d3/tree'

export default {
  name: 'd3Demo',
  components: { CircleDemo, ForceDemo, TreeDemo }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 400px;
    justify-items: center;

    .container-item {
      overflow: hidden;
      border: 1px solid #cccccc;
      position: relative;

      .text{
        position: absolute;
        top: 0;
        left: 0;
      }
    }

    .container-item + .container-item{
      border-bottom: none;
    }
  }
</style>
<style>
  .links line {
    stroke: #999;
    stroke-opacity: 0.6;
  }

  .nodes circle {
    stroke: #fff;
    stroke-width: 1.5px;
  }
</style>
