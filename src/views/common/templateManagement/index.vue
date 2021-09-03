<template>
  <div class="main">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        ref="table"
        class="table"
        :dataList="tableData"
        :getListHandle="getTemplage"
        :tableConfig.sync="tableConfig"
        @handleSelectChange="handleSelectChange"
      >
        <template slot="operationBtn">
          <el-button :disabled="idList.length<2" type="primary" @click="invalid('batch')" >批量作废</el-button>
          <el-button type="primary" style="float:right" @click="addRole" >添加模板</el-button>
        </template>
        <template slot="createdTime" slot-scope="scope">{{ scope.row.createdTime | day | isNull }}</template>
        <template slot="description" slot-scope="scope">{{ scope.row.description | isNull }}</template>
        <template slot="operation" slot-scope="scope">
          <el-link type="primary" :underline="false" @click="editRole(scope.row)" >查看</el-link>
          <el-link type="primary" :underline="false" @click="editRole(scope.row)" >编辑</el-link>
          <el-link type="danger" :underline="false" @click="invalid('sigle',scope.row)" >作废</el-link>
        </template> 
      </CommonTable>
    </div>
  </div>
</template>

<script>
import { getTemplage } from '@/api/template'
import { AppMainHeader, CommonTable } from '@/components'
import FilterForm from './FilterForm'
import { UPDATE_CACHECOMPONENTS } from '@/store/mutation-types'

export default {
  name: 'templateManagementTable',
  components: { AppMainHeader, FilterForm, CommonTable },
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
          { title: '模板编码', field: 'code' },
          { title: '模板名称', field: 'name' },
          { title: '模板类型', field: 'type' },
          { title: '备注', field: 'description' },
          { title: '更新时间', tdTemplate: 'createdTime' },
          { title: '操作', tdTemplate: 'operation', width: 200, align: 'center' }
        ]
      },
      searchParams: {},
      idList: []
    }
  },
  created() {
    this.getTemplage()
  },
  activated() {
    this.getTemplage()
  },
  methods: {
    async getTemplage() {
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      this.tableConfig.loading = true
      const { code, data, message } = await getTemplage(this.searchParams)
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
      this.getTemplage()
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map(item => item.id)
    },
    addRole() {
      this.$router.push('/templateManagement/add')
    },
    editRole(row) {
      this.$router.push({
        path: '/templateManagement/edit',
        query: {
          id: row.id
        }
      })
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(async params => {
        const { code, data, message } = await delRole(params)
        this.responseHandler(code, data, message).then(res => {
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
    const cacleList = ['/templateManagement/add', '/templateManagement/edit', '/templateManagement/detail']
    if (!cacleList.includes(from.path)) {
      next(vm => {
        // 避免第一次缓存的时候失效
        vm.$store.commit(UPDATE_CACHECOMPONENTS, [vm.$options.name])
      })
    } else {
      next()
    }
  },

  beforeRouteLeave(to, from, next) {
    const cacleList = ['/templateManagement/add', '/templateManagement/edit', '/templateManagement/detail']
    if (cacleList.includes(to.path)) {
      this.$store.commit(UPDATE_CACHECOMPONENTS, [this.$options.name])
    } else {
      this.$store.commit(UPDATE_CACHECOMPONENTS, [])
    }
    next()
  }
}
</script>


