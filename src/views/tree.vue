<template>
  <div class="main-box">
    <Tree></Tree>
  </div>
</template>

<script>
import Tree from '@components/tree/tree-root'

export default {
  name: 'treeDemo',
  components: { Tree }
}
</script>

<style scoped>
  .main-box {
    width: 300px;
    height: 100%;
    float: left;
  }
</style>
