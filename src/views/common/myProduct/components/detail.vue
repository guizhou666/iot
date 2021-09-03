<template>
  <div class="main">
    <div class="app-content-wrap">
      <AppMainHeader :title="$t('myProduct.viewProductDetail')" :hasBackBtn="true"></AppMainHeader>
      <div class="main-header">
        <el-form class="form-box" label-width="180px">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('myProduct.productCode')">
                <span>{{ detailData.code | isNull }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('myProduct.productName')">
                <span>{{userInfo.userType ==='租户'? detailData.name : detailData.parentDisplayName | isNull}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('myProduct.sysShowName')" prop="xtname">
                <span>{{ detailData.displayName | isNull }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('myProduct.nowVersion')" prop="version">
                <span>{{detailData.version | isNull}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('myProduct.showStyle')" prop="appId">
                <span>{{detailData.displayStyleName | isNull}}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('myProduct.sysShowLogo')" prop="logo">
                <span>
                  <img-skeleton size="40" type="circle" :filekey="detailData.logo" />
                </span>
              </el-form-item>
            </el-col>

            <template v-if="userInfo.userType ==='租户'">
              <el-col :span="12">
                <el-form-item :label="$t('myProduct.effectiveDate')" prop="startTime">
                  <span>{{ detailData.effectiveTime | isNull }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('myProduct.loseData')" prop="endTime">
                  <span>{{ detailData.expireTime | isNull }}</span>
                </el-form-item>
              </el-col>
            </template>
          </el-row>

          <el-col :span="12">
            <el-form-item label="产品标识：" prop="pdaFlag">
              <span>{{ !detailData.pdaFlag  ? 'web端' : '客户端' }}</span>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div class="main-bottom">
        <AppMainHeader :title="$t('myProduct.resourceSetting')"></AppMainHeader>
        <TreeTable :treeConfig="treeConfig" :treeData="treeData" class="treeTable-warpper">
          <template slot="url" slot-scope="scope">
            <a>{{ scope.row.url | isNull }}</a>
          </template>
        </TreeTable>
      </div>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, TreeTable, ImgSkeleton } from '@/components'
import { getProduct } from '@/api/productManage'
import { getRelevanceResource } from '@/api/resourceManage'
export default {
  components: {
    AppMainHeader,
    TreeTable,
    ImgSkeleton,
  },
  data() {
    return {
      treeData: [],
      treeConfig: {
        showCheckbox: false,
        showHeader: true,
        showFooter: false,
        clientWidth: 0,
        hideChecking: true,
        props: {
          children: 'childList', //根据这个值遍历节点。
        },
        nodeKey: 'resourceId', //节点数的唯一标识
        defaultExpandAll: true,
        headers: [
          { title: this.$t('myProduct.resourceName'), field: 'name', width: '30%', showIcon: true },
          { title: this.$t('myProduct.resourceAlias'), field: 'resourceAlias', width: '20%' },
          { title: this.$t('myProduct.code'), field: 'code', width: '20%' },
          { title: this.$t('myProduct.path'), tdTemplate: 'url', width: '30%' },
        ],
      },
      detailData: {},
    }
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  methods: {
    // 获取详情
    async _getDetail() {
      const params = {
        id: this.$route.query?.id,
      }
      const { code, data, msg } = await getProduct(params)
      if (code === '200') {
        this.detailData = data
        this.detailData.effectiveTime = data.effectiveTime?.split(' ')[0]
        this.detailData.expireTime = data.expireTime?.split(' ')[0]
      }
    },
    // 获取资源配置
    async _getResources() {
      const { code, data, msg } = await getRelevanceResource({
        id: this.$route.query.id,
      })
      if (code === '200') {
        this.treeData = data
      }
    },
  },
  created() {
    this._getDetail()
    this._getResources()
  },
  mounted() {
    this.treeConfig.clientWidth =
      document.getElementsByClassName('treeTable-warpper')[0].clientWidth
  },
}
</script>
<style lang="scss" scoped>
.main-header {
  display: flex;
  flex-wrap: wrap;
  //   line-height: 80px;
  //   padding-left: 60px;
  // border-bottom: 1px solid #dcdde1;
  .form-box {
    margin-top: 40px;
    & .el-input,
    .el-textarea {
      width: 50%;
    }
    .tips {
      margin-left: 12px;
      font-size: 112px;
      color: #00a4ff;
      transition: 0.3s;
      &:hover {
        font-size: 18px;
        color: #0193e2;
      }
    }
    .avatar-container {
      display: flex;
      align-items: center;
      .el-avatar {
        margin-right: 20px;
      }
    }
  }
  span > img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
    background-color: #cccccc;
    vertical-align: middle;
    margin: 0 10px 0px 30px;
  }
  //   }
}
</style>
