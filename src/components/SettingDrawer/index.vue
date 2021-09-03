<template>
  <!-- 切换图标 -->
  <div class="setting-drawer">
    <div
      class="setting-drawer-index-handle"
      :style="{ right: visible ? '290px' : '8px' }"
      @click="toggle"
      @dragend="dragDrawer"
    >
      <i draggable="true" :class="[visible ? 'el-icon-close' : 'el-icon-setting']"></i>
    </div>
    <el-drawer
      size="290px"
      @close="onClose"
      :append-to-body="true"
      :wrapperClosable="true"
      :visible.sync="visible"
      :show-close="true"
      :withHeader="false"
    >
      <div class="setting-drawer-index-content">
        <i class="el-icon-close closeBtn" @click="onClose"></i>
        <!-- <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">整体风格设置</h3>

          <div class="setting-drawer-index-blockChecbox">
            <el-tooltip placement="top">
              <template slot="content">暗色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('dark')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg"
                  alt="dark"
                />
                <div class="setting-drawer-index-selectIcon" v-if="navTheme === 'dark'">
                  <el-icon class="el-icon-check" />
                </div>
              </div>
            </el-tooltip>

            <el-tooltip placement="top">
              <template slot="content">亮色菜单风格</template>
              <div class="setting-drawer-index-item" @click="handleMenuTheme('light')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg"
                  alt="light"
                />
                <div class="setting-drawer-index-selectIcon" v-if="navTheme !== 'dark'">
                  <el-icon class="el-icon-check" />
                </div>
              </div>
            </el-tooltip>
          </div>
        </div> -->

        <!-- <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题色</h3>

          <div style="height: 20px;display:flex;align-items:center;">
            <el-tooltip
              placement="top"
              class="setting-drawer-theme-color-colorBlock"
              v-for="(item, index) in colorList"
              :key="index"
            >
              <template slot="content">{{ item.key }}</template>
              <el-tag :color="item.color" @click="changeColor(item.color)">
                <i class="el-icon-check" v-if="item.color === primaryColor"></i>
              </el-tag>
            </el-tooltip>
            <el-tooltip placement="top" content="自定义主题色">
              <el-color-picker
                size="small"
                @change="changeColor"
                v-model="mainColor"
              >el-color-picker></el-color-picker>
            </el-tooltip>
          </div>
        </div> -->
        <el-divider />

        <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">主题风格</h3>

          <div style="height: 20px;display:flex;align-items:center;justify-content:space-between;">
            <span>默认风格</span>
            <el-select v-model="style" @change="changeStyle" size="small" style="width:100px;">
              <el-option value="default" label="默认风格">默认风格</el-option>
              <el-option value="htsy" label="风格二">枫哥哥</el-option>
              <el-option value="yxt" label="翼星通">翼星通</el-option>
            </el-select>
          </div>
        </div>
        <el-divider />

        <!-- <div :style="{ marginBottom: '24px' }">
          <h3 class="setting-drawer-index-title">导航模式</h3>

          <div class="setting-drawer-index-blockChecbox">
            <el-tooltip placement="top">
              <template slot="content">侧边栏导航</template>
              <div class="setting-drawer-index-item" @click="handleLayout('vertical')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg"
                  alt="sidemenu"
                />
                <div class="setting-drawer-index-selectIcon" v-if="layout === 'vertical'">
                  <el-icon class="el-icon-check" />
                </div>
              </div>
            </el-tooltip>

            <el-tooltip placement="top">
              <template slot="content">顶部栏导航</template>
              <div class="setting-drawer-index-item" @click="handleLayout('horizontal')">
                <img
                  src="https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg"
                  alt="topmenu"
                />
                <div class="setting-drawer-index-selectIcon" v-if="layout === 'horizontal'">
                  <el-icon class="el-icon-check" />
                </div>
              </div>
            </el-tooltip>
          </div>
          <div :style="{ marginTop: '24px' }">
            <el-row
              :style="{ marginBottom: '24px' }"
              type="flex"
              align="middle"
              justify="space-around"
            ></el-row>
            <el-row
              :style="{ marginBottom: '24px' }"
              type="flex"
              align="middle"
              justify="space-around"
            >
              <el-col>
                <div>固定 Header</div>
              </el-col>
              <el-col :style="{ textAlign: 'right' }">
                <el-switch v-model="fixedHeader" size="small" @change="handleFixedHeader" />
              </el-col>
            </el-row>
            <el-row
              :style="{ marginBottom: '24px' }"
              type="flex"
              align="middle"
              justify="space-around"
            >
              <el-col>
                <div
                  :style="{ textDecoration: layout === 'topmenu' ? 'line-through' : 'unset' }"
                >固定侧边菜单</div>
              </el-col>
              <el-col :style="{ textAlign: 'right' }">
                <el-switch
                  v-model="fixedSidebar"
                  size="small"
                  :disabled="layout === 'topmenu'"
                  @change="handleFixSiderbar"
                />
              </el-col>
            </el-row>
          </div>
        </div> -->
        <el-divider />

        <!-- <div :style="{ marginBottom: '24px' }">
          <el-alert type="warning" :style="{ marginTop: '24px' }">
            <span slot="title">拷贝设置可以获取配置项,若配置更改后样式不生效,请手动修改配置文件。修改配置文件后，需要清空本地缓存和LocalStorage</span>
          </el-alert>
          <el-button :style="{ width: '100%', marginTop: '20px' }" @click="doCopy" icon="copy">拷贝设置</el-button>
        </div> -->
      </div>
    </el-drawer>
  </div>
