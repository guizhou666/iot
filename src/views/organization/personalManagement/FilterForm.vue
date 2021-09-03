<template>
  <div class="filter-wrap">
    <FilterForm @toggle="() => (this.showForm = !this.showForm)" @onSearch='onSearch' @onClear='onClear'>
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form label-width="80px" :inline="true" :model="form" ref="form" class="demo-form-inline">
            <el-col :span="7">
              <el-form-item label="工号" prop="code">
                <el-input size="small" v-model.trim="form.code" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" key="name">
              <el-form-item label="姓名" prop="name">
                <el-input size="small" v-model.trim="form.name" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7" key="gender">
              <el-form-item label="性别" prop="gender">
                <el-select size="small" v-model.trim="form.gender">
                  <el-option label="全部" value>全部</el-option>
                  <el-option label="男" :value="1">男</el-option>
                  <el-option label="女" :value="2">女</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="phone">
                  <el-form-item label="联系电话" prop="phone">
                    <el-input size="small" v-model.trim="form.phone" placeholder="请输入关键字" maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="email">
                  <el-form-item label="电子邮箱" prop="email">
                    <el-input size="small" v-model.trim="form.email" placeholder="请输入关键字" maxlength="50"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="post">
                  <el-form-item label="岗位" prop="postId">
                    <el-select size="small" v-model="form.postId" placeholder="请选择岗位">
                      <el-option label="全部" value>全部</el-option>
                      <el-option v-for="post in postList" :key="post.id" :label="post.name" :value="post.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="description">
                  <el-form-item label="备注" prop="description">
                    <el-input size="small" v-model.trim="form.description" placeholder="请输入关键字" maxlength="500"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="14" key="addTime">
                  <el-form-item label="添加时间" prop="startTime" class="datepicker">
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
import { getPostList } from '@/api/postManage'

export default {
  name: 'PersonalFile',
  components: { FilterForm, DatePicker },
  data() {
    return {
      form: {
        code: '',
        name: '',
        userAccount: '',
        realName: '',
        startTime: '',
        endTime: '',
        appid: '',
        loginInfo: '',
        gender: '',
        phone: '',
        email: '',
        description: '',
        postId: ''
      },
      showForm: false,
      postList: []
    }
  },
  created() {
    this.getPostList()
  },
  methods: {
    getPostList() {
      getPostList().then((res) => {
        this.postList = res.data.records
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
