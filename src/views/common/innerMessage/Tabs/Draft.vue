<template>
  <CommonTable
    class="table"
    :dataList="tableData"
    :getListHandle="getListHandle"
    :tableConfig.sync="tableConfig"
    @handleSelectChange="handleSelectChange"
  >
    <template slot="status" slot-scope="scope">
      <i :class="['status-icon', scope.row.status ? 'el-icon-iot-weidu' : 'el-icon-iot-yidu' ]"></i>
    </template>
    <template slot="file" slot-scope="scope">
      <el-link>
        <i class="file-icon el-icon-iot-fujian"></i>
      </el-link>
    </template>
    <template slot="operation">
      <el-link type="primary" :underline="false">查看</el-link>
      <el-link type="primary" :underline="false">回复</el-link>
      <el-link type="primary" :underline="false">全部回复</el-link>
      <el-link type="primary" :underline="false">转发</el-link>
      <el-link type="danger" :underline="false">删除</el-link>
    </template>
  </CommonTable>
</template>

<script>
import { CommonTable } from '@/components'

export default {
  components: {
    CommonTable
  },
  data() {
    return {
      tableData: [
        {
          status: 0,
          file: 'http://111',
          send: '张三',
          title: '这是一封邮件xxxxxxxxxxxxxxxxxxxxxxxxxx',
          time: '2020-07-01'
        },
        {
          status: 1,
          file: 'http://111',
          send: '张三',
          title: '这是一封邮件xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
          time: '2020-07-01'
        }
      ],
      tableConfig: {
        id: 'assetsCenter-categoryAssets',
        pageSize: 10,
        pageNum: 1,
        total: 0,
        border: false,
        pageSizeOptions: [5, 10, 100, 200, 500],
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: '状态', tdTemplate: 'status', width: '100px', align: 'center' },
          { title: '附件', tdTemplate: 'file', width: '100px', align: 'center' },
          { title: '收件人', field: 'send' },
          { title: '标题', field: 'title' },
          { title: '更新时间', field: 'time' },
          { title: '操作', tdTemplate: 'operation' }
        ]
      }
    }
  },
  methods: {
    getListHandle(selectList) {
      this.$emit('getListHandle', {
        page: this.tableConfig.pageSize,
        paNum: this.tableConfig.pageNum
      })
    },
    handleSelectChange(selectList) {
      this.$emit('handleSelectChange', selectList)
    }
  }
}
</script>
<style lang="scss" scoped>
.status-icon,
.file-icon {
  font-size: 16px;
}

.el-icon-iot-yidu {
  @include font_color('primary_color');
}
</style>
