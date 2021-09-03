<template>
  <div>
    <TreeTable
      ref="treetable"
      class="treeTable-warpper"
      :treeConfig="treeConfig"
      :treeData="treeData"
      :defaultCheckedKeys="defaultCheckedKeys"
      @changeTree="changeTree"
    ></TreeTable>
  </div>
</template>

<script>
import { deepCopy, flat, toTree } from '@/utils'
import { TreeTable } from '@/components'
import { getRelevanceResource } from '@/api/resourceManage'
export default {
  name: 'WebIotProjectRelevanceresource',
  components: { TreeTable },
  data() {
    return {
      treeConfig: {
        loading: false,
        showCheckbox: true,
        showRename: true,
        showUpDown: true,
        showHeader: true,
        showFooter: false,
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
          { title: '路径', field: 'url', width: '20%' },
          { title: '操作', tdTemplate: 'operation', width: '15%' }
        ]
      },
      defaultCheckedKeys: [],
      treeData: []
    }
  },
  props: {
    appId: {
      type: String
    }
  },
  watch: {
    appId(val, oldVal) {
      if (val) {
        this.getRelevanceResource()
      } else {
        this.treeData = []
      }
    },
    immediate: true
  },
  methods: {
    // 查询全部资源
    async getRelevanceResource() {
      this.treeConfig.loading = true
      const { code, data, msg } = await getRelevanceResource({
        id:this.$route.name=='Edit' ? this.$route.query.productId : this.appId
      })
      this.treeConfig.loading = false
      if (code === '200') {
        this.treeData = data
        if (this.$route.name == 'Edit') {
          this.getDefaultCheckedKeys(data)
        }
      }
    },
    getDefaultCheckedKeys(initialResource) {
      let flatData = flat(deepCopy(initialResource))
      flatData.map(item => {
        if (item.checking == 1) {
          this.defaultCheckedKeys.push(item.id)
        }
      })
    },
    changeTree(val) {
      this.$emit('changeTree', val)
    }
  }
}
</script>
