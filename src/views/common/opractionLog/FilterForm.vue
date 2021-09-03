<template>
  <div class="filter-wrap">
    <FilterForm @toggle="()=> this.showForm = !this.showForm" @onClear='onClear' @onSearch='onSearch'>
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="100px">
            <el-col :span="7">
              <el-form-item :label="$t('log.username')" prop="userAccount" label-width="90px">
                <el-input size="small" v-model.trim="form.userAccount" :placeholder="$t('inputTip')" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('log.name')" prop="realName">
                <el-input size="small" v-model.trim="form.realName" :placeholder="$t('inputTip')" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('log.opractionModules')" prop="module" label-width="150px">
                <el-select size="small" v-model="form.module" :placeholder="$t('inputTip')">
                  <el-option value label="全部">全部</el-option>
                  <el-option v-for="item in options" :key="item.module" :label="item.module" :value="item.module"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="14" key="date">
                  <el-form-item label="日志时间" prop="startTime" class="datepicker">
                    <date-picker :disabledDate="{
                        compareTime: this.form.endTime,
                        type: 'start'
                      }" :date="form.startTime" @change="v=>form.startTime = v"></date-picker>
                    <span style="margin:0 10px;">~</span>
                  </el-form-item>
                  <el-form-item prop="endTime" class="datepicker">
                    <date-picker fullday :date="form.endTime" :disabledDate="{
                        compareTime: this.form.startTime,
                        type: 'end'
                      }" @change="v=>form.endTime = v"></date-picker>
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
import { getOperateModule } from '@/api/logs'

export default {
  name: 'PersonalFile',
  components: { FilterForm, DatePicker },
  data() {
    return {
      form: {
        userAccount: '',
        realName: '',
        module: '',
        date: [],
        startTime: '',
        endTime: '',
      },
      showForm: false,
      options: [],
    }
  },
  created() {
    this.getOperateModule()
  },
  methods: {
    getOperateModule() {
      getOperateModule().then((res) => {
        this.options = res.data || []
      })
    },
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
    },
  },
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