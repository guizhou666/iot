<template>
  <div class="filter-wrap">
    <FilterForm @toggle="() => (this.showForm = !this.showForm)" @onSearch="onSearch" @onClear="onClear">
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
            <el-col :span="7">
              <el-form-item label="岗位编码：" prop="userAccount">
                <el-input size="small" v-model.trim="form.userAccount" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="岗位名称：" prop="realName">
                <el-input size="small" v-model.trim="form.realName" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="职责：" prop="appId">
                <el-input size="small" v-model.trim="form.appId" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform">
              <template v-if="showForm">
                <el-col :span="7" key="remark">
                  <el-form-item label="备注：" prop="remark">
                    <el-input size="small" v-model.trim="form.appId" placeholder="请输入关键字" maxlength="500"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14" key="date">
                  <el-form-item label="添加时间：" prop="date" class="datepicker">
                    <el-date-picker v-model="form.date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:SS"></el-date-picker>
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
import FilterForm from '@/components/FilterForm'
import { deepCopy } from '@/utils'

export default {
  name: 'PersonalFile',
  components: { FilterForm },
  data() {
    return {
      form: {
        userAccount: '',
        realName: '',
        date: [],
        appid: '',
        loginInfo: ''
      },
      showForm: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
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
      ]
    }
  },
  methods: {
    //   检验是否为空
    validate(form) {
      const formValues = Object.values(form)
      const validate = formValues.some((item) => {
        if (typeof item === 'string') {
          return item !== ''
        } else if (Array.isArray(item)) {
          return item.length
        }
      })
      return validate
    },
    onSearch() {
      if (!this.validate(this.form)) {
        return this.$message({
          type: 'warning',
          message: '请输入查询条件',
          duration: 1000
        })
      }
      this.handleSearchParams()
    },
    onClear() {
      if (!this.validate(this.form)) {
        return this.$message({
          message: '未填写任何查询条件',
          duration: 1000
        })
      }
      this.$refs.form.resetFields()
      this.handleSearchParams()
    },
    handleSearchParams() {
      const [createdTimeStart, createdTimeEnd] = this.form.date
      let searchParmas = Object.assign(deepCopy(this.form), {
        createdTimeStart,
        createdTimeEnd
      })
      delete searchParmas.date
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
