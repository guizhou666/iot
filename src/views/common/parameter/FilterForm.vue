<template>
  <div class="filter-wrap">
    <FilterForm @toggle="()=> this.showForm = !this.showForm" @onSearch='onSearch' @onClear='onClear'>
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
              <el-form-item label="参数编码：" prop="code">
                <el-input size="small" v-model.trim="form.code" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="参数名称：" prop="name">
                <el-input size="small" v-model.trim="form.name" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="内置标识：" prop="isInner">
                <el-select size="small" v-model="form.isInner">
                  <el-option key="全部" label="全部" value>全部</el-option>
                  <el-option key="0" label="是" :value="1">是</el-option>
                  <el-option key="1" label="否" :value="0">否</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7">
                  <el-form-item label="用户状态：" prop="isEnabled">
                    <el-select size="small" v-model="form.isEnabled" placeholder="请输入用户状态" filterable>
                      <el-option label="全部" value>全部</el-option>
                      <el-option label="已禁用" :value="0">已禁用</el-option>
                      <el-option label="已启用" :value="1">已启用</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="7" key="phone">
                  <el-form-item label="备注：" prop="description">
                    <el-input size="small" v-model.trim="form.description" placeholder="请输入备注" maxlength="500"></el-input>
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
  </div>
</template>

<script>
import { DatePicker, FilterForm } from '@/components'
import { deepCopy } from '@/utils'

export default {
  name: 'Parameter',
  components: { FilterForm, DatePicker },
  data() {
    return {
      form: {
        code: '',
        name: '',
        isInner: '',
        description: '',
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
      this.$emit('onSearch', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  @include font_color('font_color1');
}
.btn-group {
  & span {
    padding: 0 10px;
    color: #00adff;
  }
}
/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.4s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
