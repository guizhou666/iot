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
              <el-form-item :label="$t('myProduct.productCode')"  prop="code">
                <el-input size="small" v-model.trim="form.code" :placeholder="$t('inputTip')" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('myProduct.productName')" prop="parentName">
                <el-input size="small" v-model.trim="form.parentName" :placeholder="$t('inputTip')" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('myProduct.sysShowName')" prop="realName">
                <el-input size="small" v-model.trim="form.realName" :placeholder="$t('inputTip')" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="productState">
                  <el-form-item :label="$t('myProduct.productState')" prop="isEnabled">
                    <el-select size="small" v-model="form.isEnabled" placeholder="请选择">
                      <el-option value label="全部">全部</el-option>
                      <el-option
                        v-for="(item,index) in productState"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="showStyle">
                  <el-form-item :label="$t('myProduct.showStyle')" prop="displayStyle">
                    <el-select size="small" v-model="form.displayStyle" placeholder="请选择">
                      <el-option
                        v-for="(item,index) in options"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="14" key="date" v-if="userInfo.userType ==='租户'">
                  <el-form-item :label="$t('myProduct.loseTime')" prop="expireTimeStart" class="datepicker">
                    <date-picker
                      :disabledDate="{
                        compareTime: this.form.expireTimeEnd,
                        type: 'start'
                      }"
                      :date="form.expireTimeStart"
                      @change="v=>form.expireTimeStart = v"
                    ></date-picker>
                    <span style="margin:0 10px;">~</span>
                  </el-form-item>
                  <el-form-item prop="expireTimeEnd" class="datepicker">
                    <date-picker
                      fullday
                      :date="form.expireTimeEnd"
                      :disabledDate="{
                        compareTime: this.form.expireTimeStart,
                        type: 'end'
                      }"
                      @change="v=>form.expireTimeEnd = v"
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
        realName: '',
        parentName: '',
        date: [],
        isEnabled: '',
        displayStyle: '',
        expireTimeStart: '',
        expireTimeEnd: ''
      },
      showForm: false,
      productState: [
        { value: '0', label: '已禁用' },
        { value: '1', label: '已启用' }
      ]
    }
  },
  props: {
    options: {
      type: Array,
      default() {
        return []
      }
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