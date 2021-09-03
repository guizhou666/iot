<template>
  <div class="main">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable ref="table" class="table" :selectKey="{
        id: 'id',
        name: ['userAccount']
      }" :dataList="tableData" :getListHandle="getUsers" :tableConfig.sync="tableConfig" @handleSelectChange="handleSelectChange">
        <template slot="operationBtn">
          <el-button icon="el-icon-delete" :disabled="idList.length<2" type="primary" @click="invalid('batch')" v-has>批量作废</el-button>
          <el-button icon="el-icon-iot-jinyong1" :disabled="idList.length<2" type="primary" @click="disabled('batch')" v-has>批量禁用</el-button>
          <el-button icon="el-icon-video-play" :disabled="idList.length<2" type="primary" @click="enabled('batch')" v-has>批量启用</el-button>
          <el-button icon="el-icon-plus" type="primary" style="float:right" @click="addUser" v-has>添加用户</el-button>
        </template>
        <template slot="lastLoginTime" slot-scope="scope">
          <span>{{ scope.row.lastLoginTime | isNull }}</span>
        </template>
        <template slot="isEnabled" slot-scope="scope">
          <el-tag :type="scope.row.isEnabled ? 'success' : 'danger'">{{scope.row.isEnabled ? '已启用' : '已禁用'}}</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-link type="primary" :underline="false" @click="$refs.resetPassword.show(scope.row.id)" v-has>重置密码</el-link>
          <el-link type="primary" :underline="false" @click="viewUser(scope.row)" v-has>查看</el-link>
          <el-link type="primary" :underline="false" @click="editUser(scope.row)" v-has>修改</el-link>
          <el-link type="primary" :underline="false" v-show="!scope.row.isEnabled" @click="enabled('single',scope.row)" v-has>启用</el-link>
          <el-link type="danger" :underline="false" v-show="scope.row.isEnabled" @click="disabled('single',scope.row)" v-has>禁用</el-link>
          <el-link type="danger" :underline="false" @click="invalid('single',scope.row)" v-has>作废</el-link>
        </template>
      </CommonTable>
    </div>

    <reset-password successMessage="密码已重置，请线下通知用户" ref="resetPassword"></reset-password>
  </div>
</template>

<script>
import { getUsers, delUser, enabledUser } from '@/api/userManage'
import { AppMainHeader, CommonTable, ResetPassword } from '@/components'
import FilterForm from './FilterForm'
export default {
  components: { AppMainHeader, FilterForm, CommonTable, ResetPassword },
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
          { title: '用户名', field: 'userAccount' },
          { title: '姓名', field: 'realName' },
          { title: '联系电话', field: 'phone' },
          { title: '电子邮箱', field: 'email' },
          { title: '所属角色', field: 'roleNames' },
          { title: '用户状态', tdTemplate: 'isEnabled' },
          { title: '最近登录时间', tdTemplate: 'lastLoginTime' },
          { title: '操作', tdTemplate: 'operation', width: 260 }
        ]
      },
      searchParams: {},
      idList: []
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      this.tableConfig.loading = true
      const { code, data, msg } = await getUsers(this.searchParams)
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
      this.getUsers()
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map((item) => item.id)
    },
    addUser() {
      this.$router.push('/UserManagement/add')
    },
    editUser(row) {
      this.$router.push({
        path: '/UserManagement/edit',
        query: {
          id: row.id
        }
      })
    },
    viewUser(row) {
      this.$router.push({
        path: '/UserManagement/detail',
        query: {
          id: row.id
        }
      })
    },
    enabled(type, row) {
      this.$refs.table.enabled(type, row).then(async (params) => {
        const { code, data, message } = await enabledUser(params)
        this.responseHandler(code, data, message).then((res) => {
          this.getUsers()
        })
      })
    },
    disabled(type, row) {
      this.$refs.table.disabled(type, row).then(async (params) => {
        const { code, data, message } = await enabledUser(params)
        this.responseHandler(code, data, message).then((res) => {
          this.getUsers()
        })
      })
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(async (params) => {
        const { code, data, message } = await delUser(params)
        this.responseHandler(code, data, message).then((res) => {
          this.getUsers()
        })
      })
    },
    async accessConfiguration(row) {
      this.$router.push({
        path: '/UserManagement/access',
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
