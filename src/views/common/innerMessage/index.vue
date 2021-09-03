<template>
  <div class="app-content-wrap innerMessage">
    <div class="innerMessage-header">
      <div class="innerMessage-header_left">
        <el-radio-group v-model="tab" @change="tabChange">
          <el-radio-button :label="item.key" v-for="(item,i) in tabs" :key="i">{{item.title}}</el-radio-button>
        </el-radio-group>
        <div class="button-wrap">
          <el-button
            :disabled="selectList.length < 2"
            :label="button"
            v-for="(button,i) in currentTab.button"
            :key="i"
          >{{button}}</el-button>
        </div>
      </div>
      <div class="innerMessage-header_right">
        <el-input size="small" placeholder="请输入关键字"></el-input>
        <span class="text" @click="toggleSearch">
          高级搜索
          <i class="el-icon-arrow-down" v-if="!showSearch"></i>
          <i class="el-icon-arrow-up" v-else></i>
        </span>
      </div>
    </div>
    <transition name="fade-transform" class="transition">
      <filter-form v-if="showSearch"></filter-form>
    </transition>
    <component
      ref="table"
      :is="currentTab.key == 'Write' ? null : currentTab.key"
      @getListHandle="getListHandle"
      @handleSelectChange="handleSelectChange"
    ></component>
  </div>
</template>

<script>
import FilterForm from './FilterForm'
import { AppMainHeader } from '@/components'
import { Receive, Draft, Send } from './Tabs'
export default {
  components: {
    FilterForm,
    Receive,
    Draft,
    Send
  },
  data() {
    return {
      tab: 'Receive',
      tabs: [
        {
          key: 'Receive',
          title: '收件箱',
          button: ['标记已读', '标记未读', '批量删除']
        },
        {
          key: 'Send',
          title: '发件箱',
          button: ['标记已读', '标记未读', '批量删除']
        },
        {
          key: 'Draft',
          title: '草稿箱',
          button: ['批量删除']
        },
        {
          key: 'Write',
          title: '写信',
          button: []
        }
      ],
      selectList: [],
      showSearch: false
    }
  },
  computed: {
    currentTab() {
      return this.tabs.filter(item => item.key == this.tab)[0]
    }
  },
  methods: {
    getListHandle(payload) {
    },
    handleSelectChange(selectList) {

      this.selectList = selectList.map(item => item.id)
    },
    tabChange(label) {
      if (label == 'Write') {
        this.$router.push('/innerMessage/add')
      }
    },
    toggleSearch() {
      this.showSearch = !this.showSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.innerMessage {
  .innerMessage-header {
    display: flex;
    justify-content: space-between;
    .innerMessage-header_left {
      display: flex;
      .el-radio-button:nth-last-child(1) {
        .el-radio-button__inner {
          border-radius: 0;
        }
      }
      .button-wrap {
        .el-button {
          margin: 0;
          border-radius: 0;
          height: 40px;
          border-left: none;
        }
        .el-button:nth-last-child(1) {
          border-radius: 2px;
        }
      }
    }
    .innerMessage-header_right {
      display: flex;
      align-items: center;
      .el-input {
        width: 70%;
      }
      .text {
        display: inline-block;
        @include font_color('primary_color');
        width: 100px;
        font-size: 14px;
        margin: 0 0 0 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
