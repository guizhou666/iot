
<template>
  <div class="appmain__wrap">
    <div class="appmain__wrap--head">
      <!-- appmain中的面包屑 -->
      <div class="appmain__breadcrumb" v-if="showNavMenu || showSubNavMenu">
        <span class="appmain__title--text">{{ $route.meta.title }}</span>
        <i class="el-icon-location-information"></i>
        <div class="appmain__breadcrumb--content">
          <Breadcrumb></Breadcrumb>
        </div>
      </div>

      <!-- 二级菜单区域 -->
      <div class="navbar__wrap" v-if="showSubNavMenu && $route.path !== '/nomenu'">
        <i class="el-icon-arrow-left" @click="handleMenu('right')"></i>
        <div class="navbar__wrap--submenu">
          <Menu :menuList="menus" mode="horizontal" />
        </div>
        <i class="el-icon-arrow-right" @click="handleMenu('left')"></i>
      </div>
    </div>

    <!-- appmain 内容区域 -->
    <div class="appmain__wrap--body">
      <transition name="fade-transform" mode="out-in">
        <template>
          <keep-alive :include="cacheCompounted">
            <router-view :key="$route.path" />
          </keep-alive>
        </template>
      </transition>
    </div>
  </div>
</template>

<script>
import { Breadcrumb, Hamburger } from '@/components'
import themeConfig from '../../mixin/themeConfig'
import Menu from '../Menu'
export default {
  name: 'AppMain',
  components: {
    Breadcrumb,
    Hamburger,
    Menu
  },
  mixins: [themeConfig],
  data() {
    return {
      scrollLength: 0
    }
  },
  computed: {
    sideCollapsed() {
      return this.$store.state.app.sideCollapsed
    },
    cacheCompounted() {
      return this.$store.state.app.cacheCompounted
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.commit('sidebar_type', !this.sideCollapsed)
    },
    handleMenu(type) {
      let scrollWidth = document.getElementsByClassName('navbar__wrap--submenu')[0].scrollWidth
      let clientWidth = document.getElementsByClassName('navbar__wrap--submenu')[0].clientWidth

      let maxScrollWidth = scrollWidth - clientWidth

      type == 'left' ? (this.scrollLength += 100) : (this.scrollLength -= 100)

      this.scrollLength = this.scrollLength < 0 ? 0 : this.scrollLength
      this.scrollLength = this.scrollLength > maxScrollWidth ? maxScrollWidth : this.scrollLength
      document.getElementsByClassName('navbar__wrap--submenu')[0].scrollTo(this.scrollLength, 0)
    }
  }
}
</script>

<style lang="scss">
.app-content-wrap {
  background: #fff;
  padding: 26px;
  @include border_radius('content_border_radius');
  margin-bottom: 80px;
  min-height: calc(100vh - 240px);
  box-shadow: 0 2px 3px #dfe1e6;
}
</style>

<style lang="scss" scoped>
.appmain__wrap::v-deep {
  min-height: calc(100vh - 110px);
  .appmain__wrap--head {
    @include flex(space-around, flex-start);
    background: #fff;
    @include padding('breadcremb_padding');
    .appmain__title--text {
      padding: 0 1.25rem;
      margin-right: 20px;
      text-align: center;
      font-size: 1rem;
      @include font_color('page-title_color');
      font-weight: 600;
      position: relative;
      &::after {
        position: absolute;
        top: 0px;
        right: 0;
        content: '';
        width: 1px;
        height: 20px;
        background: #999;
      }
    }
    .appmain__breadcrumb {
      flex: 1;
      height: 60px;
      @include flex(flex-start, center);
      @include background_color('breadcremb_background');
      padding: 12px 20px;
    }
    .navbar__wrap {
      width: 70%;
      height: 60px;
      @include flex(flex-start, center);
      .el-icon-arrow-left,
      .el-icon-arrow-right {
        @include hoverStyle(
          (
            width: 20px,
            height: 60px,
            margin: 0 8px,
            line-height: 60px,
            transition: all 0.3s ease
          ),
          (
            background: #eee,
            cursor: pointer
          )
        );
        &.is-disabled {
          color: #e6e6e6;
        }
      }
      .navbar__wrap--submenu {
        overflow: hidden;
        border-left: 1px solid #eee;
        border-right: 1px solid #eee;
      }
    }
  }
  .appmain__wrap--body {
    @include padding('content_padding');
  }
}
</style>
