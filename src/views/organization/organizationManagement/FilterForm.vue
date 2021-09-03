<template>
  <div class="filter-wrap">
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
              <el-form-item label="机构编码：" prop="code">
                <el-input v-model="form.code" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="机构名称：" prop="name">
                <el-input v-model="form.name" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="机构状态：" prop="isEnabled">
                <el-select v-model="form.isEnabled" placeholder="请选择机构状态">
                  <el-option value label="全部">全部</el-option>
                  <el-option :value="1" label="已启用">已启用</el-option>
                  <el-option :value="0" label="已禁用">已禁用</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition"> 
              <template v-if="showForm">
                <el-col :span="7" key="legalPerson">
                  <el-form-item label="法人代表：" prop="legalPerson">
                    <el-input v-model="form.legalPerson" placeholder="请输入关键字" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="contactPhone">
                  <el-form-item label="联系电话：" prop="contactPhone">
                    <el-input v-model="form.contactPhone" placeholder="请输入关键字" maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="contactEmail">
                  <el-form-item label="电子邮箱：" prop="contactEmail">
                    <el-input v-model="form.contactEmail" placeholder="请输入关键字" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="address">
                  <el-form-item label="地址：" prop="address">
                    <el-input v-model="form.address" placeholder="请输入关键字" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="description">
                  <el-form-item label="备注：" prop="description">
                    <el-input v-model="form.description" placeholder="请输入关键字" maxlength="500"></el-input>
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
import { FilterForm, DatePicker } from '@/components'
import { deepCopy } from '@/utils'

export default {
  components: {
    FilterForm,
    DatePicker
  },
  data() {
    return {
      form: {
        code: '',
        name: '',
        isEnabled: '',
        legalPerson: '',
        contactPhone: '',
        contactEmail: '',
        address: '',
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
      let searchParmas = deepCopy(this.form)
      this.$emit('onSearch', searchParmas)
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
