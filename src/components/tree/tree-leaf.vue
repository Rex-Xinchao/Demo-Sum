<template>
  <ul class="leaf-tree">
    <li class="leaf-node"
        v-for="(item, index) in nodeList"
        :key="index">
      <div class="tree-leaf-li"
           @contextmenu.prevent="showTooltip($event, item)">
        <span class="icon"
              @click="showMore(item.id)"
              v-html="getIcon(item)">
        </span>
        <Input class="tree-input"
               v-if="isShowInput(item)"
               v-model="item.name"
               @keydown.enter.native="setSelectedId(null)"
               size="small"
               placeholder="small size"/>
        <span class="text" v-else>{{item.name}}</span>
      </div>
      <Leaf-Node  v-if="isShowChildren(item)"
                  :nodeList="item.children"
                  :isEditable="isEditable"
                  :selectedId="selectedId"
      ></Leaf-Node>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'Leaf-Node',
    data() {
      return {
        showMoreList: []
      }
    },
    props: {
      nodeList: {
        required: true
      },
      isEditable: {
        type: Boolean
      },
      selectedId: {
        type: [Number, String]
      }
    },
    watch: {
      selectedId(data) {
        this.nodeList.forEach(item => { // 添加的节点默认展开显示
          item.children && item.children.find(ite => ite.id === data) && this.showMoreList.push(item.id)
        })
        this.nodeList.slice(0) // 深拷贝数组，触发子组件的更新
      }
    },
    methods: {
      // dom相关
      isShowInput(item) {
        return this.selectedId === item.id && this.isEditable
      },
      isShowChildren(item) {
        return item.children && item.children.length > 0 && this.showMoreList.indexOf(item.id) >= 0
      },
      getIcon(item) {
        return item.children && item.children.length > 0 && this.showMoreList.indexOf(item.id) === -1 ? '+' : '-'
      },
      // 与root组件通讯
      setSelectedId(index) {
        this.$eventBus.$emit('selectedId', index)
      },
      showTooltip(e, item) {
        this.$eventBus.$emit('showTooltip', e, item)
      },
      // tree相关
      showMore(id) {
        if (this.showMoreList.indexOf(id) >= 0) {
          this.showMoreList = this.showMoreList.filter(listId => listId !== id)
        } else {
          this.showMoreList.push(id)
        }
      }
    }
  }
</script>
