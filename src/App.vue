<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { RESET_APP } from '@/store/mutation-types'
export default {
  name: 'App',
  // 全局提供刷新方法
  provide() {
    return {
      reload: this.reload,
    }
  },
  data() {
    return {
      isRouterAlive: true, //控制视图是否显示的变量
    }
  },
  computed: {
    isNewTab() {
      return this.$store.state.app.isNewTab
    },
  },
  watch: {
    $route(to, from) {
      // 如果是公共页面 并且是从首页 进入，则当前页面还停留在首页，切换内容即可
      if (to.path == '/home') {
        this.$store.commit('ishome', true)
      }
       else {
        if (to.meta.public && this.ishome) {
          this.$store.commit('ishome', true)
        } else {
          this.$store.commit('ishome', false)
        }
      }
    },
    immediate: true,
  },
  created() {
      // 如果是新标签打开，直接退出
      if (Number(this.isNewTab)) {
        this.$store.dispatch('user/logout')
      }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
  },
}
</script>
<style lang="scss">
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
