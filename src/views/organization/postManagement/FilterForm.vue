<template>
  <div class="filter-wrap">
    <FilterForm
      @toggle="() => (this.showForm = !this.showForm)"
      @onSearch="onSearch"
      @onClear="onClear"
    >
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form :inline="true" label-width="100px" :model="form" ref="form" class="demo-form-inline">
            <el-col :span="7">
              <el-form-item :label="$t('postManagement.postCode')" prop="code">
                <el-input size="small" v-model.trim="form.code" :placeholder="$t('inputTip')" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('postManagement.postName')" prop="name">
                <el-input size="small" v-model.trim="form.name" :placeholder="$t('inputTip')" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('postManagement.duty')" prop="duty">
                <el-input size="small" v-model.trim="form.duty" :placeholder="$t('inputTip')" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="remark">
                  <el-form-item :label="$t('remark')" prop="description">
                    <el-input
                      size="small"
                      v-model.trim="form.description"
                      :placeholder="$t('inputTip')"
                      maxlength="500"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" key="date">
                  <el-form-item :label="$t('addTime')" prop="startTime" class="datepicker">
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
        startTime: '',
        endTime: '',
        duty: '',
        description: ''
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
    //   this.$parent.departmentName = ''
    //   this.$parent.nowChooseDep = ''
    //   this.$parent._getDepartmentTree()
      this.handleSearchParams()
    },
    handleSearchParams() {
      let searchParmas = deepCopy(this.form)
      this.$emit('onSearch', searchParmas)
    }
  }
}
</script>


