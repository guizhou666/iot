<template>
  <div class="img__skeleton">
    <img
      :style="{ width: this.size + 'px', height: this.size + 'px', borderRadius: type == 'circle' ? '50%' : '6px' }"
      :src="imgUrl || defaultImg"
      alt
    />
  </div>
</template>

<script>
const defaultImg = require('../../assets/login/default-product.png')
import { getImg } from '@/api/file'
export default {
  props: {
    filekey: {
      type: String,
      default: ''
    },
    defaultImg: {
      type: String,
      default: defaultImg
    },
    size: {
      type: String,
      default: '60'
    },
    type: {
      type: String,
      default: 'square'
    }
  },
  data() {
    return {
      imgUrl: ''
    }
  },
  watch: {
    filekey(val) {
      val && this.getImg()
    },
    immediate: true
  },
  created() {
    this.filekey && this.getImg()
  },
  methods: {
    // 获取产品图标
    getImg() {
      getImg(this.filekey).then((res) => {
        let url = URL.createObjectURL(res)
        this.imgUrl = url
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.img__skeleton {
  // width: 100%;
  // height: 100%;
}
</style>>
