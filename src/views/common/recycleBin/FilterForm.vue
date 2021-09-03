<template>
  <div class="filter-wrap">
    <FilterForm @toggle="()=> this.showForm = !this.showForm" @onSearch='onSearch' @onClear='onClear'>
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form :inline="true" :model="form" ref="form" class="demo-form-inline" label-width="80px">
            <el-col :span="7">
              <el-form-item label="数据类型" prop="code">
                <el-select size="small" v-model="form.behavior" placeholder="请选择">
                  <el-option value label="全部">全部</el-option>
                  <el-option
                    v-for="(item,index) in options"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="作废时间" prop="createdTimeStart" class="datepicker">
                <el-date-picker
                  class="form-item"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="startPickerOptions"
                  v-model="form.createdTimeStart"
                  placeholder="年/月/日"
                ></el-date-picker>
                <span style="margin:0 10px;">~</span>
              </el-form-item>
              <el-form-item prop="createdTimeEnd" class="datepicker">
                <el-date-picker
                  class="form-item"
                  :picker-options="endPickerOptions"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="form.createdTimeEnd"
                  placeholder="年/月/日"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="name">
                  <el-form-item label="数据名称" prop="description">
                    <el-input size="small" v-model.trim="form.appid" placeholder="请输入关键字" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="date">
                  <el-form-item label="操作人" prop="date">
                    <el-input size="small" v-model.trim="form.appid" placeholder="请输入关键字" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="behavior">
                  <el-form-item label="姓名" prop="description">
                    <el-input size="small" v-model.trim="form.appid" placeholder="请输入关键字" maxlength="50"></el-input>
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
        code: '',
        name: '',
        description: '',
        date: [],
        appid: '',
        behavior: ''
      },
      showForm: false,
      startPickerOptions: {
        disabledDate: time => {
          let createdTimeEnd = new Date(this.form.createdTimeEnd).getTime()
          return time.getTime() > createdTimeEnd - 24 * 60 * 60 * 1000
        }
      },
      endPickerOptions: {
        disabledDate: time => {
          let createdTimeStart = new Date(this.form.createdTimeStart).getTime()
          return time.getTime() < createdTimeStart + 24 * 60 * 60 * 1000
        }
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