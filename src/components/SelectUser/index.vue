
<template>
  <el-dialog
    width="40%"
    class="selectUser"
    :title="title"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <div class="selectUser_content">
      <div class="selectUser_left">
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
      <div class="selectUser_right">
        <CommonTable
          ref="table"
          class="table"
          :dataList="tableData"
          :getListHandle="getTmPersonsTree"
          :tableConfig.sync="tableConfig"
          @handleSelectChange="handleSelectChange"
        ></CommonTable>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { CommonTable } from '@/components'
import { getDepartmentTree } from '@/api/postManage'
import { getTmPersonsTree } from '@/api/personalManage'
export default {
  components: { CommonTable },
  data() {
    return {
      dialogVisible: false,
      treeData: [],
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
        headers: [{ title: '姓名', field: 'name', align: 'center' }]
      },
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      params: {}
    }
  },
  props: {
    title: {
      type: String,
      default: '选择用户'
    }
  },
  created() {
    this.getDepartmentTree()
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
    // 选择部门
    handleNodeClick(data, node) {
      this.params.deptId = data.id
      this.selectDep = {
        id: data.id,
        name: data.name
      }
      this.getTmPersonsTree()
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map(item => item.id)
    },
    handleClose(done) {},
    show() {
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.selectUser {
  .selectUser_content {
    width: 100%;
    display: flex;
    .selectUser_left {
      width: 50%;
      padding: 0 20px;
    }
    .selectUser_right {
      width: 50%;
      padding: 0 20px;
    }
  }
}
</style>