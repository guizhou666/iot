<template>
  <div class="filter-wrap">
    <FilterForm
      @toggle="()=> this.showForm = !this.showForm"
      @onSearch="onSearch"
      @onClear="onClear"
    >
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form
            label-width="80px"
            :inline="true"
            :model="form"
            ref="form"
            class="demo-form-inline"
          >
            <el-col :span="7">
              <el-form-item label="产品编码" prop="code">
                <el-input size="small" v-model.trim="form.code" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="产品名称" prop="name">
                <el-input size="small" v-model.trim="form.name" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="产品状态" prop="isEnabled">
                <el-select size="small" v-model="form.isEnabled">
                  <el-option value label="全部">全部</el-option>
                  <el-option :value="1" label="已启用">已启用</el-option>
                  <el-option :value="0" label="已禁用">已禁用</el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="version">
                  <el-form-item label="版本号" prop="version">
                    <el-input
                      size="small"
                      v-model.trim="form.version"
                      placeholder="请输入关键字"
                      maxlength="20"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="description">
                  <el-form-item label="备注" prop="description">
                    <el-input
                      size="small"
                      v-model.trim="form.description"
                      placeholder="请输入关键字"
                      maxlength="500"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14" key="date">
                  <el-form-item label="添加时间" prop="startTime" class="datepicker">
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
  </div>
</template>

<script>
import { FilterForm, DatePicker } from '@/components'
import { deepCopy } from '@/utils'

export default {
  name: 'PersonalFile',
  components: { FilterForm, DatePicker },
  data() {
    return {
      form: {
        code: '',
        name: '',
        description: '',
        isEnabled: '',
        version: '',
        startTime: '',
        endTime: ''
      },
      showForm: false
    }
  },
  methods: {
    onSearch() {
      this.handleSearchParams()
    },
    onClear() {
      this.$refs.form.resetFields()
      this.handleSearchParams()
    },
    handleSearchParams() {
      let searchParmas = deepCopy(this.form)
      this.$emit('onSearch', searchParmas)
    }
  }
}
</script>
