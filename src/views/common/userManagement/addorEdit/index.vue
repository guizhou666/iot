<template>
  <div class="addoredit_user app-content-wrap">
    <AppMainHeader :title="title"></AppMainHeader>
    <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
      <el-row>
        <el-col :span="10">
          <el-form-item label="用户名：" prop="userAccount">
            <el-input
              v-if="type === 'Add'"
              v-model.trim="form.userAccount"
              placeholder="请输入用户名"
              maxlength="50"
            >
              <i slot="prepend" class="el-icon-user"></i>
            </el-input>
            <span v-else>{{ form.userAccount }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="角色：" prop="roleIds">
            <el-select v-model="form.roleIds" multiple placeholder="请选择角色" filterable>
              <el-option
                v-for="role in roleList"
                :key="role.id"
                :label="role.name"
                :value="role.id"
                >{{ role.name }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>

        <template v-if="type === 'Add'">
          <el-col :span="10">
            <el-form-item label="初始密码：" prop="userPwd">
              <el-input
                show-password
                v-model.trim="form.userPwd"
                placeholder="请输入初始密码"
                type="password"
              >
                <i slot="prepend" class="el-icon-lock"></i>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row v-if="type === 'Add'">
        <el-col :span="10">
          <el-form-item label="重复密码：" prop="repeatUserPwd">
            <el-input
              show-password
              v-model.trim="form.repeatUserPwd"
              placeholder="请重复初始密码"
              type="password"
            >
              <i slot="prepend" class="el-icon-lock"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <AppMainHeader title="个人信息" style="margin-bottom: 40px"></AppMainHeader>

      <el-row class="form-personal">
        <el-col :span="10">
          <el-form-item label="姓名：" prop="realName">
            <el-input v-model.trim="form.realName" placeholder="请输入姓名" maxlength="50">
              <i slot="prepend" class="el-icon-iot-xingming"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="用户头像：" prop="headUrl" justify="center">
            <div class="avatar-container">
             <upload :uploadConfig="uploadConfig" @handleFileList="handleFileList"></upload>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="昵称：" prop="nickName">
            <el-input v-model.trim="form.nickName" placeholder=" 请输入昵称" maxlength="50">
              <i slot="prepend" class="el-icon-iot-nicheng"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="性别：" prop="gender">
            <el-radio v-model="form.gender" :label="0">男</el-radio>
            <el-radio v-model="form.gender" :label="1">女</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话：" prop="phone">
            <el-input v-model.trim="form.phone" placeholder="请输入联系电话" maxlength="11">
              <i slot="prepend" class="el-icon-phone"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="电子邮箱：" prop="email">
            <el-input v-model.trim="form.email" placeholder="请输入邮箱地址" maxlength="50">
              <i slot="prepend" class="el-icon-message"></i>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <footer class="footer">
      <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
      <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
    </footer>
  </div>
</template>

<script>
import { AppMainHeader, Upload } from '@/components'
import { getRoleList } from '@/api/roleManage'
import { addUser, editUser, getUser } from '@/api/userManage'
import { validatePhone, validateMail } from '@/utils/validate'

export default {
  components: { AppMainHeader,Upload },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.form.userPwd) {
        callback(new Error('初始密码和重复密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        userAccount: '',
        roleIds: [],
        userPwd: '',
        repeatUserPwd: '',
        realName: '',
        headUrl: '',
        nickName: '',
        gender: 0,
        phone: '',
        email: ''
      },
       uploadConfig: {
        type: 'img', //上传类型
        filekey: '',
        fileType: 'jpg,png', //上传的文件类型
        limit: 2 //单位M
      },
      rules: {
        userAccount: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
        userPwd: [{ required: true, message: '请输入初始密码', trigger: 'blur' }],
        repeatUserPwd: [
          { required: true, message: '请重复初始密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        email: [{ validator: validateMail, trigger: 'blur' }]
      },
      roleList: [],
      type: this.$route.name
    }
  },
  computed: {
    title() {
      return this.$route.name === 'Add' ? '添加用户' : '修改用户'
    }
  },
  created() {
    this.getRoleList()
    if (this.$route.name === 'Edit') {
      this.getUser()
    }
  },
  mounted() {},
  methods: {
    async getRoleList() {
      const { code, data, msg } = await getRoleList()
      this.roleList = data
    },
    async getUser() {
      const { code, data, msg } = await getUser({ id: this.$route.query.id })
      if (code === '200') {
        this.form = {
          email: data.email,
          isEnabled: data.isEnabled,
          nickName: data.nickName,
          phone: data.phone,
          realName: data.realName,
          roleIds: data.roleIds,
          roleNames: data.roleNames,
          userAccount: data.userAccount,
          gender: data.gender
        }
        this.uploadConfig.filekey = data.headUrl
      }
    },
    handleFileList(file) {
      this.$set(this.form,'headUrl',file.filekey)
    },
    confirm() {
      this.$refs.form.validate(async (validate) => {
        if (validate) {
          let params = Object.assign(this.form, {
            id: this.$route.query.id
          })
          if (this.$route.name === 'Add') {
            const { code, data, msg } = await addUser(params)
            this.handleResult('Add', code, msg)
          } else {
            const { code, data, msg } = await editUser(params)
            this.handleResult('Edit', code, msg)
          }
        }
      })
    },
    handleResult(type, code, msg) {
      if (code !== '200') {
        // return this.$message.error(msg)
        return
      }
      if (type === 'Add') {
        this.$message.success('添加用户成功')
        this.$router.push('/UserManagement/table')
      } else {
        this.$message.success('修改用户成功')
        this.$router.push('/UserManagement/table')
      }
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.addoredit_user {
  .form-box {
    margin-top: 40px;
    & .el-input,
    .el-textarea,
    .el-select {
      min-width: 100%;
    }
    .avatar-container {
      display: flex;
      align-items: center;
      .el-avatar {
        margin-right: 20px;
      }
    }
  }
  .footer {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    & .el-button {
      margin: 0 20px;
    }
  }
}
</style>
