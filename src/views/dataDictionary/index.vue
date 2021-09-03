<template>
  <div class="data-dictionary">
    <FilterForm @toggle="() => (this.showForm = !this.showForm)" @onSearch='onSearch' @onClear='onClear'>
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form
            label-width="100px"
            :inline="true"
            :model="form"
            ref="form"
            class="demo-form-inline"
          >
            <el-col :span="7">
              <el-form-item label="字典编码：" prop="code">
                <el-input size="small" v-model.trim="form.code" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="字典名称：" prop="name">
                <el-input size="small" v-model.trim="form.name" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="所属组：" prop="groupS">
                <el-input size="small" v-model.trim="form.groupS" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="tip">
                  <el-form-item label="内置标识：" prop="isInner">
                    <el-select size="small" v-model="form.isInner" placeholder="请选择">
                      <el-option key="all" label="全部" value></el-option>
                      <el-option :key="1" label="是" :value="1"></el-option>
                      <el-option :key="0" label="否" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="description">
                  <el-form-item label="备注：" prop="description">
                    <el-input size="small" v-model.trim="form.description" placeholder="请输入关键字" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14" key="date">
                  <el-form-item label="添加时间：" prop="startTime" class="datepicker">
                    <date-picker
                      :disabledDate="{
                        compareTime: this.form.endTime,
                        type: 'start'
                      }"
                      :date="form.startTime"
                      @change="v=>form.startTime = v"
                    ></date-picker>
                    <span style="margin:0 10px;">~</span>
                  </el-form-item>
                  <el-form-item prop="endTime" class="datepicker">
                    <date-picker
                      fullday
                      :date="form.endTime"
                      :disabledDate="{
                        compareTime: this.form.startTime,
                        type: 'end'
                      }"
                      @change="v=>form.endTime = v"
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
      <TreeTable
        ref="treetable"
        :treeConfig="treeConfig"
        :treeData="treeData"
        class="treeTable-warpper"
      >
        <template slot="url" slot-scope="scope">
          <a href>{{ scope.row.url === "" ? "-" : scope.row.url }}</a>
        </template>
        <template slot="operationBtn">
          <el-button
            icon="el-icon-plus"
            type="primary"
            style="float: right"
            @click="addDataDictionary({ type: 'add' })"
            v-has
          >添加类型</el-button>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-link type="primary" @click="viewDetail(scope.row)" v-has>查看</el-link>
          <el-link
            type="primary"
            @click="addDataDictionary({type:'equative',id:scope.row.id})"
            v-has
          >插入同级节点</el-link>
          <el-link
            type="primary"
            @click="addDataDictionary({type:'addChild',id:scope.row.id})"
            v-has
          >添加子节点</el-link>
          <el-link type="primary" @click="editDataDictionary({type:'edit',id:scope.row.id})" v-has>修改</el-link>
          <el-link
            :disabled="!!scope.row.isInner"
            :type="scope.row.isInner ? 'info' :'danger'"
            @click="invalid('single',scope.row)"
            v-has
          >作废</el-link>
        </template>
      </TreeTable>
      </div>
    
  </div>
</template>

<script>
import { DatePicker, FilterForm } from '@/components'
import { TreeTable, AppMainHeader } from '@/components'
import { getList, deleteData } from '@/api/dataDictionary'
export default {
  components: {
    FilterForm,
    DatePicker,
    AppMainHeader,
    TreeTable
  },
  data() {
    return {
      form: {
        code: '',
        name: '',
        groupS: '',
        isInner: '',
        description: '',
        startTime: '',
        endTime: ''
      },
      showForm: false,
      treeConfig: {
        showCheckbox: false,
        showHeader: true,
        showFooter: false,
        clientWidth: 0,
        props: {
          children: 'childList' //根据这个值遍历节点。
        },
        nodeKey: 'resourceId', //节点数的唯一标识
        defaultExpandAll: true,
        headers: [
          { title: '字典名称', field: 'name', width: '25%', showIcon: true },
          { title: '字典编码', field: 'code', width: '25%' },
          { title: '备注', field: 'description', width: '20%' },
          { title: '操作', tdTemplate: 'operation', width: '30%' }
        ]
      },
      treeData: []
    }
  },
  created() {
    this._getList()
  },
  mounted() {
    this.treeConfig.clientWidth = document.getElementsByClassName(
      'treeTable-warpper'
    )[0].clientWidth
  },
  methods: {
    // 添加或修改类型
    addDataDictionary(obj) {
      this.$router.push({ path: '/dataDictionary/add', query: { data: JSON.stringify(obj) } })
    },
    editDataDictionary(obj) {
      this.$router.push({ path: '/dataDictionary/edit', query: { data: JSON.stringify(obj) } })
    },
    // 获取列表
    async _getList() {
      const params = {
        ...this.form
      }
      const { code, data, msg } = await getList(params)
      if (code === '200') {
        this.treeData = data
      }
    },
    onSearch() {
      this._getList()
    },
    onClear() {
      this.$refs.form.resetFields()
      this._getList()
    },
    // 查看详情
    viewDetail(row) {
      this.$router.push({ path: '/dataDictionary/detail', query: { id: row.id } })
    },
    invalid(type, row) {
      this.$refs.treetable.invalid(type, row).then(async params => {
        const { code, data, message } = await deleteData(params)
        this.responseHandler(code, data, message).then(res=>{
          this.onSearch()
        })
      })
    }
  }
}
</script>
