<template>
  <div>
    <TreeTable
      ref="treetable"
      class="treeTable-warpper"
      @check="checkTree"
      @allOrHalfSelect="allOrHalfSelect"
      :treeConfig="treeConfig"
      :treeData="treeData"
    >
      <template slot="footerBtn">
        <el-button
          icon="el-icon-finished"
          type="primary"
          size="small"
          style="margin: 0 0 0 20px;"
          @click="clickButton"
          :disabled="!checkedNodes.length"
        >关联资源</el-button>
      </template>
    </TreeTable>
  </div>
</template>

<script>
import { TreeTable } from '@/components'
export default {
  name: 'WebIotProjectRelevanceresource',
  components: { TreeTable },
  data() {
    return {
      treeConfig: {
        loading: this.relevanceLoading,
        showCheckbox: true,
        showHeader: true,
        showFooter: true,
        clientWidth: 1630,
        allOrHalfSelect: '',
        props: {
          children: 'childList' //根据这个值遍历节点。
        },
        nodeKey: 'id',
        defaultExpandAll: true,
        headers: [
          { title: '资源名称', field: 'name', showIcon: true, width: '40%' },
          { title: '编码', field: 'code', width: '30%' },
          { title: '路径', field: 'url', width: '30%' }
        ]
      },
      halfCheckedKeys: [],
      checkedNodes: [],
      // 选择的节点ids
      checkedids: [],
      // 包含半选和全选的列表
      allCheckedNodes: [],
      // checkedKeys: []
    }
  },
  props: {
    treeData: {
      type: Array
    },
    relevanceLoading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    relevanceLoading(val) {
      this.treeConfig.loading = val
    }
  },
  methods: {
    checkTree(node) {
      const { checkedNodes, halfCheckedNodes } = node
      this.getAllCheckNodes(checkedNodes, halfCheckedNodes)
    },
    getAllCheckNodes(checkedNodes, halfCheckedNodes) {
      this.checkedNodes = checkedNodes
      this.allCheckedNodes = checkedNodes.concat(halfCheckedNodes)
    },
    clickButton() {
      this.$emit('clickButton', this.allCheckedNodes, this.checkedNodes)
     this.$refs.treetable.setCheckedKeys([])
      this.checkedNodes = []
      this.treeConfig.allOrHalfSelect =''
    },
    allOrHalfSelect(selectNodes) {
      this.getAllCheckNodes(selectNodes, selectNodes)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
