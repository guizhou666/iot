<template>
  <div class="login__wrap" id="login-container" :style="{ backgroundImage: bgUrl, justifyContent: setting['loginPosition'] }">
    <div class="login__wrap--box" >
      <div class="login__box--logo">
        <div class="login__logo--img" :style="{ backgroundImage: logoUrl }"></div>
        <span :style="{ color: setting['primaryColor'] }">应用支撑平台</span>
      </div>

      <div class="login__box--form">
        <compontnt :setting="setting" :is="status" @changeStatus="changeStatus"></compontnt>
      </div>
    </div>
  </div>
</template>

<script>
import { uniqueSetting } from '@/layout/mixin/settings'
import { UPDATE_SETTING } from '@/store/mutation-types'
export default {
  name: 'Login',
  components: {
    login: () => import('./login.vue'),
    register: () => import('./register.vue')
  },
  data() {
    return {
      status: 'login'
    }
  },
  computed: {
    setting() {
      let a = 'setting' + this.random(1,4)
      this.$store.commit(UPDATE_SETTING,uniqueSetting[a])
      return uniqueSetting[a]
    },
    bgUrl() {
      let url = this.setting['bgUrl']
      return 'url(' + require('../../assets/' + 'login/' + `${url}`) + ')'
    },
    logoUrl() {
      let url = this.setting['logoUrl']
      return 'url(' + require('../../assets/' + 'login/' + `${url}`) + ')'
    },
  },
  methods: {
    changeStatus() {
      this.status = this.status === 'login' ? 'register' : 'login'
    },
    handleClick() {},

     random(n, m){
        var random = Math.floor(Math.random()*(m-n+1)+n);
        return random;
    }
  }
}
</script>

<style lang="scss" scoped>
.login__wrap {
  width: 100%;
  height: 100%;
  background-size: cover;
  display: flex;
  align-items: center;
  padding: 0 350px;
  overflow: scroll;
  .login__wrap--box {
    padding: 54px;
    width: 450px;
    min-height: 560px;
    height: fit-content;
    background: #fff;
    border-radius: 8px;
    .login__box--logo {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 26px;
      font-weight: 600;
      .login__logo--img {
        width: 160px;
        height: 80px;
        background-position: 50% 50%;
        margin-bottom: 40px;
      }
    }
    .login__box--form {
      margin-top: 36px;
    }
  }
}
</style>
