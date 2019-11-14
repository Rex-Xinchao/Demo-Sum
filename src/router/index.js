import Vue from 'vue'
import Router from 'vue-router'
import index from '@views/index'
import ztreeDemo from '@views/ztree'
import treeDemo from '@views/tree'
import d3Demo from '@views/d3'
import highchart from '@views/highchart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/ztree',
      name: 'ztreeDemo',
      component: ztreeDemo
    },
    {
      path: '/tree',
      name: 'treeDemo',
      component: treeDemo
    },
    {
      path: '/d3',
      name: 'd3Demo',
      component: d3Demo
    },
    {
      path: '/highchart',
      name: 'highchart',
      component: highchart
    }
  ]
})
