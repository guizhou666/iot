<template>
  <div class="innerMessage-searchForm">
    <el-row class="form-wrapper">
      <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="80px">
        <el-col :span="6">
          <el-form-item label="标题" prop="userAccount">
            <el-input
              size="small"
              v-model.trim="form.userAccount"
              placeholder="请输入关键字"
              maxlength="50"    
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="发件人" prop="realName">
            <el-input size="small" v-model.trim="form.realName" placeholder="请输入关键字" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收件人" prop="appId">
            <el-input size="small" v-model.trim="form.appId" placeholder="请输入关键字" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="附件" prop="appId">
            <el-input size="small" v-model.trim="form.appId" placeholder="请输入关键字" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="状态" prop="appId">
            <el-input size="small" v-model.trim="form.appId" placeholder="请输入关键字" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" key="date">
          <el-form-item label="发送时间" prop="startTime" class="datepicker">
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
        <el-col :span="5">
          <el-form-item label="范围" prop="appId">
            <el-input size="small" v-model.trim="form.appId" placeholder="请输入关键字" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button size="small" type="primary" @click="onSearch">{{$t('search')}}</el-button>
          <el-button size="small" @click="onClear">{{$t('clear')}}</el-button>
        </el-col>
      </el-form>
    </el-row>
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
        isEnabled: '',
        legalPerson: '',
        contactPhone: '',
        contactEmail: '',
        address: '',
        description: '',
        startTime: '',
        endTime: ''
      },
      showForm: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      options: []
    }
  },
  methods: {
    //   检验是否为空
    validate(form) {
      const formValues = Object.values(form)
      const validate = formValues.some(item => {
        if (typeof item === 'string') {
          return item !== ''
        } else if (Array.isArray(item)) {
          return item.length
        }
      })
      return validate
    },
    onSearch() {
      //   if (!this.validate(this.form)) {
      //     return this.$message({
      //       type: 'warning',
      //       message: '请输入查询条件',
      //       duration: 1000
      //     })
      //   }
      this.handleSearchParams()
    },
    onClear() {
      //   if (!this.validate(this.form)) {
      //     return this.$message({
      //       message: '未填写任何查询条件',
      //       duration: 1000
      //     })
      //   }
      this.$refs.form.resetFields()
      this.handleSearchParams()
    },
    handleSearchParams() {
      const [createdTimeStart, createdTimeEnd] = this.form.date
      let searchParmas = Object.assign(deepCopy(this.form), { createdTimeStart, createdTimeEnd })
      delete searchParmas.date
      this.$emit('onSearch', searchParmas)
    }
  }
}
</script>

<style lang="scss" scoped>
.innerMessage-searchForm {
    margin-top: 8px;
    padding-top: 30px;
    border-top: 1px solid #f5f5f5;
}
</style>