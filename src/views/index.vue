<template>
  <div class="container">
    <ul class="categroy">
      <li class="title">目录</li>
      <li v-for="(item, index) in categroy" :key="index">
        <router-link :to="item.to">{{item.name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      categroy: [
        { name: 'treeDemo', to: '/tree' },
        { name: 'ztreeDemo', to: '/ztree' },
        { name: 'd3Demo', to: '/d3' },
        { name: 'highchartDemo', to: '/highchart' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    height: 100%;
    flex-direction: row;
    align-content: center;
    align-items: center;
    justify-content: center;
  }

  .categroy {
    flex: 100%;
    height: 500px;

    .title {
      font-size: 30px;
      font-weight: bolder;
      margin-bottom: 50px;
    }

    li {
      display: block;
      height: 22px;
      margin-bottom: 12px;
      line-height: 22px;
      font-size: 22px;
      text-align: center;
      list-style: none;
    }
  }
</style>
