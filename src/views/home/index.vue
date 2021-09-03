<template>
  <div class="home_wrap" :style="{ backgroundImage: bgUrl }">
    <div v-for="product in productList" :key="product.id" class="home-wrapper" :class="{ 'hidden-item': !isShow(product) }">
      <div class="home-item">
        <div class="home-item-content" @click="clickProduct(product)">
          <div class="home-item-icon hvr-float-shadow">
            <div v-if="isExpire(product)" class="mask">
              <div class="icon el-icon-iot-jinyong" />
              <span>已过期</span>
            </div>
            <img-skeleton size="70" :filekey="product.logo" />
          </div>
          <el-tooltip :content="product.realName" placement="bottom">
            <span class="home-item-title">{{ product.realName }}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkURL } from '@/utils/validate'
import {
  UPDATE_ACTIVEDIRECTORY,
  UPDATE_ACTIVEMENU,
  UPDATE_APPINFO,
  UPDATE_THEME,
  UPDATE_ACTIVEURL,
  UPDATE_MENUS
} from '@/store/mutation-types'
import { ImgSkeleton } from '@/components'
import { getFirst } from '@/utils'
import { mapActions } from 'vuex'
import { handleLayout } from '@/layout/mixin/settings'
import storage from 'store'

export default {
  name: 'Home',
  components: { ImgSkeleton },
  data() {
    return {
      imgObj: {}, // 产品图片
      defaultImg: require('../../assets/login/default-product.png')
    }
  },
  computed: {
    // 是否展示
    isShow() {
      return (product) => {
        let { isEnabled, expireTime, effectiveTime, tenantId, pdaFlag } = product

        // PDA产品不展示
        if (pdaFlag) return false

        // 禁用不展示
        if (!isEnabled) {
          return false
        } else {
          // 平台的展示
          if (tenantId == -1) {
            return true
          } else {
            const currentTime = new Date().getTime()
            effectiveTime = new Date(effectiveTime).getTime()

            // 未生效的不展示
            if (effectiveTime > currentTime) {
              return false
            }
            return true
          }
        }
      }
    },
    productList() {
      return this.$store.state.app.productList
    },
    setting() {
      return this.$store.state.app.setting
    },
    bgUrl() {
      const url = this.setting['bgUrl']
      return 'url(' + require('../../assets/' + 'login/' + `${url}`) + ')'
    },
    logoUrl() {
      const url = this.setting['logoUrl']
      return 'url(' + require('../../assets/' + 'login/' + `${url}`) + ')'
    }
  },
  created() {
    this.$store.dispatch('getProductList', { flag: 1 })
  },
  methods: {
    ...mapActions(['getRelevanceResource']),

    // 是否为过期产品
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

    // 选择产品
    clickProduct(product) {
      // 如果是过期产品,不作操作
      if (this.isExpire(product)) return
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
          }
        }
      })
    },

    // 初始化跳转url
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
          this.$store.commit(UPDATE_ACTIVEURL, redirectUrl)
        }
      })
    }
  },

  // 进入页面前清空目录和菜单
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(UPDATE_ACTIVEMENU, {})
      vm.$store.commit(UPDATE_ACTIVEDIRECTORY, {})
      vm.$store.commit(UPDATE_MENUS, [])
    })
  }
}
</script>

<style lang="scss" scoped>
.home_wrap {
  width: 100%;
  height: calc(100vh - 70px);
  overflow: auto;
  padding: 80px;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  .hidden-item {
    display: none;
  }
  .home-wrapper {
    height: fit-content;
    width: 20%;
    .home-item {
      height: fit-content;
      color: #fff;
      font-size: 18px;
      .home-item-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .home-item-icon {
          margin-bottom: 10px;
          position: relative;
          .mask {
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: 600;
            color: #ff5252;
          }
          span {
            font-size: 14px;
            margin-top: 4px;
          }
        }
        .home-item-title {
          width: 60%;
          white-space: nowrap;
          margin-bottom: 20px;
          font-size: 16px;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          height: 26px;
        }
      }
    }
  }
}
</style>
