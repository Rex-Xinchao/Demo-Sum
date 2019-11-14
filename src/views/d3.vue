<template>
  <div class="container">
    <Circle-Demo></Circle-Demo>
    <Force-Demo></Force-Demo>
    <Tree-Demo></Tree-Demo>
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

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
