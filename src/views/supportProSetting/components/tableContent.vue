<template>
  <div class="table-content">
    <div class="header" @click="showChildren">
      <div class="header-left">
        <i v-if="showUpIcon" class="iconfont el-icon-iot-shuangjiantou-shang"></i>
        <i v-else class="iconfont el-icon-iot-shuangjiantou-xia"></i>
        <h3 class="header">{{ data.name }}</h3>
      </div>
      <div class="header-right">
        <el-button type="primary" @click.stop="addExample(data.id)">增加实例</el-button>
        <el-button>删除</el-button>
      </div>
    </div>
    <transition name="move">
      <div class="bottom-box" v-if="!showUpIcon">
        <div v-for="(item, index) in data.children" :key="index" class="li-list">
          <div class="header header-two">
            <div class="header-left">
              <i class="iconfont el-icon-iot-yuandian"></i>
              <h3 class="title">{{ item.name }}</h3>
            </div>
            <div class="header-right">
              <el-button type="primary">保存</el-button>
              <el-button>删除</el-button>
            </div>
          </div>
          <div class="bottom-content">
            <li class="input-box" v-for="(item2, index2) in item.children" :key="index2">
              <el-input v-model="item2.key" placeholder="请输入内容"></el-input>
              <el-input v-model="item2.value" placeholder="请输入内容"></el-input>
            </li>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      showUpIcon: true,
    };
  },
  props: {
    data: {},
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {
  },
  mounted() {},
  methods: {
    showChildren() {
      this.showUpIcon = !this.showUpIcon;
    },
    // 增加实例
    addExample(id) {
      this.$emit("addExample", id);
    },
  },
};
</script>
<style lang="scss" scoped>
.table-content {
  margin-bottom: 20px;
  .header {
    padding: 0px 15px;
    height: 50px;
    line-height: 50px;
    background-color: #f1f1f1;
    cursor: pointer;
    .header-left {
      float: left;
      height: 100%;
      h3 {
        display: inline-block;
        margin: 0px !important;
      }
    }
    .header-right {
      float: right;
    }
    .iconfont {
      color: #2f75ee;
    }
  }
  .header-two {
    background-color: #ffffff !important;
  }
  .el-icon-iot-yuandian {
    margin-right: 5px;
  }
  .li-list {
    .bottom-content {
      margin-top: 20px;
      li {
        list-style-type: none;
      }
      .input-box {
        padding-right: 15px;
        width: 100%;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        ::v-deep .el-input {
          &:nth-of-type(1) {
            width: 45%;
            margin-right: 15px;
          }
        }
      }
    }
  }
//   .bottom-box {
//     height: 500px;
//     overflow: hidden;
//   }
//   .move-leave-to,
//   .move-enter {
//     height: 0px !important;
//     overflow: hidden;
//   }
//   .move-leave-active,
//   .move-enter-active {
//     transition: all 1s;
//   }
}
</style>
