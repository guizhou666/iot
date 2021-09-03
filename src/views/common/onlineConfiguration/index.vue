<template>
  <div class="main">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        ref="table"
        class="table"
        :dataList="tableData"
        :getListHandle="getCharts"
        :tableConfig.sync="tableConfig"
        @handleSelectChange="handleSelectChange"
      >
        <template slot="operationBtn">
          <el-button :disabled="idList.length < 2" type="primary" @click="invalid('batch')"
            >生成微服务</el-button
          >
          <el-button :disabled="idList.length < 2" type="primary" @click="invalid('batch')"
            >批量删除</el-button
          >
          <el-button type="primary" style="float: right" @click="addRole">新增</el-button>
        </template>
        <template slot="createdTime" slot-scope="scope">{{
          scope.row.createdTime | day | isNull
        }}</template>
        <template slot="description" slot-scope="scope">{{
          scope.row.description | isNull
        }}</template>
        <template slot="operation" slot-scope="scope">
          <el-link type="primary" :underline="false" @click="editServe(scope.row)"
            >编辑微服务</el-link
          >
          <el-link type="primary" :underline="false" @click="editConfig(scope.row)"
            >编辑配置</el-link
          >
          <el-link type="danger" :underline="false" @click="invalid('sigle', scope.row)"
            >删除</el-link
          >
        </template>
      </CommonTable>
    </div>
    <edit-serve ref="addEditServe"></edit-serve>
    <edit-config ref="editConfig"></edit-config>
  </div>
</template>

<script>
import { getCharts } from '@/api/onlineConfiguration'
import { AppMainHeader, CommonTable } from '@/components'
import EditServe from './addEditServe'
import EditConfig from './editConfig'
import FilterForm from './FilterForm'
import { UPDATE_CACHECOMPONENTS } from '@/store/mutation-types'

export default {
  name: 'templateManagementTable',
  components: { AppMainHeader, FilterForm, CommonTable, EditServe, EditConfig },
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
          { title: '表描述', field: 'description' },
          { title: '版本', field: 'version' },
          { title: '所属微服务', field: 'serve' },
          { title: '创建时间', tdTemplate: 'createdTime', sortable: true },
          { title: '操作', tdTemplate: 'operation', align: 'center' }
        ]
      },
      searchParams: {},
      idList: []
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
    },
    addRole() {
      this.$router.push('/templateManagement/add')
    },
    // 生成微服务
    addServe(row) {
      this.$refs.addEditServe.show('add')
    },
    // 编辑微服务
    editServe(row) {
      this.$refs.addEditServe.show('edit')
    },
    editConfig(row) {
      this.$refs.editConfig.show()
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(async (params) => {
        const { code, data, message } = await delRole(params)
        this.responseHandler(code, data, message).then((res) => {
          this.onSearch()
        })
      })
    },
    async accessConfiguration(row) {
      this.$router.push({
        path: '/templateManagement/access',
        query: {
          id: row.id,
          code: row.code,
          name: row.name
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    const cacleList = [
      '/templateManagement/add',
      '/templateManagement/edit',
      '/templateManagement/detail'
    ]
    if (!cacleList.includes(from.path)) {
      next((vm) => {
        // 避免第一次缓存的时候失效
        vm.$store.commit(UPDATE_CACHECOMPONENTS, [vm.$options.name])
      })
    } else {
      next()
    }
  },

  beforeRouteLeave(to, from, next) {
    const cacleList = [
      '/templateManagement/add',
      '/templateManagement/edit',
      '/templateManagement/detail'
    ]
    if (cacleList.includes(to.path)) {
      this.$store.commit(UPDATE_CACHECOMPONENTS, [this.$options.name])
    } else {
      this.$store.commit(UPDATE_CACHECOMPONENTS, [])
    }
    next()
  }
}
</script>


