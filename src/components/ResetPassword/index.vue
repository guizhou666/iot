<template>
  <el-dialog title="重置密码" :visible.sync="visible" width="30%" destroy-on-close>
    <el-form
      ref="form"
      class="resetPassword-wrapper"
      :model="resetForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="重置密码" prop="userPwd">
        <el-input show-password v-model.trim="resetForm.userPwd" placeholder="请输入新密码" type="password"></el-input>
      </el-form-item>
      <el-form-item label="重复密码" prop="repeatUserPwd">
        <el-input
          show-password
          v-model.trim="resetForm.repeatUserPwd"
          placeholder="请重复新密码"
          type="password"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button icon="el-icon-finished" type="primary" @click="confirm">确 定</el-button>
      <el-button icon="el-icon-refresh-left" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { resetPassword } from '@/api/user'
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.form.userPwd) {
        callback(new Error('重置密码和重复密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        userPwd: '',
        repeatUserPwd: '',
        id: ''
      },
      visible: false,
      rules: {
        repeatUserPwd: [{ validator: validatePassword, trigger: 'blur' }]
      }
    }
  },
  props: {
    successMessage: {
      type: String
    }
  },
  computed: {
    resetForm: {
      get() {
        return this.form
      },
      set() {}
    }
  },
  methods: {
    show(id) {
      this.form = {}
      this.form.id = id
      this.visible = true
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        resetPassword(this.form).then(res => {
          if (res.code == '200') {
            this.$message.success(this.successMessage || res.message)
            this.visible = false
          }
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.resetPassword-wrapper {
  .el-form-item {
    width: 90%;
  }
}
</style>