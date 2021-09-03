<template>
  <div :class="['scrollbar-wrapper', isCollapse ? 'isCollapse': 'unCollapse']">
    <el-menu id="menu-wrap" ref="menuPanel" :default-active="defaultActive" :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" :mode="mode">
      <sidebar-item v-for="menu in menuList" :key="menu.id" :mode="mode" :item="menu" :isDirectory="isDirectory" />
    </el-menu>
    <div :class="['collapse__wrap', isCollapse ? 'isCollapse': 'unCollapse']">
      <div class="icon el-icon-s-unfold" @click="collapse"></div>
    </div>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import { UPDATE_ACTIVEDIRECTORY, UPDATE_ISCOLLAPSE } from '@/store/mutation-types'
import { deepCopy, isNull, getFirst, flat } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  components: { SidebarItem, Logo },
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    mode: {
      type: String,
      default: 'vertical'
    },
    // 如果是目录，没有下拉框
    isDirectory: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'activeMenu',
      'activeDirectory',
      'menus',
      'directorys',
      'activeUrl',
      'isCollapse'
    ])
  },
  watch: {
    // activeMenu(newVal) {
    //   this.$router.push(newVal.url)
    // },
    $route(newVal) {
      // const menus = flat(deepCopy(this.menus))
      // menus.map((item) => {
      //   if (item.url == newVal.path || item.url + '/table' == newVal.path) {
      //     this.defaultActive = item.id
      //   }
      // })
      this.initDefaultActive(newVal.path)
    },
    immediate: true
  },
  data() {
    return {
      prevUrl: '',
      redirectUrl: '',
      defaultActive: ''
    }
  },
  created() {
    // 初始化获得当前激活的菜单id
    this.initDefaultActive(this.activeUrl)
    // isNull(this.activeMenu) && isNull(this.activeDirectory) && this.getActiveMenu()
  },
  methods: {
    initDefaultActive(url) {
      const menus = flat(deepCopy(this.menus))
      menus.map((item) => {
        if (item.url == url || item.url + '/table' == url) {
          this.defaultActive = item.id
        }
      })
    },
    getActiveMenu() {
      let menus = deepCopy(this.menus)
      let directorys = deepCopy(this.directorys)
      if (menus[0].url == '/home') {
        menus.shift()
      }
      // 如果是目录
      if (directorys.length) {
        this.$store.commit(UPDATE_ACTIVEDIRECTORY, directorys[1])
        // 获取第一个有效链接的节点
        // this.$store.commit(UPDATE_ACTIVEMENU, getFirst(menus))
      } else {
        this.$store.commit(UPDATE_ACTIVEDIRECTORY, menus[0])
        // this.$store.commit(UPDATE_ACTIVEMENU, getFirst(menus[0].childList))
      }
    },
    collapse() {
      this.$store.commit(UPDATE_ISCOLLAPSE, !this.isCollapse)
    },
    // 返回首页
    backHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
.unCollapse {
  width: 280px;
}
</style>
