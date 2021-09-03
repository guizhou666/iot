<template>
  <div class="main">
    <div class="main-content">
      <div class="content-left app-content-wrap">
        <el-form ref="form" label-width="80px">
          <el-form-item label="部门名称">
            <el-input
              size="small"
              @input="getDepartmentTree"
              @clear="clearDep"
              clearable
              style="width: 200px"
              v-model.trim="departmentName"
              placeholder="请输入关键字"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-tree
          v-loading="loading"
          highlight-current
          class="personal-eltree"
          :data="treeData"
          :props="defaultProps"
          :default-expand-all="defaultExpandAll"
          @node-click="handleNodeClick"
        ></el-tree>
      </div>
      <div class="content-right">
        <FilterForm @onSearch="onSearch"></FilterForm>
        <div class="app-content-wrap">
          <CommonTable
            ref="table"
            class="table"
            :dataList="tableData"
            :getListHandle="getTmPersonsTree"
            :tableConfig.sync="tableConfig"
            @handleSelectChange="handleSelectChange"
          >
            <template slot="createdTime" slot-scope="scope">{{scope.row.createdTime | day}}</template>
            <template slot="operationBtn">
              <el-button
                :disabled="idList.length<2"
                type="primary"
                @click="invalid('batch')"
                v-has
              >批量作废</el-button>
              <el-button :disabled="idList.length<2" type="primary" v-has>批量导出</el-button>
              <el-button type="primary" style="float: right" @click="addPersonal" v-has>添加人员</el-button>
              <el-button type="primary" style="float: right" @click="batchAdd" disabled v-has>批量添加</el-button>
            </template>
            <template slot="operation" slot-scope="scope">
              <el-link :underline="false" type="primary" @click="viewDetail(scope.row)" v-has>查看</el-link>
              <el-link :underline="false" type="primary" @click="editPersonal(scope.row)" v-has>修改</el-link>
              <el-link
                :underline="false"
                type="danger"
                @click="invalid('sigle', scope.row)"
                v-has
              >作废</el-link>
            </template>
          </CommonTable>
        </div>
      </div>
    </div>

    <el-dialog title="批量添加人员" :visible.sync="visible" width="30%">
      <batch-add></batch-add>
    </el-dialog>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable } from '@/components'
import { getDepartmentTree } from '@/api/postManage'
import { getTmPersonsTree, deleteTmPersons } from '@/api/personalManage'
import FilterForm from './FilterForm'
import BatchAdd from './BatchAdd'
import { UPDATE_CACHECOMPONENTS } from '@/store/mutation-types'
export default {
  name: 'personalTable',
  components: { AppMainHeader, FilterForm, CommonTable, BatchAdd },
  data() {
    return {
      idList: [],
      tableData: [],
      treeData: [],
      loading: false,
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
          { title: '工号', field: 'code' },
          { title: '姓名', field: 'name' },
          { title: '用户名', field: 'userAccount' },
          { title: '添加时间', tdTemplate: 'createdTime' },
          { title: '操作', tdTemplate: 'operation', width: 200 }
        ]
      },
      departmentName: '',
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      params: {},
      visible: false,
      timer: null,
      selectDep: {
        id: '',
        name: ''
      },
      defaultExpandAll: false
    }
  },
  created() {
    this.getDepartmentTree()
    this.getTmPersonsTree()
  },
  activated() {
    this.getTmPersonsTree()
  },
  methods: {
    // 获取部门树
    getDepartmentTree(departmentName) {
      this.defaultExpandAll = true

      clearTimeout(this.timer)
      this.loading = true
      this.timer = setTimeout(() => {
        getDepartmentTree({
          name: departmentName
        }).then(res => {
          this.loading = false
          if (res.code === '200') {
            this.treeData = res.data
          }
        })
      }, 500)
    },
    clearDep() {
      this.params = {}
      this.tableConfig.pageNum = 1
      this.tableConfig.pageSize = 5
      this.getDepartmentTree()
      this.getTmPersonsTree()
      this.defaultExpandAll = true
    },
    onSearch(params) {
      this.tableConfig.pageNum = 1
      Object.assign(this.params, params)
      this.getTmPersonsTree()
    },

    // 选择部门
    handleNodeClick(data, node) {
      this.params.deptId = data.id
      this.selectDep = {
        id: data.id,
        name: data.name
      }
      this.getTmPersonsTree()
    },
    // 获取人员
    async getTmPersonsTree() {
      this.params.current = this.tableConfig.pageNum
      this.params.size = this.tableConfig.pageSize
      const { code, data, msg } = await getTmPersonsTree(this.params)
      if (code === '200') {
        this.tableData = data.records
        this.tableConfig.total = data.total
      }
    },
    // 查看详情
    viewDetail(row) {
      this.$router.push({
        path: '/personalManagement/detail',
        query: {
          id: row.id
        }
      })
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map(item => item.id)
    },
    // 修改
    change() {},
    // 作废
    cancellation() {},
    batchAdd() {
      this.visible = true
    },
    addPersonal() {
      this.$router.push({
        path: '/personalManagement/add',
        query: {
          id: this.selectDep.id
        }
      })
    },
    editPersonal(row) {
      this.$router.push({
        path: '/personalManagement/edit',
        query: {
          id: row.id
        }
      })
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(async res => {
        await deleteTmPersons(res)
        this.getTmPersonsTree()
      })
    }
  },

  beforeRouteEnter(to, from, next) {
    const cacleList = [
      '/personalManagement/add',
      '/personalManagement/edit',
      '/personalManagement/detail'
    ]
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
    const cacleList = [
      '/personalManagement/add',
      '/personalManagement/edit',
      '/personalManagement/detail'
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

<style>
.personal-eltree .el-tree-node__label {
  width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

