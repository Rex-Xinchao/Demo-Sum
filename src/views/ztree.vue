<template>
  <div class="container">
    <ZTREE></ZTREE>
  </div>
</template>

<script>
import ZTREE from '@components/ztree/ztree'

export default {
  name: 'ztreeDemo',
  components: { ZTREE }
}
</script>

<style scoped>
  .container {
    width: 300px;
    height: 100%;
    float: left;
  }
</style>
<style>
  @import "../styles/ztree/metroStyle/metroStyle.css";
  @import "../styles/ztree/tooltip.css";
</style>
