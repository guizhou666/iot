<template>
  <div class="department-wrap">
    <FilterForm
      @toggle="() => (this.showForm = !this.showForm)"
      @onClear="onClear"
      @onSearch="onSearch"
    >
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
            <el-col :span="7">
              <el-form-item :label="$t('departmentManagement.depCode')" prop="code">
                <el-input
                  v-model.trim="form.code"
                  :placeholder="$t('inputTip')"
                  maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('departmentManagement.depName')" prop="name">
                <el-input
                  v-model.trim="form.name"
                  :placeholder="$t('inputTip')"
                  maxlength="50"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('remark')" prop="description">
                <el-input
                  v-model.trim="form.description"
                  :placeholder="$t('inputTip')"
                  maxlength="500"
                ></el-input>
              </el-form-item>
            </el-col>
            <transition name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="12" key="date">
                  <el-form-item
                    :label="$t('addTime')"
                    prop="startTime"
                    class="datepicker"
                  >
                    <date-picker
                      :disabledDate="{
                        compareTime: this.form.endTime,
                        type: 'start',
                      }"
                      :date="form.startTime"
                      @change="(v) => (form.startTime = v)"
                    ></date-picker>
                    <span style="margin: 0 10px">~</span>
                  </el-form-item>
                  <el-form-item prop="endTime" class="datepicker">
                    <date-picker
                      fullday
                      :date="form.endTime"
                      :disabledDate="{
                        compareTime: this.form.startTime,
                        type: 'end',
                      }"
                      @change="(v) => (form.endTime = v)"
                    ></date-picker>
                  </el-form-item>
                </el-col>
              </template>
            </transition>
          </el-form>
        </el-row>
      </template>
    </FilterForm>
    <div class="app-content-wrap">
      <TreeTable
        ref="treetable"
        :treeConfig="treeConfig"
        :treeData="treeData"
        class="treeTable-warpper"
      >
        <template slot="operationBtn">
          <el-button
            icon="el-icon-plus"
            style="float: right"
            type="primary"
            @click="addDepartment({ type: 'add' })"
            v-has
            >添加部门</el-button
          >
        </template>
        <template slot="operation" slot-scope="scope">
          <el-link type="primary" @click="viewDetail(scope.row)" v-has>查看</el-link>
          <el-link
            type="primary"
            @click="addDepartment({ type: 'equative', data: scope.row })"
            v-has
            >插入同级节点</el-link
          >
          <el-link
            type="primary"
            @click="addDepartment({ type: 'addChild', data: scope.row })"
            v-has
            >添加子节点</el-link
          >
          <el-link
            type="primary"
            @click="addDepartment({ type: 'edit', data: scope.row })"
            v-has
            >修改</el-link
          >
          <el-link type="danger" @click="invalid('single', scope.row)" v-has
            >作废</el-link
          >
        </template>
      </TreeTable>
    </div>
  </div>
</template>

<script>
import { TreeTable, AppMainHeader, FilterForm, DatePicker } from "@/components";
import { deepCopy } from "@/utils";
import { getDepartmentTree, deleteDepartment } from "@/api/postManage";
export default {
  name: "PersonalFile",
  components: { FilterForm, DatePicker, TreeTable, AppMainHeader },
  data() {
    return {
      form: {
        code: "",
        name: "",
        startTime: "",
        endTime: "",
        description: "",
      },
      showForm: false,
      treeConfig: {
        showCheckbox: false,
        showHeader: true,
        showFooter: false,
        clientWidth: 0,
        props: {
          children: "childList", //根据这个值遍历节点。
        },
        nodeKey: "resourceId", //节点数的唯一标识
        defaultExpandAll: true,
        headers: [
          {
            title: this.$t("departmentManagement.depName"),
            field: "name",
            width: "25%",
            showIcon: true,
          },
          { title: this.$t("departmentManagement.depCode"), field: "code", width: "25%" },
          { title: this.$t("remark"), field: "description", width: "20%" },
          { title: this.$t("opraction"), tdTemplate: "operation", width: "30%" },
        ],
      },
      treeData: [],
    };
  },
  created() {
    this._getDepartmentTree();
  },
  mounted() {
    this.treeConfig.clientWidth = document.getElementsByClassName(
      "treeTable-warpper"
    )[0].clientWidth;
  },
  methods: {
    onSearch() {
      this.handleSearchParams();
    },
    onClear() {
      this.$refs.form.resetFields();
      this.handleSearchParams();
    },
    handleSearchParams() {
      this._getDepartmentTree();
    },
    // 查看详情
    viewDetail(row) {
      this.$router.push({
        path: "/departmentManagement/detail",
        query: { departmentId: row.id, code: row.code, id: row.id },
      });
    },
    // 获取部门树
    async _getDepartmentTree() {
      const params = {
        ...this.form,
      };
      const { code, data, msg } = await getDepartmentTree(params);
      if (code === "200") {
        this.treeData = data;
      }
    },
    // 添加或编辑部门
    addDepartment(obj) {
      if (obj.type === "edit") {
        this.$router.push({
          path: `/departmentManagement/editDepartment`,
          query: { data: JSON.stringify(obj) },
        });
      } else {
        this.$router.push({
          path: `/departmentManagement/addDepartment`,
          query: { data: JSON.stringify(obj) },
        });
      }
    },
    invalid(type, row) {
      this.$refs.treetable.invalid(type, row).then(async (params) => {
        const { code, data, message } = await deleteDepartment(params);
        this.responseHandler(code, data, message).then((res) => {
          this._getDepartmentTree();
        });
      });
    },
  },
};
</script>
