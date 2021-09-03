<template>
  <div class="notice-management">
    <FilterForm
      @toggle="() => (this.showForm = !this.showForm)"
      @onSearch="onSearch"
      @onClear="onClear"
    >
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
            <el-col :span="7">
              <el-form-item :label="$t('noticeManagement.messageType')" prop="messageType">
                <el-select v-model="form.messageType" :placeholder="$t('selectTip')">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('noticeManagement.sendType')" prop="sendType">
                <el-select v-model="form.sendType" :placeholder="$t('selectTip')">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item :label="$t('noticeManagement.state')" prop="state">
                  <el-select v-model="form.state" :placeholder="$t('selectTip')">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
            </el-col>
            <transition-group name="fade-transform" style="width:100%">
              <template v-if="showForm">
                <el-col :span="10" key="date">
                  <el-form-item
                    :label="$t('addTime')"
                    prop="createdTimeStart"
                    class="datepicker"
                  >
                    <date-picker
                      :disabledDate="{
                        compareTime: this.form.createdTimeEnd,
                        type: 'start',
                      }"
                      :date="form.createdTimeStart"
                      @change="(v) => (form.createdTimeStart = v)"
                    ></date-picker>
                    <span style="margin: 0 10px">~</span>
                  </el-form-item>
                  <el-form-item prop="createdTimeEnd" class="datepicker">
                    <date-picker
                      fullday
                      :date="form.createdTimeEnd"
                      :disabledDate="{
                        compareTime: this.form.createdTimeStart,
                        type: 'end',
                      }"
                      @change="(v) => (form.createdTimeEnd = v)"
                    ></date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="title">
                  <el-form-item :label="$t('remark')" prop="remark">
                    <el-input
                      size="small"
                      v-model="form.remark"
                      :placeholder="$t('inputTip')"
                      maxlength="200"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </transition-group>
          </el-form>
        </el-row>
      </template>
    </FilterForm>
    <div class="app-content-wrap">
      <CommonTable
        ref="table"
        class="table"
        :dataList="tableData"
        :getListHandle="getNoticeList"
        :tableConfig.sync="tableConfig"
        @handleSelectChange="handleSelectChange"
      >
        <template slot="operationBtn">
          <el-button
            :disabled="idList.length < 2"
            type="primary"
            @click="invalid('batch')"
            v-has
            >批量作废</el-button
          >
          <el-button type="primary" style="float: right" @click="addNotice" v-has
            >添加公告</el-button
          >
        </template>
        <template slot="createdTime" slot-scope="scope">{{
          scope.row.createdTime | day | isNull
        }}</template>
        <template slot="description" slot-scope="scope">{{
          scope.row.description | isNull
        }}</template>
        <template slot="operation" slot-scope="scope">
            <el-link
            type="primary"
            :underline="false"
            @click="view(scope.row)"
            v-has
            >查看</el-link
          >
          <el-link type="primary" :underline="false" @click="edit(scope.row)" v-has
            >编辑</el-link
          >
          <el-link
            type="danger"
            :underline="false"
            @click="invalid('sigle', scope.row)"
            v-has
            >作废</el-link
          >
        </template>
      </CommonTable>
    </div>
  </div>
</template>

<script>
import FilterForm from "@/components/FilterForm";
import { DatePicker, CommonTable } from "@/components";
export default {
  components: { FilterForm, DatePicker, CommonTable },
  data() {
    return {
      form: {
        messageType: "",
        state: "",
        createdTimeEnd: "",
        createdTimeStart: "",
        title: "",
        sendType: "",
        remark:''
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      showForm: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      tableData: [
          {messageType:'系统通知',title:'标题XXXXXXXXXXXXXXXXXX',sendType:'定时发送',state:'草稿',createdName:'创建人',createdTime:'2021-10-01'}
      ],
      idList: [],
      tableConfig: {
        id: "assetsCenter-noticeManagement",
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
          { title: "消息类型", field: "messageType" },
          { title: "标题", field: "title" },
          { title: "发送方式", field: "sendType", width: 150 },
          { title: "状态", field: "state", width: 100 },
          { title: "创建人", field: "createdName" },
          { title: "创建时间", tdTemplate: "createdTime" },
          { title: "操作", tdTemplate: "operation", width: 200, align: "center" },
        ],
      },
    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearch() {},
    onClear() {},
    // 获取公告列表
    getNoticeList() {},
    //批量作废
    invalid() {},
    // 添加公告
    addNotice() {
        this.$router.push({path:'/noticeManagement/add'});
    },
    // 查看
    view(){
        this.$router.push({path:'/noticeManagement/detail'});
    },
    // 编辑
    edit() {
        this.$router.push({path:'/noticeManagement/edit'});
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map((item) => item.id);
    },
  },
};
</script>
<style lang="scss" scoped></style>
