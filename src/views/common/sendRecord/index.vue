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
              <el-form-item :label="$t('sendRecord.sendChannel')" prop="sendChannel">
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
              <el-form-item :label="$t('sendRecord.messageType')" prop="messageType">
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
                <el-form-item :label="$t('sendRecord.title')" prop="title">
                   <el-input
                      size="small"
                      v-model="form.title"
                      :placeholder="$t('inputTip')"
                      maxlength="200"
                    ></el-input>
                </el-form-item>
            </el-col>
            <transition-group name="fade-transform" style="width:100%">
              <template v-if="showForm">
                  <el-col :span="7" key="sendResult">
                  <el-form-item :label="$t('sendRecord.sendResult')" prop="sendResult">
                    <el-select v-model="form.sendResult" :placeholder="$t('selectTip')">
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
                <el-col :span="10" key="date">
                  <el-form-item
                    :label="$t('sendRecord.sendTime')"
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
          <el-link
            type="primary"
            :underline="false"
            @click="invalid('sigle', scope.row)"
            v-has
            >重新发送</el-link
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
          { title: this.$t('sendRecord.sendChannel'), field: "sendChannel", width: 150 },
          { title: this.$t('sendRecord.messageType'), field: "messageType",width: 150 },
          { title: this.$t('sendRecord.title'), field: "title"},
          { title: this.$t('sendRecord.sendObj'), field: "sendObj", width: 200 },
          { title: this.$t('sendRecord.sendNum'), field: "sendNum", width: 130 },
          { title: this.$t('sendRecord.sendResult'), field: "sendResult", width: 130 },
          { title: this.$t('sendRecord.sendTime'), tdTemplate: "createdTime",width: 180  },
          { title: this.$t('opraction'), tdTemplate: "operation", width: 200, align: "center" },
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
    // 查看
    view(){
        this.$router.push({path:'/sendRecord/detail'});
    },
    // 选择复选框表格行
    handleSelectChange(row) {
      this.idList = row.map((item) => item.id);
    },
  },
};
</script>
<style lang="scss" scoped></style>
