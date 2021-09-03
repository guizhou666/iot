<template>
  <div class="post-detail app-content-wrap">
    <template v-if="$route.path === '/organization/postDetail'">
      <AppMainHeader :title="$t('postManagement.viewPostDetail')" :hasBackBtn="true"></AppMainHeader>
      <div class="detail-header">
        <li class="wid100">
          <span>{{$t('postManagement.postCode')}}</span><span>{{ detail.code | isNull }}</span>
        </li>
        <li class="wid100">
          <span>{{$t('postManagement.postName')}}</span><span>{{ detail.name | isNull }}</span>
        </li>
        <li>
          <span>{{$t('postManagement.belongDep')}}</span><span>{{ detail.deptNames | isNull }}</span>
        </li>
        <li>
          <span>{{$t('postManagement.postDuty')}}</span><span>{{ detail.duty | isNull }}</span>
        </li>
        <li>
          <span>{{$t('remark')}}</span><span> {{ detail.description | isNull }}</span>
        </li>
      </div>
      <div class="detail-bottom">
        <user-info
          @viewDetail="viewDetail"
          :departmentId="$route.query.departmentId"
          :code="$route.query.code"
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
import userInfo from "../../components/userInfo.vue";
import { postDetail } from "@/api/postManage";
export default {
  components: {
    AppMainHeader,
    userInfo,
  },
  data() {
    return {
      detail: {},
    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {
    if (this.$route.path === "/organization/postDetail") {
      // 岗位详情
      this._getDetail();
    } else {
      // 人员详情
    }
  },
  mounted() {},
  methods: {
    // 查看人员信息
    viewDetail(id) {
      this.$router.push({
        path: "/organization/postDetail/userDetail",
        query: { userId: id },
      });
    },
    // 获取详情
    async _getDetail() {
      const id = this.$route.query.id;
      const { code, data, msg } = await postDetail({ id: id });
      if (code == 200) {
        this.detail = data;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.post-detail {
  width: 100%;
  .detail-header {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 70px;
    li {
      width: 100%;
      list-style-type: none;
      margin-bottom: 50px;
      line-height: 20px;
      position: relative;
      span {
        display: inline-block;
        word-break:break-all
      }
      span:nth-of-type(1) {
        width: 130px;
        text-align: right;
        position: absolute;
        top: 0px;
        font-size: 14px;
        color: #606266;
        font-weight: 700;
      }
      span:nth-of-type(2) {
        width: calc(100% - 100px);
        margin-left: 150px;
        font-size: 14px;
      }
    }
    .wid100 {
      width: 50%;
    }
  }
}
</style>
