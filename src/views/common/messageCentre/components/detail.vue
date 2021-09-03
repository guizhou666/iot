<template>
  <div class="main">
    <AppMainHeader :title="$t('messageCenter.messageDetail')" :hasBackBtn="true"></AppMainHeader>
    <div class="message-centre">
      <div class="centre-header">
        <el-form class="form-box" label-width="180px">
          <el-col :span="12">
            <el-form-item :label="$t('messageCenter.messageType')">
              <span>{{ 'detailData.parentNames | isNull '}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('messageCenter.messageSource')">
              <span>{{ 'detailData.code | isNull' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('messageCenter.title')">
              <span>{{ 'detailData.name | isNull' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('messageCenter.sendTime')">
              <span class="remark">{{ 'detailData.description | isNull' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('messageCenter.accessory')">
              <span class="remark">{{ 'detailData.description | isNull' }}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div class="centre-text"></div>
    </div>
  </div>
</template>

<script>
import { AppMainHeader } from "@/components";
export default {
  components: {
    AppMainHeader,
  },
  data() {
    return {};
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.main {
  .message-centre {
    padding: 20px 40px;
    .centre-header {
      display: flex;
      flex-wrap: wrap;
      line-height: 80px;
      li {
        list-style-type: none;
        width: 50%;
      }
    }
  }
}
</style>
