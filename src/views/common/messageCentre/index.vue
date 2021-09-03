<template>
  <div class="main">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        class="table"
        :dataList="tableData"
        :getListHandle="_getLoginLogs"
        :tableConfig.sync="tableConfig"
        @row-click="viewDetail"
      >
        <template slot="operationBtn">
          <el-button
            icon="el-icon-delete"
            :disabled="idList.length<2"
            type="primary"
            @click="openDelbox('batch')"
            v-has
          >批量删除</el-button>
          <el-button
            icon="el-icon-document-checked"
            :disabled="idList.length<2"
            type="primary"
            @click="openDelbox('batch')"
            v-has
          >标记已读</el-button>
        </template>
        <template slot="operation" slot-scope="scope">
            <el-link @click="editRole(scope.row)" v-has type="primary">查看</el-link>
           <el-link @click="deleteMessage('sigle',scope.row)" v-has type="danger">删除</el-link>
        </template>
      </CommonTable>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable } from '@/components'
import { getLoginLog } from '@/api/logs'
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
        pageSize: 5,
        pageNum: 1,
        total: 0,
        border: false,
        pageSizeOptions: [5, 10, 100, 200, 500],
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: this.$t('messageCenter.status'), field: 'createdTime' },
          { title: this.$t('messageCenter.messageType'), field: 'realName' },
          { title: this.$t('messageCenter.messageSource'), field: 'userAccount' },
          { title: this.$t('messageCenter.moduleName'), field: 'appId' },
          { title: this.$t('messageCenter.title'), field: 'roleNames', width: 400 },
          { title: this.$t('messageCenter.sendTime'), field: 'roleNames' },
          { title: this.$t('opraction'), tdTemplate: 'operation', width: 100 }
        ]
      }
    }
  },
  created() {
    this._getLoginLogs()
  },
  mounted() {},
  methods: {
    async _getLoginLogs() {
      this.tableConfig.loading = true
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      const { code, data, msg } = await getLoginLog(this.searchParams)
      if (code === '200') {
        this.tableData = data.records
        this.tableConfig.total = data.total
        this.tableConfig.loading = false
      }
    },
    onSearch(params) {
      this.tableConfig.current = 1
      Object.assign(this.searchParams, params)
      this._getLoginLogs()
    },
    // 删除操作
    deleteMessage() {
      this.$confirm('确定要删除数据, 是否继续?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then()
    },
    // 查看详情
    viewDetail() {
      this.$router.push({ path: '/messageCentre/detail' })
    }
  }
}
</script>

<style lang="scss">
.text {
  @include font_color('font_color1');
}
</style>
