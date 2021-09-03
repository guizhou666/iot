<template>
   <span class="icon-select-main">
        <span :class="[defaultIcon,'selected-icon']"></span>
        <el-select @change='change' class="icon-select" v-model="defaultIcon" placeholder="请选择图标" clearable @visible-change="visibleChange">
            <el-option
            class="select-list"
            v-for="item in icons"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
            <i :class="item.label" style="font-size:18px;"></i>
            </el-option>
        </el-select>
    </span>
</template>

<script>
import {icons} from './icons.js'
  export default {
    data() {
      return {
        icons,
      }
    },
    props: {
        icon: {
            type: String
        }
    },
    computed: {
        defaultIcon: {
            get() {
                return this.icon
            },
            set() {

            }
        }
    },
    methods: {
        visibleChange(val) {
            const iconsDom = document.getElementsByClassName('select-list')[0].parentElement
            iconsDom.style.cssText="display:flex;flex-wrap:wrap;width:240px;";
        },
        change(val) {
            this.$emit('change', val)
        }
    }
  }
</script>
<style lang="scss" >
.icon-select-main{
    .icon-select {
        .el-input__inner  {
            color: rgba(0,0,0,0);
        }
    }
}

</style>
<style lang="scss" scoped>
.icon-select-main {
    position: relative;
    .selected-icon {
        font-size: 18px;
        position: absolute;
        top: 0px;
        left: 20px;
        z-index: 20;
    }
}
</style>
