<template>
  <div class="filter-wrap">
    <FilterForm @toggle="()=> this.showForm = !this.showForm" @onSearch='onSearch' @onClear='onClear'>
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form label-width="100px" :inline="true" :model="form" ref="form" class="demo-form-inline">
            <el-col :span="7">
              <el-form-item label="用户名：" prop="userAccount">
                <el-input size="small" v-model="form.userAccount" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="所属角色：" prop="roleId">
                <el-select size="small" v-model="form.roleId" filterable>
                  <el-option key="全部" label="全部" value>全部</el-option>
                  <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id">{{role.name}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="用户状态：" prop="isEnabled">
                <el-select size="small" v-model="form.isEnabled" placeholder="请输入用户状态" filterable>
                  <el-option label="全部" value>全部</el-option>
                  <el-option label="已禁用" :value="0">已禁用</el-option>
                  <el-option label="已启用" :value="1">已启用</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="phone">
                  <el-form-item label="联系电话：" prop="phone">
                    <el-input size="small" v-model="form.phone" placeholder="请输入关键字" maxlength="11"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="email">
                  <el-form-item label="电子邮箱：" prop="email">
                    <el-input size="small" v-model="form.email" placeholder="请输入关键字"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="realName">
                  <el-form-item label="姓名：" prop="realName">
                    <el-input size="small" v-model="form.realName" placeholder="请输入关键字" maxlength="50"></el-input>
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
import { getRoleList } from '@/api/roleManage'

export default {
  name: 'PersonalFile',
  components: { FilterForm },
  data() {
    return {
      form: {
        userAccount: '',
        roleId: '',
        phone: '',
        email: '',
        realName: '',
        isEnabled: ''
      },
      showForm: false,
      roleList: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { code, data, msg } = await getRoleList()
      if (code == '200') {
        this.roleList = data
      }
    },
    onSearch() {
      this.$emit('onSearch', this.form)
    },
    onClear() {
      this.$refs.form.resetFields()
      this.$emit('onSearch', this.form)
    }
  }
}
</script>
