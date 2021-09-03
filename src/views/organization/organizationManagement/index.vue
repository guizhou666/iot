<template>
  <div class="organization-warpper">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        ref="table"
        class="table"
        :dataList="tableData"
        :getListHandle="getOrganizations"
        :tableConfig.sync="tableConfig"
        @handleSelectChange="handleSelectChange"
      >
        <template slot="operationBtn">
          <el-button
            icon="el-icon-delete"
            :disabled="idList.length<2"
            type="primary"
            @click="invalid('batch')"
            v-has
          >批量作废</el-button>
          <el-button
            icon="el-icon-iot-jinyong1"
            :disabled="idList.length<2"
            type="primary"
            @click="disabled('batch')"
            v-has
          >批量禁用</el-button>
          <el-button
            icon="el-icon-video-play"
            :disabled="idList.length<2"
            type="primary"
            @click="enabled('batch')"
            v-has
          >批量启用</el-button>
          <el-button
            icon="el-icon-plus"
            :disabled="addOrg"
            type="primary"
            style="float:right"
            @click="addOrganization"
            v-has
          >添加机构</el-button>
        </template>
        <template slot="isEnabled" slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled" type="success">已启用</el-tag>
          <el-tag v-else type="danger">已禁用</el-tag>
        </template>
        <template
          slot="description"
          slot-scope="scope"
        >{{ scope.row.description ? scope.row.description : '-' }}</template>
        <template slot="operation" slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="$refs.resetPassword.show(scope.row.userId)"
            v-has
          >重置密码</el-link>
          <el-link type="primary" :underline="false" @click="view(scope.row)" v-has>查看</el-link>
          <el-link type="primary" :underline="false" @click="editOrganization(scope.row)" v-has>修改</el-link>
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
import { getTenement } from '@/api/tenementManage'
import { getOrganizations, delOrganization, enabledOrganization } from '@/api/organizationManage'
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
          { title: '机构编码', field: 'code', width: 300 },
          { title: '机构名称', field: 'name', width: 200 },
          { title: '产品数量', field: 'appNum', width: 300 },
          { title: '机构状态', tdTemplate: 'isEnabled' },
          { title: '操作', tdTemplate: 'operation' }
        ]
      },
      idList: [],
      searchParams: {
        size: 5,
        current: 1
      },
      addOrg: false
    }
  },
  components: {
    AppMainHeader,
    CommonTable,
    FilterForm,
    ResetPassword
  },
  created() {
    this.getOrganizations()
    this.getOrgNum()
  },
  methods: {
    async getOrganizations() {
      try {
        this.searchParams.size = this.tableConfig.pageSize
        this.searchParams.current = this.tableConfig.pageNum
        this.tableConfig.loading = true
        const { code, data } = await getOrganizations(this.searchParams)
        if (code === '200') {
          this.tableData = data.records
          this.tableConfig.total = data.total
        }
        this.tableConfig.loading = false
      } catch (error) {
        this.tableConfig.loading = false
      }
    },

    // 获取机构数量 和创建数量
    getOrgNum() {
      const { tenantId, orgId } = this.userInfo
      // 只针对租户用户，所在下的产品
      if (tenantId != '-1' && orgId == '-1') {
        getTenement({
          id: this.appInfo.tenantId
        }).then(res => {
          if (res.code == '200') {
            const { createdOrgNum, orgNum } = res.data
            if (orgNum && orgNum !== createdOrgNum) {
              this.addOrg = false
            } else {
              this.addOrg = true
            }
          }
        })
      }
    },
    onSearch(params) {
      this.tableConfig.pageNum = 1
      Object.assign(this.searchParams, params)
      this.getOrganizations()
    },

    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map(item => item.id)
    },

    // 查看
    view(row) {
      this.$router.push({
        path: '/organizationManagement/detail',
        query: {
          orgId: row.id
        }
      })
    },

    editOrganization(row) {
      this.$router.push({
        path: '/organizationManagement/edit',
        query: {
          orgId: row.id
        }
      })
    },

    addOrganization() {
      this.$router.push('/organizationManagement/add')
    },

    async productConfiguration(row) {
      this.$router.push({
        path: '/organizationManagement/product',
        query: {
          orgId: row.id,
          tenantId: row.tenantId
        }
      })
    },
    enabled(type, row) {
      this.$refs.table.enabled(type, row).then(async params => {
        const { code, data, message } = await enabledOrganization(params)
        this.responseHandler(code, data, message).then(res => {
          this.getOrganizations()
        })
      })
    },
    disabled(type, row) {
      this.$refs.table.disabled(type, row).then(async params => {
        const { code, data, message } = await enabledOrganization(params)
        this.responseHandler(code, data, message).then(res => {
          this.getOrganizations()
        })
      })
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(async params => {
        const { code, data, message } = await delOrganization(params)
        this.responseHandler(code, data, message).then(res => {
          this.tableConfig.pageNum = 1
          this.getOrganizations()
          this.getOrgNum()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.organization-warpper {
  .text {
    @include font_color('font_color1');
  }
  .hidden-button {
    visibility: hidden;
    cursor: auto;
  }
}
</style>
