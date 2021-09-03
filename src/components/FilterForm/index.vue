<template>
  <div class="filter-wrapper">
    <slot name="form"></slot>
    <div class="search-text">
      <el-button size="small" type="primary" @click="onSearch">{{ $t('search') }}</el-button>
      <el-button size="small" @click="onClear">{{ $t('clear') }}</el-button>
      <template v-if="showText">
        <span v-if="showForm" class="search-text_title hvr-icon-up" type="primary" @click="toggleForm">
          高级搜索
          <span class="el-icon-arrow-up hvr-icon"></span>
        </span>
        <span v-else class="search-text_title hvr-icon-down" type="primary" @click="toggleForm">
          高级搜索
          <span class="el-icon-arrow-down hvr-icon"></span>
        </span>
      </template>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false
    }
  },
  props: {
    showText: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    placement() {
      return this.showForm ? 'top' : 'bottom'
    }
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm
      this.$emit('toggle', this.showForm)
    },
    onSearch() {
      this.$emit('onSearch')
    },
    onClear() {
      this.$emit('onClear')
    }
  }
}
</script>
<style lang="scss">
.filter-wrapper {
  .el-form {
    display: flex;
    flex-wrap: wrap;

    .datepicker.el-form-item {
      width: auto;
    }

    .el-form-item:not(.datepicker) {
      width: 80%;
      display: flex;
      & .el-form-item__content {
        flex: 1;
        .el-select {
          width: 100%;
        }
      }
    }
    .transition {
      width: 100%;
    }
  }
  .filter-search_button {
    position: absolute;
    right: 70px;
  }
}
</style>
<style lang="scss" scoped>
.filter-wrapper {
  position: relative;
  padding: 26px 26px 4px 26px;
  @include margin('filterform_margin_bottom');
  @include background_color('filterform_background');
  @include border_radius('filterform_border_radius');
  @include border('filterform_border');
  @include border_bottom('filterform_border_bottom');
  @include box_shadow('filterform_box_shadow');

  & .search-text {
    position: absolute;
    right: 30px;
    top: 30px;
    .search-text_title {
      margin-left: 4px;
      font-size: 15px;
      &:hover {
        cursor: pointer;
        @include font_color('primary_color');
      }
    }
  }
}
</style>