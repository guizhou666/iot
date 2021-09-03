<template>
  <div class="main">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        ref="table"
        class="table"
        :dataList="tableData"
        :getListHandle="getParameter"
        :tableConfig.sync="tableConfig"
        @handleSelectChange="handleSelectChange"
      >
        <template slot="isInner" slot-scope="scope">
          <el-tag :type="scope.row.isInner ? 'primary': 'danger'">{{scope.row.isInner ? '是' : '否'}}</el-tag>
        </template>
        <template slot="updatedTime" slot-scope="scope">
          <span>{{scope.row.updatedTime | day}}</span>
        </template>
        <template slot="operationBtn">
          <el-button
            icon="el-icon-delete"
            :disabled="idList.length<2"
            type="primary"
            @click="invalid('batch')"
            v-has
          >批量删除</el-button>
          <el-button
            icon="el-icon-plus"
            type="primary"
            style="float:right"
            @click="addParameter"
            v-has
          >添加参数</el-button>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-link type="primary" :underline="false" @click="viewParameter(scope.row)" v-has>查看</el-link>
          <el-link type="primary" :underline="false" @click="editParameter(scope.row)" v-has>修改</el-link>
          <el-link
            :type="scope.row.isInner ? 'info' :'danger'"
            :underline="false"
            :disabled="scope.row.isInner == 1"
            @click="invalid('single',scope.row)"
            v-has
          >作废</el-link>
        </template>
      </CommonTable>
    </div>
  </div>
</template>

<script>
import { getParameter, invalidParameter } from '@/api/parameter'
import { AppMainHeader, CommonTable } from '@/components'
import FilterForm from './FilterForm'

export default {
  components: { AppMainHeader, FilterForm, CommonTable },
  data() {
    return {
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
          { title: '参数编码', field: 'code' },
          { title: '参数名称', field: 'name' },
          { title: '值', field: 'value' },
          { title: '备注', field: 'description' },
          { title: '内置标识', tdTemplate: 'isInner' },
          { title: '更新人', field: 'updater' },
          { title: '更新时间', tdTemplate: 'updatedTime' },
          { title: '操作', tdTemplate: 'operation', width: 260 }
        ]
      },
      searchParams: {},
      idList: []
    }
  },
  created() {
    this.getParameter()
  },
  methods: {
    async getParameter() {
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      this.tableConfig.loading = true
      const { code, data, msg } = await getParameter(this.searchParams)
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
      this.getParameter()
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map(item => item.id)
    },
    addParameter() {
      this.$router.push('/parameter/add')
    },
    editParameter(row) {
      this.$router.push({
        path: '/parameter/edit',
        query: {
          id: row.id
        }
      })
    },
    viewParameter(row) {
      this.$router.push({
        path: '/parameter/detail',
        query: {
          id: row.id
        }
      })
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(res => {
        this.invalidParameter(res)
      })
    },
    async invalidParameter(params) {
      const { code, data, msg } = await invalidParameter(params)
      if (code === '200') {
        this.$message.success('作废成功')
        this.onSearch()
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>
