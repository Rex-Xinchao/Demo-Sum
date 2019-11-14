<template>
  <div class="tree-main scrollbar_box">
    <ul class="root-tree">
      <li class="root-node"
          v-for="(item, index) in treeList"
          :key="index">
        <div class="tree-root-li"
             @contextmenu.prevent="showTooltip($event, item)">
          <span class="icon"
                @click="showMore(item)"
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
        <Tree-Node v-if="isShowChildren(item)"
                   :nodeList="item.children"
                   :isEditable="isEditable"
                   :selectedId="selectedId">
        </Tree-Node>
      </li>
    </ul>
    <ul ref="tooltip" class="tree-tooltip"
        v-show="isEditable && isShowTip"
        @mouseleave="isShowTip = false">
      <li @click="updateNode()">添加节点</li>
      <li @click="changeNodeName">变更名称</li>
      <li @click="updateNode('del')">移除节点</li>
    </ul>
  </div>
</template>

<script>
import TreeNode from './tree-leaf'

export default {
  name: 'Tree-Root',
  data () {
    return {
      treeList: [],
      showMoreList: [],
      selectedId: null,
      selectedItem: {},
      isEditable: true,
      isShowTip: false
    }
  },
  components: { TreeNode },
  watch: {
    selectedId (data) {
      this.treeList.forEach(item => {
        item.children && item.children.find(ite => ite.id === data) && this.showMoreList.push(item.id)
      })
    }
  },
  methods: {
    // dom相关
    isShowInput (item) {
      return this.selectedId === item.id && this.isEditable
    },
    isShowChildren (item) {
      return item.children && item.children.length > 0 && this.showMoreList.indexOf(item.id) >= 0
    },
    getIcon (item) {
      return item.children && item.children.length > 0 && this.showMoreList.indexOf(item.id) === -1 ? '+' : '-'
    },
    // tree-operation
    showMore (item) {
      if (this.showMoreList.indexOf(item.id) >= 0) {
        this.showMoreList = this.showMoreList.filter(listId => listId !== item.id)
      } else {
        this.showMoreList.push(item.id)
      }
    },
    changeNodeName () {
      this.setSelectedId(this.selectedItem.id)
      this.isShowTip = false
    },
    updateNode (type = 'add') {
      const addNode = {
        name: '节点',
        id: `addNode${new Date().getTime()}`,
        parentId: this.selectedItem.id
      }
      this.findNode(this.treeList, this.selectedItem.id, type, addNode)
      this.treeList = this.treeList.slice(0) // 深拷贝数组，触发子组件的更新
      this.isShowTip = false
    },
    findNode (list, id, type, addItem) {
      let aim = null
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          aim = list[i]
          if (type === 'del') {
            list.splice(i, 1)
            this.selectedId = new Date().getTime()
          } else if (type === 'add') {
            !list[i].children && (list[i].children = []) // 创建children属性
            list[i].children.push(addItem)
            this.selectedId = addItem.id // 添加的节点默认选中
          }
        } else if (!aim && list[i].children) {
          aim = this.findNode(list[i].children, id, type, addItem) // 遍历子节点
        }
      }
      return aim
    },
    setSelectedId (index) {
      if (index !== null) {
        this.selectedId = index
        return
      }
      this.selectedId = null
    },
    // tooltip
    showTooltip (e, item) {
      this.isShowTip = true
      this.selectedItem = item
      this.$refs.tooltip.style.left = e.clientX + 'px'
      this.$refs.tooltip.style.top = (e.clientY - 80 <= 0 ? 10 : e.clientY - 80) + 'px'
    }
  },
  mounted () {
    // 与所有leaf组件的通讯
    this.$eventBus.$on('showTooltip', this.showTooltip)
    this.$eventBus.$on('selectedId', this.setSelectedId)
    // mock数据
    this.treeList = [
      {
        name: '根节点A',
        id: 1,
        parentId: 0,
        level: 1,
        children: [
          {
            name: '叶子节点C',
            id: 3,
            parentId: 1,
            level: 2,
            children: [
              {
                name: '叶子节点E',
                parentId: 3,
                id: 5,
                level: 3
              }
            ]
          }
        ]
      }, {
        name: '根节点B',
        id: 2,
        level: 1,
        parentId: 0,
        children: [
          {
            name: '叶子节点D',
            parentId: 2,
            level: 2,
            id: 4
          }
        ]
      }]
  }
}
</script>
