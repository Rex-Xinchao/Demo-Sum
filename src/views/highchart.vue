<template>
  <div class="container">
    <div class="container-item">
      <Demo2D></Demo2D>
    </div>
    <div class="container-item">
      <Demo3D></Demo3D>
    </div>
  </div>
</template>

<script>
import Demo2D from '@components/highchart/2d'
import Demo3D from '@components/highchart/3d'

export default {
  name: 'highChart',
  components: { Demo2D, Demo3D }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 45% 55%;
    justify-items: center;

    .container-item {
      overflow: hidden;
      border: 1px solid #cccccc;
    }

    .container-item + .container-item {
      border-bottom: none;
    }
  }
</style>
