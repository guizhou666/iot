<template>
  <div class="main">
    <!-- <AppMainHeader title="产品管理"></AppMainHeader> -->
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable ref="table" class="table" :dataList="tableData" :getListHandle="getProducts" :tableConfig.sync="tableConfig" @handleSelectChange="handleSelectChange" :selectKey="{
          id: 'id',
          name: ['realName']
        }">
        <template slot="operationBtn">
          <el-button :disabled="idList.length < 2" type="primary" @click="invalid('batch')" v-has>批量作废</el-button>
          <el-button :disabled="idList.length < 2" type="primary" @click="disabled('batch')" v-has>批量禁用</el-button>
          <el-button :disabled="idList.length < 2" type="primary" @click="enabled('batch')" v-has>批量启用</el-button>
          <el-button type="primary" style="float: right" @click="addProduct" v-has>添加产品</el-button>
        </template>
        <template slot="isEnabled" slot-scope="scope">
          <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">{{
            scope.row.isEnabled ? '已启用' : '已禁用'
          }}</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-link type="primary" :underline="false" @click="updateProduct(scope.row)" v-has>更新</el-link>
          <el-link type="primary" :underline="false" @click="viewProduct(scope.row)" v-has>查看</el-link>
          <el-link type="primary" :underline="false" @click="editProduct(scope.row)" v-has>修改</el-link>
          <el-link type="primary" :underline="false" @click="accessConfiguration(scope.row)">资源配置</el-link>
          <el-link type="danger" :underline="false" v-show="scope.row.isEnabled" @click="disabled('sigle', scope.row)" v-has>禁用</el-link>
          <el-link type="primary" :underline="false" v-show="!scope.row.isEnabled" @click="enabled('sigle', scope.row)" v-has>启用</el-link>
          <el-link type="danger" :underline="false" @click="invalid('sigle', scope.row)" v-has>作废</el-link>
        </template>
      </CommonTable>
    </div>
  </div>
</template>

<script>
import { getProducts, delProduct, enabledProduct } from '@/api/productManage'
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
        pageSizeOptions: [5, 10, 100, 200, 500],
        border: false,
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: 'APPID', field: 'appId' },
          { title: '产品名称', field: 'realName' },
          { title: '产品编码', field: 'code' },
          { title: '版本号', field: 'version' },
          { title: '产品状态', tdTemplate: 'isEnabled' },
          { title: '操作', tdTemplate: 'operation' }
        ]
      },
      searchParams: {},
      idList: []
    }
  },
  created() {
    this.getProducts()
  },
  methods: {
    async getProducts() {
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      this.tableConfig.loading = true
      const { code, data, msg } = await getProducts(this.searchParams)
      if (code === '200') {
        this.tableConfig.loading = false
        this.tableData = data.records
        this.tableConfig.total = data.total
      } else {
        this.tableConfig.loading = false
      }
    },
    onSearch(params) {
      Object.assign(this.searchParams, params)
      this.tableConfig.pageNum = 1
      this.getProducts()
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map((item) => item.id)
    },
    addProduct() {
      this.$router.push('/productManagement/add')
    },
    editProduct(row) {
      this.$router.push({
        path: '/productManagement/edit',
        query: {
          id: row.id
        }
      })
    },
    updateProduct(row) {
      this.$router.push({
        path: '/productManagement/update',
        query: {
          id: row.id
        }
      })
    },
    viewProduct(row) {
      this.$router.push({
        path: '/productManagement/detail',
        query: {
          id: row.id
        }
      })
    },
    enabled(type, row) {
      this.$refs.table.enabled(type, row).then(async (params) => {
        const { code, data, message } = await enabledProduct(params)
        this.getProducts()
      })
    },
    disabled(type, row) {
      this.$refs.table.disabled(type, row).then(async (params) => {
        const { code, data, message } = await enabledProduct(params)
        this.getProducts()
      })
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(async (params) => {
        const { code, data, message } = await delProduct(params)
        this.responseHandler(code, data, message)
        this.getProducts()
      })
    },
    async accessConfiguration(row) {
      this.$router.push({
        path: '/productManagement/access',
        query: {
          id: row.id
          // code: row.code,
          // name: row.name
        }
      })
    }
  }
}
</script>

