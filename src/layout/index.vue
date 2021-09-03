<template>
  <div class="app-wrapper">
    <div class="app__navbar--wrap">
      <NavBar />
    </div>

    <div class="app__content--wrap">
      <!-- 应用页面 -->
      <template v-if="!ishome">

        <div v-if="showSideMenu" class="app_content--sidebar">
          <Menu :menuList="menus" />
        </div>
        <div class="app__content--main">
          <app-main id="app-main" />
        </div>
      </template>

      <!-- 通过判断ishome 判断是否是门户首页 -->
      <template v-else>
        <router-view />
      </template>
    </div>
  </div>
</template>

<script>
import { Menu, AppMain, NavBar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import themeConfig from './mixin/themeConfig'
export default {
  name: 'Layout',
  components: {
    Menu,
    NavBar,
    AppMain
  },
  mixins: [themeConfig, ResizeMixin],
  computed: {
    showSideMenu() {
      return this.$store.getters.showSideMenu
    }
  },
  created() {
    window.document.documentElement.setAttribute('data-theme', this.styleKey)
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper::v-deep {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;

  .app__navbar--wrap {
    position: relative;
    z-index: 999;
    .el-menu {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      background: transparent;
      .el-menu-item {
        height: 70px;
        line-height: 70px;
        color: #adcef4;
        .el-menu-item:hover {
          @include background_color('primary_hover_color');
        }
        .sub-el-icon {
          color: #adcef4;
        }
        &.is-active {
          background: #3f90e1;
          color: #fff;
          & .sub-el-icon {
            color: #fff;
          }
        }
      }
      &.el-menu--horizontal {
        border-bottom: none;
      }
    }
  }

  .app__content--wrap {
    display: flex;
  }

  .app_content--sidebar {
    transition: width 0.28s;
    // @include width('sidebar_menu_width');
    @include background_color('sidebar_menu_background');
    height: 100%;
    min-height: 100vh;
    font-size: 0px;
    .scrollbar-wrapper {
      // @include width('sidebar_menu_width');
      height: calc(100vh - 130px);
      overflow: auto;
      overflow-x: hidden;

      // 滚动条样式
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 10px;
        background: #696b6d;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #444b50;
        border-radius: 10px;
      }
      .el-menu {
        border: none;
        @include background_color('sidebar_menu_background');
        .el-menu-item,
        .el-submenu__title {
          @include background_color('sidebar_menu_background');
          @include font_color('sidebar_menu_item_color');
        }
        .el-menu-item {
          position: relative;
          &.is-active {
            @include background_color('sidebar_menu_item_active_background');
            @include font_color('sidebar_menu_item_active_color');
            @include border_left('sidebar_menu_item_active_borderleft');
            box-sizing: border-box;
            & .sub-el-icon {
              @include font_color('sidebar_menu_item_active_color');
            }
          }
          &:not(.is-active)::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 0;
            background: #00a4ff;
            transition: height 0.3s ease-in;
          }
          &:not(.is-active):hover {
            color: #00a4ff;
            & .sub-el-icon {
              color: #00a4ff;
            }
            &::before {
              height: 100%;
            }
          }
        }
      }
      .collapse__wrap {
        height: 60px;
        background: #2e3942;
        position: fixed;
        bottom: 0;
        & .icon {
          width: 64px;
          height: 64px;
          text-align: center;
          line-height: 64px;
          font-size: 18px;
          color: #d1d1d1d8;
          cursor: pointer;
          &:hover {
            background: rgba(109, 108, 108, 0.336);
          }
        }
      }
    }
  }

  .app__content--main {
    flex: 1;
    min-width: 1080px;
    @include background_color('content_background');
    height: calc(100vh - 70px);
    overflow-x: scroll;
    .el-menu {
      @include flex(flex-start, center, nowrap, row);
      height: 100%;
      background: transparent;
      border: none;
      .el-menu-item {
        height: 60px;
        line-height: 60px;
        color: #666;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 0;
          height: 2px;
          background: #3f90e1;
          transition: width 0.3s ease-in;
        }
        &.is-active {
          background: #fff;
          color: #3f90e1;
        }
        &:hover {
          background: #fff;
          &:not(.is-active)::after {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
