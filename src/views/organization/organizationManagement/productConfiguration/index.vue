<template>
  <div class="product-warpper">
    <div class="app-content-wrap">
      <CommonTable
        ref="table"
        class="table"
        :dataList="tableData"
        :getListHandle="getProducts"
        :tableConfig.sync="tableConfig"
        @handleSelectChange="handleSelectChange"
        :selectKey="{
          id: 'id',
          name: ['realName','parentDisplayName']
        }"
      >
        <template v-if="type !== 'detail'" slot="operationBtn">
          <el-button
            icon="el-icon-delete"
            :disabled="idList.length<2"
            type="primary"
            @click="invalid('batch')"
          >批量作废</el-button>
          <el-button
            icon="el-icon-iot-jinyong1"
            :disabled="idList.length<2"
            type="primary"
            @click="disabled('batch')"
          >批量禁用</el-button>
          <el-button
            icon="el-icon-video-play"
            :disabled="idList.length<2"
            type="primary"
            @click="enabled('batch')"
          >批量启用</el-button>
          <el-button icon="el-icon-plus" type="primary" style="float:right" @click="addProduct">添加产品</el-button>
        </template>

        <template slot="isEnabled" slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled" type="success">已启用</el-tag>
          <el-tag v-else type="danger">已禁用</el-tag>
        </template>

        <template slot="operation" slot-scope="scope">
          <el-link type="primary" :underline="false" @click="viewProduct(scope.row)">查看</el-link>
          <template v-if="type !== 'detail'">
            <el-link type="primary" :underline="false" @click="editProduct(scope.row)">修改</el-link>
            <el-link
              type="primary"
              :underline="false"
              v-show="!scope.row.isEnabled"
              @click="enabled('single', scope.row)"
            >启用</el-link>
            <el-link
              type="danger"
              :underline="false"
              v-show="scope.row.isEnabled"
              @click="disabled('single', scope.row)"
            >禁用</el-link>
            <el-link type="danger" :underline="false" @click="invalid('single', scope.row)">作废</el-link>
          </template>
        </template>
      </CommonTable>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import { AppMainHeader, CommonTable } from '@/components'
import { getProducts, delProduct, enabledProduct } from '@/api/productManage'

export default {
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
        showOperationBtn: false,
        showCheckbox: false,
        headers: [
          { title: '产品编码', field: 'code' },
          { title: '租户-系统显示名称', field: 'parentName' },
          { title: '当前版本', field: 'version' },
          { title: '机构-系统显示名称', field: 'realName' },
          { title: '产品状态', tdTemplate: 'isEnabled' },
          { title: '操作', tdTemplate: 'operation', width: '340px' }
        ]
      },
      idList: [],
      searchParams: {
        size: 5,
        current: 1,
        tenantId: this.$route.query.tenantId,
        orgId: this.$route.query.orgId
      }
    }
  },
  components: {
    AppMainHeader,
    CommonTable
  },
  props: {
    type: {
      type: String
    }
  },
  created() {
    this.tableConfig.showOperationBtn = this.type === 'detail' ? false : true
    this.tableConfig.showCheckbox = this.type === 'detail' ? false : true
    this.getProducts()
  },
  methods: {
    async getProducts() {
      try {
        this.searchParams.size = this.tableConfig.pageSize
        this.searchParams.current = this.tableConfig.pageNum
        this.tableConfig.loading = true
        const { code, data } = await getProducts(this.searchParams)
        if (code === '200') {
          this.tableData = data.records
          this.tableConfig.total = data.total
        }
        this.tableConfig.loading = false
      } catch (error) {
        this.tableConfig.loading = false
      }
    },

    onSearch(params) {
      Object.assign(this.searchParams, params)
      this.getProducts()
    },

    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map(item => item.id)
    },

    addProduct() {
      this.$router.push({
        path: '/organizationManagement/product/add',
        query: {
          orgId: this.$route.query.orgId,
          tenantId: this.$route.query.tenantId
        }
      })
      storage.set('orgId', this.$route.query.orgId)
    },

    editProduct(row) {
      this.$router.push({
        path: '/organizationManagement/product/edit',
        query: {
          productId: row.id,
          orgId: this.$route.query.orgId,
          tenantId: this.$route.query.tenantId
        }
      })
    },

    viewProduct(row) {
      this.$router.push({
        path: '/organizationManagement/product/detail',
        query: {
          productId: row.id
        }
      })
    },
    enabled(type, row) {
      this.$refs.table.enabled(type, row).then(async params => {
        const { code, data, message } = await enabledProduct(params)
        this.responseHandler(code, data, message).then(res => {
          this.getProducts()
        })
      })
    },
    disabled(type, row) {
      this.$refs.table.disabled(type, row).then(async params => {
        const { code, data, message } = await enabledProduct(params)
        this.responseHandler(code, data, message).then(res => {
          this.getProducts()
        })
      })
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(async params => {
        const { code, data, message } = await delProduct(params)
        this.responseHandler(code, data, message).then(res => {
          this.tableConfig.pageNum = 1
          this.getProducts()
        })
      })
    },

    async productConfiguration(row) {
      this.$router.push({
        path: '/organizationManagement/product',
        query: {
          id: row.id,
          code: row.code,
          name: row.name
        }
      })
    }
  }
}
</script>

