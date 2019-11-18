<template>
  <div id="app">
    <router-view/>
    <el-button v-if="$route.name !== 'index'" class="back-home-btn" size="small" type="primary" @click="back">返回</el-button>
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

<style lang="scss">
  @import "./styles/main";
</style>
