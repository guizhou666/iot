<template>
  <el-form
    ref="registerForm"
    class="login__form"
    :model="loginForm"
    :rules="loginRules"
    auto-complete="on"
    label-position="left"
  >
    <div class="button-group">
      <el-button :class="{ 'active-button': registerType === '短信' }" @click="changeRegisterType"
        >短信</el-button
      >
      <el-button :class="{ 'active-button': registerType === '邮箱' }" @click="changeRegisterType"
        >邮箱</el-button
      >
    </div>

    <template  v-if="registerType === '短信'">
      <el-form-item prop="phone">
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输入手机号码"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="message">
        <el-input
          ref="message"
          v-model="loginForm.message"
          placeholder="请输入短信验证码"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>
    </template>

    <template v-else>
      <el-form-item prop="phone">
        <el-input
          ref="phone"
          v-model="loginForm.phone"
          placeholder="请输入邮箱地址"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>

      <el-form-item prop="message">
        <el-input
          ref="message"
          v-model="loginForm.message"
          placeholder="请输入邮箱验证码"
          name="phone"
          type="text"
          tabindex="1"
          auto-complete="off"
        />
      </el-form-item>
    </template>

    <el-form-item prop="password">
      <el-input
        ref="password"
        v-model="loginForm.password"
        placeholder="请输入新密码"
        name="phone"
        type="text"
        tabindex="1"
        auto-complete="off"
      />
    </el-form-item>

    <el-form-item prop="rePassword">
      <el-input
        ref="rePassword"
        v-model="loginForm.rePassword"
        placeholder="请重复新密码"
        name="phone"
        type="text"
        tabindex="1"
        auto-complete="off"
      />
    </el-form-item>

    <el-form-item class="loginForm__checkCode" prop="authcode">
      <el-input
        :key="authcode"
        ref="password"
        v-model="loginForm.authcode"
        placeholder="请输入验证码"
        name="password"
        tabindex="2"
        auto-complete="on"
        @keyup.enter.native="handleLogin"
      />
      <div class="logoForm__checkCode--body">
        <VerifyCode @getCheckCode="getCheckCode"></VerifyCode>
      </div>
      
    </el-form-item>

    <el-button
      class="confirm-button"
      :loading="loading"
      type="primary"
      style="width: 100%"
      @click.native.prevent="handleLogin"
      >注册</el-button
    >

    <el-form-item>
      <span class="tips" @click="hasAccount">已有账号</span>
    </el-form-item>
  </el-form>
</template>

<script>
import { VerifyCode } from '@/components'
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  components: { VerifyCode },
  props: {
    setting: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入用户名称'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不得少于6位数'))
      } else {
        callback()
      }
    }
    const validateAuthcode = (rule, value, callback) => {
      if (value.length > 4) {
        callback(new Error('验证码不超过4位数'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        authcode: ''
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateUsername
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ],
        authcode: [
          {
            required: true,
            trigger: 'blur',
            validator: validateAuthcode
          }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      registerType: '短信'
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    // 切换注册方式
    changeRegisterType(e) {
      this.registerType = e.target.innerText
    },
    hasAccount() {
      this.$emit('changeStatus')
    }
  }
}
</script>
<style lang="scss" scoped>
.login__form ::v-deep {
  .loginForm__content {
    min-height: 204px;
  }
  .loginForm__checkCode {
    .el-form-item__content {
      display: flex;
      .el-input {
        width: 70%;
        margin-right: 10px;
      }
      .logoForm__checkCode--body {
        flex: 1;
      }
    }
  }
  .loginForm__btn--login {
    margin-bottom: 20px;
  }
  .loginForm_footer {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
  }
}
</style>