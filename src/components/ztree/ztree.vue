<template>
  <div class="ztree-main">
    <Input search enter-button placeholder="请输入搜索关键词" @on-search="search" />
    <el-button size="small" type="primary" class="save-btn" @click="saveNode">save</el-button>
    <button class="add-classification-btn" @click="addClassification">添加大分类</button>
    <ul id="ztree" class="ztree"></ul>
    <ul ref="tooltip" class="tree-tooltip"
        v-show="isEditable && isShowTip"
        @mouseleave="isShowTip = false">
      <li @click="dialogShow = true">添加节点</li>
      <li @click="changeNodeName">变更名称</li>
      <li @click="delNode">移除节点</li>
    </ul>
    <Add-Node :dialogShow="dialogShow" @change="dialogSave"></Add-Node>
  </div>
</template>

<script>
import '@lib/ztree/jquery.ztree.all'
import '@lib/ztree/jquery.ztree.exhide'
import { fuzzySearch, searchNodeLazy } from '@lib/ztree/fuzzysearch'
import AddNode from './addNode'

export default {
  name: 'zTree',
  data () {
    let vm = this
    return {
      treeSetting: {
        edit: {
          enable: true,
          editNameSelectAll: true,
          showRemoveBtn: false,
          showRenameBtn: false
        },
        view: {
          showLine: false,
          showIcon: false,
          addDiyDom: vm.addSign
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          onRightClick: vm.onRightClick,
          onClick: vm.onLeftClick,
          beforeDrag: vm.beforeDrag,
          beforeDrop: vm.beforeDrop,
          beforeRename: vm.beforeReName
        }
      },
      zNodes: [
        {
          name: '父节点1',
          id: 1,
          rename: true,
          delete: true,
          move: true,
          add: true,
          needMapping: true,
          children: [
            {
              name: '父节点11',
              id: 11,
              children: [
                { name: '叶子节点111', id: 111 },
                { name: '叶子节点112', id: 112 },
                { name: '叶子节点113', id: 113 },
                { name: '叶子节点114', id: 114 }
              ]
            },
            {
              name: '父节点12',
              id: 12,
              children: [
                { name: '叶子节点121', id: 121 },
                { name: '叶子节点122', id: 122 },
                { name: '叶子节点123', id: 123 },
                { name: '叶子节点124', id: 124 }
              ]
            },
            { name: '父节点13', id: 13 }
          ]
        },
        {
          name: '父节点2',
          id: 2,
          rename: true,
          delete: false,
          move: false,
          add: false,
          needMapping: false,
          children: [
            {
              name: '父节点21',
              id: 21,
              rename: false,
              delete: true,
              move: false,
              add: false,
              needMapping: false,
              children: [
                { name: '叶子节点211', id: 211 },
                { name: '叶子节点212', id: 212 },
                { name: '叶子节点213', id: 213 },
                { name: '叶子节点214', id: 214 }
              ]
            },
            {
              name: '父节点22',
              id: 22,
              rename: false,
              delete: false,
              move: false,
              add: true,
              needMapping: false,
              children: [
                {
                  name: '叶子节点221',
                  id: 221,
                  rename: false,
                  delete: false,
                  move: false,
                  add: true,
                  needMapping: false
                },
                {
                  name: '叶子节点222',
                  id: 222,
                  rename: false,
                  delete: false,
                  move: false,
                  add: true
                },
                {
                  name: '叶子节点223',
                  id: 223,
                  rename: false,
                  delete: false,
                  move: false,
                  add: true
                },
                {
                  name: '叶子节点224',
                  id: 224,
                  rename: false,
                  delete: false,
                  move: false,
                  add: true
                }
              ]
            },
            {
              name: '父节点23',
              id: 23,
              children: [
                { name: '叶子节点231', id: 231 },
                { name: '叶子节点232', id: 232 },
                { name: '叶子节点233', id: 233 },
                { name: '叶子节点234', id: 234 }
              ]
            }
          ]
        },
        {
          name: '父节点3',
          id: 3,
          rename: false,
          delete: false,
          move: false,
          add: true,
          needMapping: false
        }

      ],
      isShowTip: false,
      isEditable: true,
      selectedItem: null,
      selectedNode: null,
      dialogShow: false
    }
  },
  components: { AddNode },
  methods: {
    search (data) {
      searchNodeLazy(data) // 根据关键词进行模糊搜索
    },
    // treeEvent
    initTree () {
      $.fn.zTree.init($('#ztree'), this.treeSetting, this.zNodes)
      fuzzySearch('ztree') // 初始化模糊搜索方法
    },
    onLeftClick (event, treeId, treeNode) {
      $.fn.zTree.getZTreeObj('ztree').expandNode(treeNode)
    },
    onRightClick (event, treeId, treeNode, clickFlag) {
      $.fn.zTree.getZTreeObj('ztree').selectNode(treeNode)
      this.showTooltip(event, treeNode)
    },
    addSign (treeId, treeNode) {
      const $node = $('#' + treeNode.tId)
      if (treeNode.add) {
        $node.append('<span class=\'tree-sign\'>[新增]</span>')
      }
      if (treeNode.delete) {
        $node.append('<span class=\'tree-sign\'>[删除]</span>')
      }
      if (treeNode.move) {
        $node.append('<span class=\'tree-sign\'>[移动]</span>')
      }
      if (treeNode.rename) {
        $node.append('<span class=\'tree-sign\'>[更名]</span>')
      }
      if (treeNode.needMapping) {
        $node.append('<span class=\'tree-sign\'>[未映射]</span>')
      }
    },
    // 节点操作
    addClassification () {
      const newNode = {
        name: '请输入节点名称',
        id: `add${new Date().getTime()}`
      }
      const node = $.fn.zTree.getZTreeObj('ztree').addNodes(null, newNode)
      console.log(node)
      $.fn.zTree.getZTreeObj('ztree').editName(node[0])
    },
    findNode (item) {
      const treeObj = $.fn.zTree.getZTreeObj('ztree')
      const node = treeObj.getNodesByFilter(function (node) {
        return (node.id === item.id)
      }, true) // 仅查找一个节点
      return node
    },
    addLeafNode (params, node) {
      $.fn.zTree.getZTreeObj('ztree').addNodes(node, {
        id: `add${new Date().getTime()}`,
        pId: node.id,
        name: params.nodeName
      })
      this.isShowTip = false
    },
    changeNodeName () {
      $.fn.zTree.getZTreeObj('ztree').editName(this.selectedNode)
      this.isShowTip = false
    },
    delNode () {
      if (this.selectedNode && this.selectedNode.children && this.selectedNode.children.length > 0) {
        this.$message.error('不能删除有子节点的父节点')
        return
      }
      $.fn.zTree.getZTreeObj('ztree').removeNode(this.selectedNode, null)
      this.isShowTip = false
    },
    saveNode () {
      const treeData = $.fn.zTree.getZTreeObj('ztree').getNodes() // 获取树全部节点数据
    },
    // 拖拽操作
    beforeDrag (treeId, treeNodes) {
      return true
    },
    beforeDrop (treeId, treeNodes, targetNode, moveType) {
      return true
    },
    beforeReName (treeId, treeNode, newName, isCancel) {
      if (newName.length === 0) {
        this.$message.error('节点名称不能为空')
        return false
      }
      return true
    },
    // tooltipEvent
    showTooltip (e, item) {
      this.isShowTip = true
      this.selectedItem = item
      this.selectedNode = this.findNode(this.selectedItem)
      this.$refs.tooltip.style.left = e.clientX + 'px'
      this.$refs.tooltip.style.top = e.clientY - 40 + 'px'
    },
    // dialogEvent
    dialogSave (form) {
      this.dialogShow = false
      if (!form || form === undefined) {
        return
      }
      if (form.isEmpty) {
        const addNode = this.findNode(this.selectedItem)
        this.addLeafNode(form, addNode)
      } else {
        form.productName.forEach(item => {
          const addNode = this.findNode({ id: item })
          this.addLeafNode(form, addNode)
        })
      }
    }
  },
  mounted () {
    this.initTree()
  }
}
</script>

<style lang="scss" scoped>
  .save-btn {
    float: right;
    padding: 8px 12px;
    margin-top: 16px;
  }

  .add-classification-btn {
    width: calc(100% - 16px);
    height: 28px;
    line-height: 28px;
    text-align: center;
    border: 1px #cccccc dashed;
    background-color: white;
    margin: 12px 8px;
    cursor: pointer;
    outline: none;
  }
</style>
