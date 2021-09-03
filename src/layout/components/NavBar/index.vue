<template>
  <div class="navbar">
    <div class="logo">
      <div class="logo-icon">
        <img v-if="ishome" :src="homeLogo" alt="">
        <img-skeleton v-else size="40" :filekey="appInfo.logo" />
      </div>

      <span class="logo-text">{{ ishome ? '业务支撑平台' : appInfo.realName }}</span>
    </div>

    <div v-if="!ishome" class="center-navbar">
      <div v-if="!(showSubNavMenu || showNavMenu)" class="breadcrumb">
        <span class="page-title">{{ $route.meta.title }}</span>
        <div class="line" />
        <i class="el-icon-location-information" />
        <div class="breadcrumb-content">
          <Breadcrumb />
        </div>
      </div>
      <Menu v-if="showNavMenu" :menu-list="directorys" :is-directory="true" mode="horizontal" />
    </div>

    <div class="right-navbar">
      <el-badge :value="200" :max="99" class="item">
        <el-icon class="el-icon-message" />
      </el-badge>

      <el-dropdown trigger="hover" @command="changeLocal">
        <i class="locale_icon el-icon-iot-lvzhou_yuyanqiehuan" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="zh">中文</el-dropdown-item>
          <el-dropdown-item command="en">英文</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <img-skeleton size="40" type="circle" :filekey="userInfo.headUrl && userInfo.headUrl" />
          <span :title='userInfo.nickName || userInfo.userAccount' class="avatar-username">{{ userInfo.nickName || userInfo.userAccount }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item divided icon="el-icon-document" @click.native="toPersonalInfo">个人档案</el-dropdown-item>
          <el-dropdown-item divided icon="el-icon-iot-tuichu" @click.native="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { Breadcrumb, ImgSkeleton } from '@/components'
import themeConfig from '../../mixin/themeConfig'
import { uniqueSetting } from '@/layout/mixin/settings'
import Menu from '../Menu'
import { UPDATE_ACTIVEURL, SHOW_SIDEMENU } from '@/store/mutation-types'
import { flat, deepCopy } from '@/utils'
export default {
  name: 'NavBar',
  components: { Menu, Breadcrumb, ImgSkeleton },
  mixins: [themeConfig],
  computed: {
    homeLogo() {
      const url = this.$store.state.app.setting['logoUrl']
      return require('../../../assets/' + 'login/' + `${url}`)
    },
  },
  watch: {
    $route(to, from) {
      const url = ['/personalInfo/table', '/personalInfo']
      if (!url.includes(to.path)) {
        this.$store.commit(SHOW_SIDEMENU, true)
      }
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    },
    changeLocal(e) {
      if (e == localStorage.getItem('lang')) return
      localStorage.setItem('lang', e)
      this.$router.go(0)
    },
    // 跳转个人档案页面
    toPersonalInfo() {
      let url = ['/personalInfo/table', '/personalInfo']
      // // 如果
      // if (this.ishome) {
      //   if (this.productHasResource(url)) {
      //     this.$store.commit(SHOW_SIDEMENU, false)
      //     this.$router.push(url[0])
      //   } else {
      //     this.$message.info('请配置个人档案')
      //   }
      // } else {
        if (this.productHasResource(url)) {
          this.$store.commit(SHOW_SIDEMENU, true)
          this.$router.push(url[0])
        } else {
          if (this.userInfo.user.hasPersonal) {
            this.$store.commit(SHOW_SIDEMENU, false)
            this.$router.push(url[0])
          } else {
            this.$message.info('请配置个人档案')
          }
        }
      // }
    },
    // 当前产品是否有该资源
    productHasResource(url) {
      let menus = flat(deepCopy(JSON.parse(localStorage.getItem('menus'))))
      let menu = menus.filter((item) => url.includes(item.url))
      return menu.length
    },
  },
}
</script>

<style lang="scss" scoped>
.head-bg {
  background: rgb(84, 92, 100);
}
.navbar {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  box-shadow: 0 1px 4px #e6e6e6a6;
  @include background_color('navbar_background');
  @include background_img('navbar_backgroundImg');
  .logo {
    display: flex;
    align-items: center;
    width: 280px;
    height: 70px;
    padding: 0 20px;
    @include background_color('navbar_background_logo');
    .logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 30px;
      background: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .logo-text {
      margin-left: 18px;
      font-size: 17px;
      font-weight: 600;
      letter-spacing: 2px;
    }
  }
  .center-navbar {
    flex: 1;
    @include background_color('navbar_background');
    height: 70px;
    & .breadcrumb {
      // width: 500px;
      height: 70px;
      display: flex;
      align-items: center;
      //   @include font_color('page-title_color') ;
      //   color: #333;
      .page-title {
        padding: 0 20px;
        text-align: center;
        font-size: 20px;
        @include font_color('page-title_color');
        font-weight: 600;
      }
      .line {
        width: 1px;
        height: 26px;
        background: #ccc;
        margin-right: 38px;
      }
    }
  }
  .right-navbar {
    width: 280px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    @include font_color('navbar_color');
    @include background_color('navbar_background');
    font-size: 20px;
    .locale_icon {
      font-size: 16px;
      @include font_color('navbar_color');
    }
    .avatar-container {
      padding: 0 34px;
      cursor: pointer;
      position: relative;
      &::before {
        content: '';
        width: 1px;
        height: 26px;
        background: #dadada;
        position: absolute;
        left: 0;
      }

      .avatar-wrapper {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: relative;
        .avatar-username {
          margin-left: 4px;
          @include textOverflow(1, 60px, block);
          @include font_color('navbar_color');
        }
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
