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
<style>
  /*tree root*/
  .tree-main {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    border: 1px solid #ccc;
    overflow-y: scroll;
  }

  .tree-main .root-tree {
    display: block;
    width: 100%;
    height: auto;
    padding: 12px 18px;
    line-height: 28px;
  }

  .tree-main .root-tree .root-node {
    display: block;
    width: 100%;
    height: auto;
    line-height: 28px;
  }

  .root-node .tree-root-li {
    display: flex;
    cursor: default;
  }

  .tree-root-li .text, .tree-input {
    flex: 1;
  }

  .root-node .tree-root-li:hover .text {
    color: #2d8cf0;
  }

  .tree-root-li .icon {
    color: aqua;
    width: 20px;
    cursor: pointer;
  }

  /*tree node*/
  .leaf-tree {
    display: block;
    width: 100%;
    height: auto;
    line-height: 28px;
  }

  .leaf-tree .leaf-node {
    display: block;
    width: 100%;
    line-height: 28px;
    padding-left: 8px;
  }

  .leaf-tree .leaf-node .tree-leaf-li {
    display: flex;
    cursor: default;
  }

  .tree-leaf-li .text, .tree-input {
    flex: 1;
  }

  .leaf-tree .leaf-node .tree-leaf-li:hover .text {
    color: #2d8cf0;
  }

  .tree-leaf-li .icon {
    color: aqua;
    width: 20px;
    cursor: pointer;
  }

  /*操作栏*/
  .tree-main .tree-tooltip {
    display: block;
    width: 120px;
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0;
    margin: 0 auto;
    z-index: 1000;
  }

  .tree-main .tree-tooltip li {
    display: block;
    font-size: 16px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }

  .tree-main .tree-tooltip li:hover {
    background-color: #cccccc;
    color: #2d8cf0;
  }

  .scrollbar_box::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    border: none;

  }

  .scrollbar_box::-webkit-scrollbar-track {
    background-color: white;
    border: none;

  }

  .scrollbar_box::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: deepskyblue;
  }


</style>
