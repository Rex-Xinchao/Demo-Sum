<template>
  <div id="app">
    <router-view/>
    <el-button v-if="$route.name !== 'index'" class="back-btn" size="small" type="primary" @click="back">返回</el-button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .back-btn{
    position: fixed;
    top: 8px;
    right: 8px;
  }
</style>

<style>
  #app {
    position: relative;
  }
  html, body, #app {
    width: 100%;
    height: 100%;
    background: #f5f7f9;
  }
</style>
