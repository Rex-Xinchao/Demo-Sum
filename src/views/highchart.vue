<template>
  <div class="container">
    <Demo2D></Demo2D>
    <Demo3D></Demo3D>
  </div>
</template>

<script>
import Demo2D from '@components/highchart/2d'
import Demo3D from '@components/highchart/3d'

export default {
  name: 'highchart',
  components: { Demo2D, Demo3D }
}
</script>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
