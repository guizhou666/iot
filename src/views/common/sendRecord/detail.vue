<template>
  <div class="app-content-wrap">
    <AppMainHeader
      :title="$t('sendRecord.sendDetail')"
      :hasBackBtn="true"
    ></AppMainHeader>
    <div class="content">
      <el-form :model="ruleForm" ref="ruleForm" label-width="180px" class="demo-ruleForm">
        <el-form-item :label="$t('sendRecord.sendChannel')" prop="sendChannel">
          <el-checkbox-group v-model="ruleForm.sendChannel">
            <el-checkbox label="系统" disabled></el-checkbox>
            <el-checkbox label="邮件" disabled></el-checkbox>
            <el-checkbox label="短信" disabled></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('sendRecord.messageType')" prop="messageType">
          <el-radio v-model="ruleForm.messageType" label="1" disabled>通知公告</el-radio>
          <el-radio v-model="ruleForm.messageType" label="2" disabled>系统通知</el-radio>
        </el-form-item>
        <el-form-item :label="$t('sendRecord.title')" prop="title">
          <span>{{ "关于XXXXXXXX的通知" }}</span>
        </el-form-item>
        <el-form-item :label="$t('sendRecord.fujian')">
          <app-ufast-upload
            ref="file"
            :uploadConfig="$data._uploadConfig"
            @handleFileList="handleFileList"
          ></app-ufast-upload>
        </el-form-item>
        <el-form-item :label="$t('sendRecord.content')" prop="content">
          <span>{{ "我是内容" }}</span>
        </el-form-item>

         <CommonTable
        ref="table"
        class="table"
        :dataList="tableData"
        :getListHandle="getNoticeList"
        :tableConfig.sync="tableConfig"
      >
        <template slot="operation" slot-scope="scope">
          <el-link
            type="primary"
            :underline="false"
            @click="invalid('sigle', scope.row)"
            v-has
            >重新发送</el-link
          >
        </template>
      </CommonTable>
      </el-form>
    </div>
  </div>
</template>

<script>
import { AppMainHeader,CommonTable } from "@/components";
export default {
  components: {
    AppMainHeader,
    CommonTable
  },
  data() {
    return {
      ruleForm: {
        sendChannel: [],
      },
      title: "添加公告",
      _uploadConfig: {
        type: "filePin",
        address: "htsy-assets",
        filekey: "",
        showfilelist: true,
        showModal: false,
      },
      tableData:[],
        tableConfig:{
            id: "sendRecord",
        pageSize: 10,
        pageNum: 1,
        total: 0,
        pageSizeOptions: [5, 10, 100, 200, 500],
        border: false,
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: this.$t('sendRecord.number'), field: "number", width: 150 },
          { title: this.$t('sendRecord.sendObj'), field: "messageType",width: 150 },
          { title: this.$t('sendRecord.sendNum'), field: "title",width: 150},
          { title: this.$t('sendRecord.sendResult'), field: "sendObj", width: 100 },
          { title: this.$t('sendRecord.failResult'), field: "sendNum"},
          { title: this.$t('sendRecord.sendTime'), field: "sendTime", width: 130 },
          { title: this.$t('opraction'), tdTemplate: "operation", width: 100, align: "center" },
        ],
        }
    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleFileList() {},
    getSendList(){}
  },
};
</script>
<style lang="scss" scoped>
.app-content-wrap {
  .content {
    width: 70%;
    ::v-deep .el-radio__input.is-disabled + span.el-radio__label,
    ::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #000000;
    }
  }
}
</style>
