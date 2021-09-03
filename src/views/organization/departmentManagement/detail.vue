<template>
  <div class="post-detail app-content-wrap">
    <template v-if="$route.path === '/departmentManagement/detail'">
      <AppMainHeader :title="$t('departmentManagement.viewDepDetail')" :hasBackBtn="true"></AppMainHeader>
      <div class="detail-header">
        <el-form class="form-box" label-width="180px">
          <el-col :span="24">
            <el-form-item :label="$t('departmentManagement.superiorDepartment')">
              <span>{{ detailData.parentNames | isNull }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('departmentManagement.depCode')">
              <span>{{ detailData.code | isNull }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('departmentManagement.depName')">
              <span>{{ detailData.name | isNull }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('remark')">
              <span class="remark">{{ detailData.description | isNull }}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div class="detail-bottom">
        <user-info
          @viewDetail="viewDetail"
          :code="$route.query.code"
          :departmentId="$route.query.departmentId"
        ></user-info>
      </div>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import { AppMainHeader } from "@/components";
import userInfo from "../components/userInfo.vue";
import { departmentDetail } from "@/api/postManage";
export default {
  components: {
    AppMainHeader,
    userInfo,
  },
  data() {
    return {
      detailData: {},
    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {
    if (this.$route.path === "/departmentManagement/detail") {
      // 部门详情
      this._getDepartmentDetail();
    } else {
      // 人员详情
    }
  },
  mounted() {},
  methods: {
    // 查看人员信息
    viewDetail(id) {
      this.$router.push({
        path: "/departmentManagement/detail/userDetail",
        query: { userId: id },
      });
    },
    // 部门详情
    async _getDepartmentDetail() {
      const params = {
        id: this.$route.query.departmentId,
      };
      const { code, data, msg } = await departmentDetail(params);
      if (code == 200) {
        this.detailData = data;
      } else {
        this.$message.error(msg);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.post-detail {
  span.remark {
    display: inline-block;
    word-break:break-all
  }
  width: 100%;
  .detail-header {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0px;
    .el-form {
      width: 100%;
    }
    .wid100 {
      width: 50%;
    }
  }
}
</style>
