<template>
  <section class="main-header">
    <h3 class="main-header-title">{{ title }}</h3>
    <slot name="content"></slot>
    <el-button class="hvr-icon-back" v-if="hasBackBtn" type="primary" size="small" @click="back">
      <i class="el-icon-arrow-left hvr-icon"></i>
      返回
    </el-button>
  </section>
</template>

<script>
export default {
  name: 'AppMainHeader',
  props: {
    hasBackBtn: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  created() {},
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang="scss">
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  
  .main-header-title {

    margin: 10px 0;
    padding-left: 18px;
    // border-left: 6px solid $--color-primary;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 6px;
      left: 1px;
      top: 3px;
      height: 20px;
      @include background_color('primary_color')
    }
  }
}
</style>
