<template>
  <CommonTable class="table" :dataList="tableData" :getListHandle="getProductCondtion" :tableConfig.sync="tableConfig">
    <template slot="isEnabled" slot-scope="scope">
      <el-tag :type="scope.row.isEnabled===1 ? 'success':'danger'">{{scope.row.isEnabled === 1 ? '启用' : '禁用'}}</el-tag>
    </template>
    <template slot="createdTime" slot-scope="scope">
      <span>{{ format(scope.row.createdTime) | isNull }}</span>
    </template>
  </CommonTable>
</template>

<script>
import { CommonTable } from '@/components'
import { getProductCondtion } from '@/api/productManage'
export default {
  components: {
    CommonTable
  },
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      tableData: [],
      tableConfig: {
        id: 'assetsCenter-categoryAssets',
        pageSize: 5,
        pageNum: 1,
        total: 0,
        border: true,
        pageSizeOptions: [5, 10, 100, 200, 500],
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: 'APPID', field: 'appId' },
          { title: '产品名称', field: 'realName' },
          { title: '产品编码', field: 'code' },
          { title: '产品状态', tdTemplate: 'isEnabled' },
          { title: '添加时间', tdTemplate: 'createdTime' }
        ]
      }
    }
  },
  created() {
    this.getProductCondtion()
  },
  methods: {
    getProductCondtion() {
      this.tableConfig.loading = true
      const params = {
        id: this.id,
        size: this.tableConfig.pageSize,
        current: this.tableConfig.pageNum
      }

      getProductCondtion(params).then((res) => {
        if (res.code === '200') {
          this.tableData = res.data.records
          this.tableConfig.total = res.data.total
        }
        this.tableConfig.loading = false
      })
    },
    format(time) {
      if (!time) return
      return time.split(' ')[0]
    }
  }
}
</script>

<style>
</style>
