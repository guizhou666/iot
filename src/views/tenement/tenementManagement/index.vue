<template>
  <div class="tenement-warpper">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        ref="table"
        class="table"
        :dataList="tableData"
        :getListHandle="getTenements"
        :tableConfig.sync="tableConfig"
        @handleSelectChange="handleSelectChange"
      >
        <template slot="operationBtn">
          <el-button
            icon="el-icon-delete"
            :disabled="idList.length < 2"
            type="primary"
            @click="invalid('batch')"
            v-has
          >批量作废</el-button>
          <el-button
            icon="el-icon-iot-jinyong1"
            :disabled="idList.length < 2 "
            type="primary"
            @click="disabled('batch')"
            v-has
          >批量禁用</el-button>
          <el-button
            icon="el-icon-video-play"
            :disabled="idList.length < 2 "
            type="primary"
            @click="enabled('batch')"
            v-has
          >批量启用</el-button>
          <el-button
            icon="el-icon-plus"
            type="primary"
            style="float:right"
            @click="addTenement"
            v-has
          >添加租户</el-button>
        </template>
        <template slot="orgNum" slot-scope="scope">
          <span>{{ scope.row.createdOrgNum + '/' + (scope.row.orgNum !== -1 ? scope.row.orgNum : '--') }}</span>
        </template>
        <template slot="isEnabled" slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled" type="success">已启用</el-tag>
          <el-tag v-else type="danger">已禁用</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="$refs.resetPassword.show(scope.row.userId)"
            v-has
          >重置密码</el-link>
          <el-link type="primary" :underline="false" @click="view(scope.row)" v-has>查看</el-link>
          <el-link type="primary" :underline="false" @click="editTenement(scope.row)" v-has>修改</el-link>
          <el-link
            type="primary"
            :underline="false"
            @click="productConfiguration(scope.row)"
            v-has
          >产品配置</el-link>
          <el-link
            type="primary"
            :underline="false"
            v-show="!scope.row.isEnabled"
            @click="enabled('single', scope.row)"
            v-has
          >启用</el-link>
          <el-link
            type="danger"
            :underline="false"
            v-show="scope.row.isEnabled"
            @click="disabled('single', scope.row)"
            v-has
          >禁用</el-link>
          <el-link type="danger" :underline="false" @click="invalid('single', scope.row)" v-has>作废</el-link>
        </template>
      </CommonTable>
    </div>
    <reset-password successMessage="密码已重置，请线下通知租户的超级管理员" ref="resetPassword"></reset-password>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable, ResetPassword } from '@/components'
import { getTenements, delTenement, enabledTenement } from '@/api/tenementManage'
import FilterForm from './FilterForm.vue'
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
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: '租户编码', field: 'code' },
          { title: '租户名称', field: 'name' },
          { title: '机构数量', tdTemplate: 'orgNum' },
          { title: '产品数量', field: 'appNum' },
          { title: '租户状态', tdTemplate: 'isEnabled' },
          { title: '操作', tdTemplate: 'operation', width: '400px' }
        ]
      },
      idList: [],
      searchParams: {
        size: 5,
        current: 1
      }
    }
  },
  components: {
    AppMainHeader,
    CommonTable,
    FilterForm,
    ResetPassword
  },
  created() {
    this.getTenements()
  },
  methods: {
    async getTenements() {
      try {
        this.tableConfig.loading = true
        this.searchParams.current = this.tableConfig.pageNum
        this.searchParams.size = this.tableConfig.pageSize
        const { code, data } = await getTenements(this.searchParams)
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
      this.tableConfig.pageNum = 1
      Object.assign(this.searchParams, params)
      this.getTenements()
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map(item => item.id)
    },
    handleOrgNum(orgNum) {
      if (orgNum == -1) {
        return 0
      } else if (!orgNum) {
        return '--'
      } else {
        return orgNum
      }
    },
    view(row) {
      this.$router.push({
        path: '/tenementManagement/detail',
        query: {
          tenantId: row.id
        }
      })
    },
    editTenement(row) {
      this.$router.push({
        path: '/tenementManagement/edit',
        query: {
          tenantId: row.id
        }
      })
    },
    addTenement() {
      this.$router.push('/tenementManagement/add')
    },
    async productConfiguration(row) {
      this.$router.push({
        path: '/tenementManagement/product',
        query: {
          tenantId: row.id
        }
      })
    },
    enabled(type, row) {
      this.$refs.table.enabled(type, row).then(async res => {
        const { code, data, message } = await enabledTenement(res)
        this.responseHandler(code, data, message).then(res => {
          this.getTenements()
        })
      })
    },
    disabled(type, row) {
      this.$refs.table.disabled(type, row).then(async res => {
        const { code, data, message } = await enabledTenement(res)
        this.responseHandler(code, data, message).then(res => {
          this.getTenements()
        })
      })
    },
    invalid(type, row) {
      let message = '删除后该租户产品以及关联的机构产品全部作废'
      this.$refs.table.invalid(type, row, message).then(async res => {
        const { code, data, message } = await delTenement(res)
        this.responseHandler(code, data, message).then(res => {
          this.tableConfig.pageNum = 1
          this.getTenements()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tenement-warpper {
  .text {
    @include font_color('font_color1');
  }
  .hidden-button {
    visibility: hidden;
    cursor: auto;
  }
}
</style>
