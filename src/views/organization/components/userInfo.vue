<template>
  <div class="user-info">
    <AppMainHeader :title="$t('userInfo.userInfo')"></AppMainHeader>
    <div class="personal-table">
      <div class="personal-table-left">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          node-key="code"
          @node-click="handleNodeClick"
          :highlight-current = 'true'
          :expand-on-click-node = 'false'
        >
          <span slot-scope="{ node }" style="width: calc(100% - 24px)">
            <span :title="node.label" class="node__label">
              {{ node.label }}
            </span>
          </span>
        </el-tree>
      </div>
      <div class="personal-table-right">
        <CommonTable
          class="table"
          :dataList="tableData"
          :getListHandle="_getUserList"
          :tableConfig.sync="tableConfig"
        >
          <template slot="operation" slot-scope="scope">
            <el-link type="primary" @click="viewDetail(scope.row.id)">查看</el-link>
            <!-- <span @click="viewDetail(scope.row.id)">查看</span> -->
          </template>
        </CommonTable>
      </div>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable } from '@/components'
import { getChildDepartment, getUserList } from '@/api/postManage'
export default {
  components: {
    AppMainHeader,
    CommonTable
  },
  data() {
    return {
      treeData: [],
      tableData: [],
      tableConfig: {
        id: 'assetsCenter-categoryAssets',
        pageSize: 5,
        pageNum: 1,
        total: 0,
        border: true,
        pageSizeOptions: [5, 10, 100, 200, 500],
        loading: false,
        showPagination: true,
        showOperationBtn: false,
        showCheckbox: false,
        headers: [
          { title: this.$t('userInfo.jobnumber'), field: 'code' },
          { title: this.$t('userInfo.name'), field: 'name' },
          { title: this.$t('userInfo.username'), field: 'userAccount' },
          { title: this.$t('userInfo.post'), field: 'postName' },
          { title: this.$t('opraction'), tdTemplate: 'operation' }
        ]
      },
      defaultProps: {
        children: 'childList',
        label: 'name'
      }
    }
  },
  props: {
    code: {},
    departmentId: {}
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {
    this._getDepartmentTree()
    this._getUserList()
  },
  mounted() {},
  methods: {
    // 选择部门
    handleNodeClick(data, node) {
      this.tableConfig.pageNum = 1
      this._getUserList(data.id)
    },
    // 获取人员列表
    async _getUserList(departmentId) {
      const params = {
        size: this.tableConfig.pageSize,
        current: this.tableConfig.pageNum,
        deptId: this.departmentId
      }
      if (departmentId) {
        params.deptId = departmentId
      }
      const { code, data, msg } = await getUserList(params)
      if (code == 200) {
        this.tableData = data.records
        this.tableConfig.total = data.total
      }
    },
    // 点击查看
    viewDetail(id) {
      this.$emit('viewDetail', id)
    },
    // 获取部门树
    async _getDepartmentTree() {
      const params = {
        code: this.$route.meta.source == 'post' ? '' : this.code,
        // id: this.$route.meta.source == 'post' ? '' : this.$route.query.id,
      }
      const { code, data, msg } = await getChildDepartment(params)
      if (code === '200') {
        this.treeData = data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.user-info {
  width: 100%;
  .personal-table {
    width: 100%;
    display: flex;
    margin-top: 20px;
    .personal-table-left {
      width: 20%;
      ::v-deep .node__label {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }
    }
    .personal-table-right {
      width: 80%;
    }
  }
}
</style>
