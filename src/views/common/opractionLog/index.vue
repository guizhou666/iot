<template>
  <div class="main">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        class="table"
        :dataList="tableData"
        :getListHandle="_getOpractionLog"
        :tableConfig.sync="tableConfig"
      ></CommonTable>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable } from '@/components'
import { getOpractionLog } from '@/api/logs'
import FilterForm from './FilterForm'
export default {
  name: 'PersonalFile',
  components: { AppMainHeader, FilterForm, CommonTable },
  data() {
    return {
      idList: [],
      searchParams: {},
      tableData: [],
      tableConfig: {
        id: 'assetsCenter-categoryAssets',
        pageSize: 10,
        pageNum: 1,
        total: 0,
        border: false,
        pageSizeOptions: [5, 10, 100, 200, 500],
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: false,
        headers: [
          { title: this.$t('log.logTime'), field: 'createdTime' },
          { title: this.$t('log.name'), field: 'realName' },
          { title: this.$t('log.username'), field: 'userAccount' },
          { title: 'IP', field: 'client' },
          { title: this.$t('log.opractionModules'), field: 'module' },
          { title: this.$t('log.opractionType'), field: 'bizType' },
          { title: this.$t('log.opractionObj'), field: 'roleNames' },
          { title: this.$t('log.describe'), field: 'description' }
        ]
      }
    }
  },
  created() {
    this._getOpractionLog()
  },
  mounted() {},
  methods: {
    async _getOpractionLog() {
      this.tableConfig.loading = true
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      const { code, data, msg } = await getOpractionLog(this.searchParams)
      if (code === '200') {
        this.tableData = data.records
        this.tableConfig.total = data.total
        this.tableConfig.loading = false
      }
    },
    onSearch(params) {
      this.tableConfig.pageNum = 1
      Object.assign(this.searchParams, params)
      this._getOpractionLog()
    }
  }
}
</script>

<style lang="scss">
.text {
  @include font_color('font_color1');
}
</style>