<template>
  <div class="app-content-wrap addPerson">
    <AppMainHeader :title="$route.name=='Edit' ? '修改人员' : '添加人员'"></AppMainHeader>
    <el-form class="addPersonal_form" ref="form" :model="form" :rules="rules" label-width="240px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="工号" class="addPersonal_workid">
            <el-input v-if="$route.name === 'Add'" class="form-item" v-model="form.code" placeholder="请输入人员工号" maxlength="20">
              <el-tooltip slot="suffix" class="input_tip" content="不填写，则系统自动生成">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-input>
            <span v-else>{{ form.code }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="姓名" prop="name">
            <el-input class="form-item" v-model="form.name" placeholder="请输入姓名" maxlength="50">
              <i slot="prepend" class="el-icon-user"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="身份证" prop="papers">
            <el-input class="form-item" v-model="form.papers" placeholder="请输入身份证" maxlength="18">
              <i slot="prepend" class="el-icon-postcard"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="性别">
            <el-radio v-model="form.gender" :label="1">男</el-radio>
            <el-radio v-model="form.gender" :label="2">女</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="所属部门" prop="deptId">
            <el-cascader ref="department" class="form-item" v-model="form.deptId" :options="departTree" :props="departProps" clearable filterable placeholder="请选择"></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="岗位" prop="postIdList">
            <el-select filterable class="form-item" v-model="form.postIdList" placeholder="请选择" multiple :multiple-limit='10'>
              <el-option v-for="post in postList" :key="post.id" :label="post.name" :value="post.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话" prop="phone">
            <el-input class="form-item" v-model="form.phone" placeholder="请输入联系电话" maxlength="11">
              <i slot="prepend" class="el-icon-phone"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="电子邮箱" prop="email">
            <el-input class="form-item" v-model="form.email" placeholder="请输入邮箱地址">
              <i slot="prepend" class="el-icon-message"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" prop="description">
            <el-input class="form-item" type="textarea" v-model="form.description" :autosize="{ minRows: 7 }" placeholder="请输入备注信息" maxlength="500" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20" style="margin-bottom:40px">
          <AppMainHeader title="用户账号"></AppMainHeader>
        </el-col>
        <el-col :span="20">
          <el-form-item label="创建账号">
            <el-switch v-model="createAccount"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <transition-group name="fade-transform">
        <template v-if="createAccount">
          <el-row key="username">
            <el-col :span="10">
              <el-form-item label="用户名" prop="userAccount">
                <el-input v-if="$route.name === 'Add' || ($route.name == 'Edit' && createAccount)" v-model="form.userAccount" class="form-item" placeholder="请输入用户名" maxlength="50">
                  <i slot="prepend" class="el-icon-user"></i>
                </el-input>
                <span v-else>{{ form.userAccount }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row key="role">
            <el-col :span="10">
              <el-form-item label="角色" prop="roleIds">
                <el-select filterable multiple v-model="form.roleIds" class="form-item" placeholder="请选择">
                  <el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </transition-group>
    </el-form>
    <el-row type="flex" justify="center">
      <el-col :span="2">
        <el-button type="primary" @click="confirm">确定</el-button>
      </el-col>
      <el-col :span="2">
        <el-button plain @click="cancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import { getDepartmentTree, getPosts } from '@/api/postManage'
import { getPersonDetail, addTmPersons, editTmPersons } from '@/api/personalManage'
import { getRoles } from '@/api/roleManage'
import { clearEmptyChild } from '@/utils'

import {
  validateChinese,
  validateIdCard,
  validUsername,
  validatePhone,
  validateMail
} from '@/utils/validate'

export default {
  name: 'personalAddEdit',
  data() {
    return {
      form: {
        name: '',
        papers: '',
        gender: 1,
        deptId: '',
        email: '',
        phone: '',
        description: '',
        userAccount: '',
        postIdList: [],
        roleIds: []
      },
      ruleForm: {
        name: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          // { validator: validateChinese, trigger: 'blur' }
        ],
        papers: [
          { required: true, message: '请输入身份证', trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur' }
        ],
        postIdList: [{ required: true, message: '请选择岗位', trigger: 'change' }],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { validator: validateMail, trigger: 'blur' }
        ],
        userAccount: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      departProps: {
        label: 'name',
        value: 'id',
        children: 'childList',
        emitPath: false,
        checkStrictly: true
      },
      departTree: [],
      postList: [],
      roleList: [],
      createAccount: false
    }
  },
  components: {
    AppMainHeader
  },
  created() {
    if (this.$route.name == 'Edit') {
      this.getPersonDetail()
    } else {
      this.form.deptId = this.$route.query.id
    }
    this.getDepartmentTree()
    this.getPostList()
    this.getRoles()
  },
  methods: {
    async getPersonDetail() {
      const { code, data, msg } = await getPersonDetail({
        id: this.$route.query.id
      })
      if (code === '200') {
        Object.assign(this.form, data)
        this.createAccount = this.form.userAccount && this.form.roleIds.length ? true : false
      }
    },
    // 获取部门树
    async getDepartmentTree() {
      const { code, data, msg } = await getDepartmentTree()
      if (code === '200') {
        // this.delLastChildlist(data)
        this.departTree = clearEmptyChild(data, 'childList')
      }
    },
    // 获取角色
    // 这里要传入机构id，
    async getRoles() {
      const { code, data, msg } = await getRoles()
      if (code === '200') {
        this.roleList = data.records
      }
    },
    delLastChildlist(data) {
      data.map((item) => {
        if (item.childList && item.childList.length) {
          this.delLastChildlist(item.childList)
        } else {
          delete item.childList
        }
      })
    },
    async getPostList() {
      const { code, data, msg } = await getPosts()
      if (code == 200) {
        this.postList = data
      }
    },
    confirm() {
      this.$refs.form.validate((validate) => {
        if (validate) {
          // 不创建账号的话，form去掉用户名和密码
          if (!this.createAccount) {
            this.form.userAccount = ''
            this.form.roleIds = []
          }
          if (this.$route.name === 'Edit') {
            editTmPersons(this.form).then((res) => {
              this.handleResult(res)
            })
          } else {
            // this.form.roleIds = this.roleIds ? this.roleIds.split(',') : []
            addTmPersons(this.form).then((res) => {
              this.handleResult(res)
            })
          }
        }
      })
    },
    handleResult(res) {
      if (res.code == '200') {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.$router.push('/personalManagement/table')
      }
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss">
.addPerson {
  .form-item {
    width: 100%;
  }
}
</style>

