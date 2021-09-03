<template>
  <div class="filter-wrap">
    <FilterForm
      @toggle="()=> this.showForm = !this.showForm"
      @onSearch="onSearch"
      @onClear="onClear"
    >
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
            <el-col :span="7">
              <el-form-item label="模板编码" prop="code">
                <el-input size="small" v-model="form.code" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="模板名称" prop="name">
                <el-input size="small" v-model="form.name" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="备注" prop="description">
                <el-input
                  size="small"
                  v-model="form.description"
                  placeholder="请输入关键字"
                  maxlength="500"
                ></el-input>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="type">
                  <el-form-item label="模板类型" prop="description">
                    <el-input size="small" v-model="form.type" placeholder="请输入关键字" maxlength="500"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14" key="date">
                  <el-form-item label="更新时间" prop="createdTimeStart" class="datepicker">
                    <date-picker
                      :disabledDate="{
                        compareTime: this.form.createdTimeEnd,
                        type: 'start'
                      }"
                      :date="form.createdTimeStart"
                      @change="v=>form.createdTimeStart = v"
                    ></date-picker>
                    <span style="margin:0 10px;">~</span>
                  </el-form-item>
                  <el-form-item prop="createdTimeEnd" class="datepicker">
                    <date-picker
                      fullday
                      :date="form.createdTimeEnd"
                      :disabledDate="{
                        compareTime: this.form.createdTimeStart,
                        type: 'end'
                      }"
                      @change="v=>form.createdTimeEnd = v"
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
        createdTimeStart: '',
        createdTimeEnd: ''
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

