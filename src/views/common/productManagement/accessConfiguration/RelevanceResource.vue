<template>
  <div>
    <TreeTable
      ref="treetable"
      class="treeTable-warpper"
      :treeConfig="treeConfig"
      :treeData="treeData"
      @change="changeTree"
      @check="checkTree"
      @allOrHalfSelect="allOrHalfSelect"
    >
      <template slot="footerBtn">
        <el-button
          icon="el-icon-refresh-left"
          type="primary"
          size="small"
          style="margin: 0 0 0 20px"
          @click="clickButton"
          :disabled="!checkedNodes.length"
          >取消关联</el-button
        >
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
        showUpDown: true,
        showRename: true,
        showHeader: true,
        showFooter: true,
        allOrHalfSelect: '',
        clientWidth: 1630,
        props: {
          children: 'childList' //根据这个值遍历节点。
        },
        nodeKey: 'id',
        defaultExpandAll: true,
        headers: [
          { title: '资源名称', field: 'name', showIcon: true, width: '25%' },
          { title: '资源别名', field: 'resourceAlias', width: '20%' },
          { title: '编码', field: 'code', width: '20%' },
          { title: '路径', field: 'url', width: '15%' },
          { title: '操作', tdTemplate: 'operation', width: '20%' }
        ]
      },
      allCheckedNodes: [],
      checkedNodes: []
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
    changeTree(val) {
      this.$emit('change', val)
    },
    allOrHalfSelect(selectNodes) {
      this.getAllCheckNodes(selectNodes, [])
    }
  }
}
</script>

