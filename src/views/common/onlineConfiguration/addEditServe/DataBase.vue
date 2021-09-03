<template>
  <div class="main">
    <CommonTable
      ref="table"
      class="table"
      :dataList="tableData"
      :getListHandle="getCharts"
      :tableConfig.sync="tableConfig"
      @handleSelectChange="handleSelectChange"
    >
      <template slot="description" slot-scope="scope">{{
        scope.row.description | isNull
      }}</template>
    </CommonTable>
  </div>
</template>

<script>
import { getCharts } from '@/api/onlineConfiguration'
import { CommonTable } from '@/components'

export default {
  name: 'templateManagementTable',
  components: { CommonTable },
  data() {
    return {
      tableData: [],
      tableConfig: {
        id: 'assetsCenter-categoryAssets',
        pageSize: 10,
        pageNum: 1,
        total: 0,
        pageSizeOptions: [5, 10, 100, 200, 500],
        border: false,
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: '表类型', field: 'type' },
          { title: '表名', field: 'name' },
          { title: '表描述', field: 'description' }
        ]
      },
      idList: [],
      searchParams: {}
    }
  },
  created() {
    this.getCharts()
  },
  activated() {
    this.getCharts()
  },
  methods: {
    async getCharts() {
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      this.tableConfig.loading = true
      const { code, data, message } = await getCharts(this.searchParams)
      if (code === '200') {
        this.tableConfig.loading = false
        this.tableData = data.records
        this.tableConfig.total = data.total
      } else {
        this.tableConfig.loading = false
      }
    },
    onSearch(params) {
      this.tableConfig.pageNum = 1
      Object.assign(this.searchParams, params)
      this.getCharts()
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map((item) => item.id)
    }
  }
}
</script>


