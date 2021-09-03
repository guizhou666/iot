<template>
  <el-breadcrumb class="app-breadcrumb" separator=">">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect">{{ matchResourceTitle(item) }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ matchResourceTitle(item) }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { flat, deepCopy } from '@/utils'
export default {
  data() {
    return {
      levelList: null,
    }
  },
  computed: {
    menus() {
      return this.$store.getters.menus
    },
    productList() {
      return this.$store.state.app.productList
    },
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter((item) => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isHome(first)) {
        // 如果是单个产品，没有产品首页
        if (this.productList.length !== 1) {
          matched = [{ path: '/home', meta: { title: '首页' } }].concat(matched)
        }
      }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    isHome(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'home'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
    // 切换资源标题
    matchResourceTitle(route) {
      let menus = flat(deepCopy(this.menus))
      const current = menus.filter((item) => item.url == route.path)
      if (current.length) {
        return current[0]['resourceAlias'] || current[0]['name']
      } else {
        return route.meta.title
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  // line-height: 30px;
  display: flex;
  align-items: center;
  margin-left: 8px;

  .no-redirect {
    @include font_color('primary_color');
    cursor: text;
  }
  .breadcrumb-content {
    height: 30px;
  }
  .el-breadcrumb__item {
    font-size: 16px;
    font-family: '微软雅黑';
  }
  .el-breadcrumb__item:last-child {
    & .el-breadcrumb__inner {
      @include font_color('primary_color');
    }
  }
}
</style>
