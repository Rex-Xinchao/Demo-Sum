<template>
  <div class="container">
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
  .container {
    width: 300px;
    height: 100%;
    float: left;
    background-color: white;
  }
</style>
<style lang="scss">
  @import "../styles/tree/tree";
</style>