</template>

<script>
import SettingItem from './SettingItem'
// import config from '@/config/defaultSettings'
import { updateTheme, updateColorWeak, colorList } from './settingConfig'
import { changeThemeColor } from './themeColor.js'
// import { layout } from '@/config/defaultSettings'

export default {
  components: {
    SettingItem
  },
  data() {
    return {
      visible: false,
      colorList,
      mainColor: '',
      style: ''
      // fixedHeader: true,
      // fixedSidebar: true
    }
  },
  computed: {
    layout() {
      return this.$store.state.app.layout
    }
  },
  watch: {},
  mounted() {
    // updateTheme(this.primaryColor)
    // if (this.colorWeak !== config.colorWeak) {
    //   updateColorWeak(this.colorWeak)
    // }
  },
  methods: {
    showDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    toggle() {
      this.visible = !this.visible
    },
    onColorWeak(checked) {
      this.$store.dispatch('ToggleWeak', checked)
      updateColorWeak(checked)
    },
    onMultiTab(checked) {
      this.$store.dispatch('ToggleMultiTab', checked)
    },
    handleMenuTheme(theme) {
      this.$store.dispatch('ToggleTheme', theme)
    },
    doCopy() {
      // get current settings from mixin or this.$store.state.app, pay attention to the property name
      const text = `export default {
  primaryColor: '${this.primaryColor}', // primary color of ant design
  navTheme: '${this.navTheme}', // theme for nav menu
  layout: '${this.layout}', // nav menu position: sidemenu or topmenu
  contentWidth: '${this.contentWidth}', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: ${this.fixedHeader}, // sticky header
  fixedSidebar: ${this.fixedSidebar}, // sticky siderbar
  autoHideHeader: ${this.autoHideHeader}, //  auto hide header
  colorWeak: ${this.colorWeak},
  multiTab: ${this.multiTab},
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
}`
      this.$copyText(text)
        .then(message => {
          this.$message.success('复制完毕')
        })
        .catch(err => {
          this.$message.error('复制失败')
        })
    },
    handleLayout(mode) {
      this.$store.commit('layout', mode)
      // 因为顶部菜单不能固定左侧菜单栏，所以强制关闭
      this.handleFixSiderbar(false)
      if (layout === 'horizontal') {
      }
    },
    handleContentWidthChange(type) {
      this.$store.dispatch('ToggleContentWidth', type)
    },
    // 切换主题色
    changeColor(color) {
      if (this.primaryColor !== color) {
        this.$store.dispatch('toggleColor', color)
        changeThemeColor(color)
      }
    },
    changeStyle(style) {
      window.document.documentElement.setAttribute('data-theme', style)
      this.$store.commit('update_theme', style)
    },
    handleFixedHeader(fixed) {
      this.$store.commit('fixed_header', fixed)
    },
    handleFixedHeaderHidden(autoHidden) {
      this.$store.dispatch('ToggleFixedHeaderHidden', autoHidden)
    },
    handleFixSiderbar(fixed) {
      if (this.layout === 'topmenu') {
        this.$store.commit('fixed_sidebar', false)
        return
      }
      this.$store.commit('fixed_sidebar', fixed)
    },
    dragDrawer(e) {
      setTimeout(() => {
        document.getElementsByClassName('setting-drawer-index-handle')[0].style.top =
          e.clientY + 'px'
      }, 10)
    }
  }
}
</script>
<style lang="scss" scoped>
.setting-drawer-index-content {
  .closeBtn {
    font-size: 20px;
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.45);
    &:hover {
      color: rgba(0, 0, 0, 1);
    }
  }

  .setting-drawer-index-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .setting-drawer-index-blockChecbox {
    display: flex;

    .setting-drawer-index-item {
      margin-right: 16px;
      position: relative;
      border-radius: 4px;
      cursor: pointer;

      img {
        width: 48px;
      }

      .setting-drawer-index-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        padding-top: 15px;
        padding-left: 24px;
        height: 100%;
        color: #1890ff;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
}

.setting-drawer-index-handle {
  position: fixed;
  top: 440px;
  width: 48px;
  height: 48px;
  // right: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  z-index: 9999;
  text-align: center;
  font-size: 16px;
  border-radius: 4px 0 0 4px;
  cursor: pointer;
  transition: ease 0.3s;
  i {
    color: rgb(255, 255, 255);
    font-size: 20px;
  }
}
</style>
