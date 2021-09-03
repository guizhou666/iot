<template>
  <div class="support-pro-setting">
    <FilterForm
      @toggle="() => (this.showForm = !this.showForm)"
      @onSearch="onSearch"
      @onClear="onClear"
    >
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form
            :inline="true"
            :model="form"
            ref="form"
            class="demo-form-inline"
          >
            <el-col :span="7">
              <el-form-item :label="$t('supportProSetting.name')" prop="remark">
                <el-input
                  size="small"
                  v-model="form.remark"
                  :placeholder="$t('inputTip')"
                  maxlength="200"
                ></el-input>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" style="width: 100%">
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
      <header>
        <el-button
          type="primary"
          @click="
            () => {
              this.changeLogoConfig.showDialog = true;
            }
          "
          >增加支持项</el-button
        >
      </header>
      <div class="bottom-content">
        <div v-for="(item, index) in tableList" :key="index">
          <table-content @addExample="addExample" :key="item.id" :data="item">
          </table-content>
        </div>
      </div>
    </div>
    <!-- 增加支持项 -->
    <iot-dialog :dialogConfig="changeLogoConfig" @confirmBtn="confirmAddSupportProt(arguments)">
      <template slot="supportName">
        <el-select
          v-model="changeLogoConfig.model.supportName"
          placeholder="请选择"
          @change="changeSelect($event)"
          value-key="id"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="{ name: item.name, id: item.id }"
          ></el-option>
        </el-select>
      </template>
    </iot-dialog>
    <!-- 增加实例弹框 -->
    <iot-dialog :dialogConfig="addExampleConfig" @confirmBtn="confirmAddExample(arguments)">
      <template slot="exampleName">
        <el-input v-model="addExampleConfig.model.exampleName" style="width:400px"></el-input>
      </template>
      <template slot="type">
        <el-select
        style="width:400px"
          v-model="addExampleConfig.model.type"
          placeholder="请选择"
          @change="changeSelect($event)"
          value-key="id"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="{ name: item.name, id: item.id }"
          ></el-option>
        </el-select>
      </template>
    </iot-dialog>
  </div>
</template>

<script>
import { FilterForm, DatePicker } from "@/components";
import iotDialog from "@/components/iot-dialog";
import tableContent from "./components/tableContent.vue";
export default {
  components: {
    FilterForm,
    DatePicker,
    iotDialog,
    tableContent,
  },
  data() {
    return {
      showForm: false,
      form: {},
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
      changeLogoConfig: {
        showDialog: false,
        title: "增加支持项",
        dialogWidth: 600,
        model: {
          supportName: "",
        },
        formGroup: [
          { label: "支持项名称", type: "auto", filed: "supportName", width: "260px" },
        ],
        rules: {},
      },
      options: [
        { name: "支持任务调度(xxl-job)", id: "1" },
        { name: "支持缓存(redis)", id: "2" },
        { name: "支持数据库", id: "3" },
      ],
      tableList: [
        {
          id: "1",
          name: "支持任务调度(xxl-obj)",
          children: [
            {
              id: "1-1",
              name: "用户数据库",
              children: [
                { id: "1-1-1", key: "spring.dirud.db.username", value: "root" },
                { id: "1-1-2", key: "spring.dirud.db.password", value: "root" },
                {
                  id: "1-1-3",
                  key: "spring.dirud.db.connectedstring",
                  value: "jdbc.mysql://192.168.20.172:3306/userdb?user",
                },
              ],
            },
            {
              id: "1-2",
              name: "订单数据库",
              children: [
                { id: "1-2-1", key: "spring.dirud.db.username", value: "jmkj" },
                { id: "1-2-2", key: "spring.dirud.db.password", value: "jmkj@2021" },
                {
                  id: "1-2-3",
                  key: "spring.dirud.db.connectedstring",
                  value: "jdbc.mysql://192.168.20.172:3306/userdb?user",
                },
              ],
            },
          ],
        },
        {
          id: "2",
          name: "支持消息队列",
          children: [
            {
              id: "2-1",
              name: "用户数据库",
              children: [
                { id: "2-1-1", key: "spring.dirud.db.username", value: "root" },
                { id: "2-1-2", key: "spring.dirud.db.password", value: "root" },
                {
                  id: "2-1-3",
                  key: "spring.dirud.db.connectedstring",
                  value: "jdbc.mysql://192.168.20.172:3306/userdb?user",
                },
              ],
            },
            {
              id: "2-2",
              name: "订单数据库",
              children: [
                { id: "2-2-1", key: "spring.dirud.db.username", value: "jmkj" },
                { id: "2-2-2", key: "spring.dirud.db.password", value: "jmkj@2021" },
                {
                  id: "2-2-3",
                  key: "spring.dirud.db.connectedstring",
                  value: "jdbc.mysql://192.168.20.172:3306/userdb?user",
                },
              ],
            },
          ],
        },
      ],
      addExampleConfig: {
        showDialog: false,
        title: "增加实例",
        dialogWidth: 600,
        model: {
          exampleName: "",
          type: "",
        },
        formGroup: [
          { label: "实例名称", type: "auto", filed: "exampleName"},
          { label: "类型", type: "auto", filed: "type"},
        ],
        rules: {},
      },
      exampleId:'', // 当前选中的实例id
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
    // 增加支持项
    addSupportPro() {},
    // 支持项名称下拉框
    changeSelect(event) {},
    // 子组件传来的添加实例
    addExample(id) {
      this.addExampleConfig.showDialog = true;
      this.exampleId = id;
    },
    // 确认添加支持项
    confirmAddSupportProt(e){
       this.tableList.push({id:this.tableList.length,name:e[0].supportName.name,children:[]});
       this.changeLogoConfig.showDialog = false;
    },
    // 确认添加实例
    confirmAddExample(e){
        const targetData = this.tableList.find(item => item.id === this.exampleId);
        // const id = targetData.children[targetData.children.length - 1].id
        // const needId = id + '-' + (Number(id.substring(id.length - 1)) + 1);
        targetData.children.push({id:5,name:e[0].exampleName});
        this.addExampleConfig.showDialog = false;
    }
  },
};
</script>
<style lang="scss" scoped>
.support-pro-setting {
  .app-content-wrap {
    header {
      margin-bottom: 20px;
    }
  }
}
</style>
