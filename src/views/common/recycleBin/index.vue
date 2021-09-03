<template>
  <div class="main">
      <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        class="table"
        :dataList="tableData"
        :getListHandle="getOpractionLog"
        :tableConfig.sync="tableConfig"
      >
        <template slot="operationBtn">
          <el-button
            :disabled="idList.length<2"
            type="primary"
            @click="openDelbox('batch')"
            v-has
          >批量恢复</el-button>
        </template>
        <template slot="operation" slot-scope="scope">
          <span @click="editRole(scope.row)" v-has>查看</span>
          <span @click="openDelbox('sigle',scope.row)" v-has>恢复</span>
        </template>
      </CommonTable>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable } from '@/components'
import {} from '@/api/resourceManage'
import FilterForm from './FilterForm'
export default {
  name: 'PersonalFile',
  components: { AppMainHeader, FilterForm, CommonTable },
  data() {
    return {
      idList: [],
      searchParams: {
        current: 1,
        size: 5
      },
      tableData: [
        {
          userAccount: 'halashao',
          realName: '哈拉少',
          module: '哈哈',
          bizType: '阿西吧',
          roleNames: '拉进来',
          description: '回来上课的攻击力',
          createdTime: '2021-4-25'
        }
      ],
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
          { title: '数据类型', field: 'userAccount' },
          { title: '数据编码', field: 'realName' },
          { title: '数据名称', field: 'module' },
          { title: '操作人', field: 'bizType' },
          { title: '姓名', field: 'roleNames' },
          { title: '作废时间', field: 'description' },
          { title: '操作', tdTemplate: 'operation', width: 100 }
        ]
      }
    }
  },
  created() {
    // this.getResources()
  },
  mounted() {},
  methods: {
    async getResources() {
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      const { code, data, msg } = await getResources(this.searchParams)
      if (code === '200') {
        this.treeData = data
      }
    },
    onSearch(params) {
      this.tableConfig.pageNum = 1
      Object.assign(this.searchParams, params)
      this.getResources()
    },
    getOpractionLog() {}
  }
}
</script>

<style lang="scss">
.text {
  @include font_color('font_color1');
}
</style>
