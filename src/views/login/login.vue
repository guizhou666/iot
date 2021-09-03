<template>
  <el-form class="login__form" ref="loginForm" :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left">
    <div class="loginForm__content" v-if="loginType == 'password'">
      <el-form-item prop="userAccount">
        <el-input ref="userAccount" v-model="loginForm.userAccount" placeholder="请输入用户名称/手机/邮箱" name="userAccount" type="text" tabindex="1" auto-complete="on">
          <i class="el-icon-user" slot="prepend"></i>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input ref="password" v-model="loginForm.password" type="password" placeholder="请输入登录密码" name="password" tabindex="2" show-password>
          <i class="el-icon-lock" slot="prepend"></i>
        </el-input>
      </el-form-item>

      <el-form-item class="loginForm__checkCode" prop="checkCode">
        <el-input ref="checkCode" v-model="loginForm.checkCode" placeholder="请输入验证码" name="checkCode" tabindex="2" />
        <div class="logoForm__checkCode--body">
          <VerifyCode @getCheckCode="(checkCode)=> this.newCheckCode = checkCode"></VerifyCode>
        </div>
      </el-form-item>
    </div>

    <div class="loginForm__content" v-if="loginType == 'message'">
      <el-form-item prop="phone">
        <el-input ref="userAccount" v-model="loginForm.userAccount" placeholder="请输入手机号码" name="userAccount" type="text" tabindex="1" auto-complete="on">
          <i class="el-icon-phone" slot="prepend"></i>
        </el-input>
      </el-form-item>

      <el-form-item class="loginForm__checkCode" prop="checkCode">
        <el-input ref="checkCode" v-model="loginForm.checkCode" placeholder="请输入短信验证码" name="checkCode" tabindex="2" auto-complete="on" />
        <el-button :style="{ background: setting['primaryColor'] }" type="primary">获取验证码</el-button>
      </el-form-item>
    </div>

    <el-button class="loginForm__btn--login" :loading="loading" type="primary" :style="{
        width: '100%',
        background: setting['primaryColor'],
        borderColor: setting['primaryColor']
      }" @click.native.prevent="login" @keyup.enter.native="login">登录</el-button>

    <div class="loginForm_footer" :style="{ color: setting['primaryColor'] }">
      <span class="loginForm_footer--left" @click="changeLoginType">{{
        this.loginType == 'password' ? '短信登录' : '密码登录'
      }}</span>
      <span class="loginForm_footer--right" @click="forgetPassword">忘记密码</span>
    </div>
  </el-form>
</template>
<script>
import { validUsername } from '@/utils/validate'
import { VerifyCode } from '@/components'
import { UPDATE_APPINFO, UPDATE_THEME, UPDATE_ACTIVEURL,INITIAL_URL,IS_NEWTAB } from '@/store/mutation-types'
import { mapActions } from 'vuex'
import { getFirst } from '@/utils'
import { checkURL } from '@/utils/validate'
import { handleLayout } from '@/layout/mixin/settings'
import storage from 'store'
export default {
  name: 'Login',
  components: {
    VerifyCode
  },
  props: {
    setting: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    const validateuserAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名称'))
      } else {
        callback()
      }
    }
    const validateUserPwd = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不得少于6位数'))
      } else {
        callback()
      }
    }
    const validatecheckCode = (rule, value, callback) => {
      let newCheckCode = this.newCheckCode
      if (value.toUpperCase() != newCheckCode) {
        callback(new Error('验证码错误'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userAccount: 'admin',
        password: '123456',
        checkCode: ''
      },
      loginType: 'password',
      loginRules: {
        userAccount: [
          {
            required: true,
            trigger: 'blur',
            validator: validateuserAccount
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入登陆密码'
          }
        ],
        checkCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入验证码'
          },
          {
            trigger: 'change',
            validator: validatecheckCode
          }
        ]
      },
      loading: false,
      redirect: undefined,
      checkCode: '',
      newCheckCode: ''
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
  created() {
    // 监听回车事件
    window.addEventListener('keydown', this.handleKeyDown, true)
  },
  methods: {
    ...mapActions(['getRelevanceResource']),

    // 切换登录方式
    changeLoginType() {
      this.loginType = this.loginType == 'message' ? 'password' : 'message'
    },

    // 触发回车事件
    handleKeyDown(e) {
      let key = null
      if (window.event === undefined) {
        key = e.keyCode
      } else {
        key = window.event.keyCode
      }
      if (key === 13) {
        this.login()
      }
    },

    // 执行登录
    login() {
      this.$refs.loginForm &&
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('user/login', this.loginForm).then((res) => {
              this.$store.commit(IS_NEWTAB,false)
              this.$store.dispatch('user/getUserInfo', this.userInfo.userId).then((res) => {
                this.getProductList()
              })
            }).catch(err=>{
              this.loading = false
            })
          }
        })
    },

    // 查询产品
    getProductList() {
      this.$store.dispatch('getProductList', { flag: 1 }).then((productList) => {
        
        // 只有一个产品并且不是pda，直接进入产品
        if (productList.length == 1  && !this.isExpire(productList[0])) {
          this.handleOneProduct(productList[0])
        } else {
          // 多个产品，进入hoem页面
          this.$router.push('/home')
        }
      })
    },

    // 产品是否过期
    isExpire(product) {
      let { expireTime } = product
      if (expireTime) {
        expireTime = new Date(expireTime).getTime()
        const currentTime = new Date().getTime()
        if (currentTime > expireTime) return true
      } else {
        return false
      }
    },

    // 处理单个产品
    handleOneProduct(product) {
      // 更新产品信息
      this.$store.commit(UPDATE_APPINFO, product)
      // 更新主题
      this.$store.commit(UPDATE_THEME, '01')
      // 获取资源
      this.getRelevanceResource({ ...product, flag: 1 }).then((res) => {
        if (res.code == '200') {
          const relevanceResource = storage.get('relevanceResource')
          if (!relevanceResource.length) {
            this.$message({
              type: 'warning',
              message: '该产品未配置资源'
            })
          } else {
            this.initialUrl(relevanceResource)
            this.loading = false
          }
        }
      })
    },

    // 初始化url
    initialUrl(relevanceResource) {
      handleLayout(relevanceResource).then((res) => {
        const { directorys, menus } = res
        const firstNode = getFirst(menus)
        const redirectUrl = firstNode.url
        // 检查ip是自定义域名还是全称域名
        if (checkURL(redirectUrl)) {
          location.href = this.redirectUrl
        } else {
          this.$router.push(redirectUrl)
          this.$store.commit(INITIAL_URL, redirectUrl)
          this.$store.commit(UPDATE_ACTIVEURL, redirectUrl)
        }
      })
    },

    // 忘记密码
    forgetPassword() {
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
    span {
      cursor: pointer;
    }
  }
}
</style>
