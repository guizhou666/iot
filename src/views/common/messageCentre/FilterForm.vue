<template>
  <div class="filter-wrap">
    <FilterForm @toggle="() => (this.showForm = !this.showForm)" @onSearch='onSearch' @onClear='onClear'>
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form
            :inline="true"
            :model="form"
            ref="form"
            class="demo-form-inline"
          >
            <el-col :span="7">
              <el-form-item :label="$t('messageCenter.status')" prop="userAccount">
                <el-select size="small" v-model="form.loginInfo" :placeholder="$t('selectTip')">
                  <el-option value label="全部">全部</el-option>
                  <el-option
                    v-for="(item, index) in status"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('messageCenter.messageType')" prop="userAccount">
                <el-select size="small" v-model="form.loginInfo" :placeholder="$t('selectTip')">
                  <el-option value label="全部">全部</el-option>
                  <el-option
                    v-for="(item, index) in status"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="$t('messageCenter.title')" prop="appId">
                <el-input size="small" v-model.trim="form.appId" :placeholder="$t('inputTip')" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="messageSource">
                  <el-form-item :label="$t('messageCenter.messageSource')" prop="userAccount">
                    <el-select size="small" v-model="form.loginInfo">
                      <el-option value label="全部">全部</el-option>
                      <el-option
                        v-for="(item, index) in status"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="moduleName">
                  <el-form-item :label="$t('messageCenter.moduleName')" prop="userAccount">
                    <el-select size="small" v-model="form.loginInfo">
                      <el-option value label="全部">全部</el-option>
                      <el-option
                        v-for="(item, index) in status"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="14" key="date">
                  <el-form-item :label="$t('messageCenter.cancellationTime')" prop="createdTimeStart" class="datepicker">
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
  components: { FilterForm,DatePicker },
  data() {
    return {
      form: {
        userAccount: '',
        realName: '',
        date: [],
        appid: '',
        createdTimeStart: '',
        createdTimeEnd: '',
        loginInfo: ''
      },
      showForm: false,
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      status: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '未读'
        },
        {
          value: '2',
          label: '已读'
        }
      ]
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
