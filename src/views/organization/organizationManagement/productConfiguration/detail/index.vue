<template>
  <div class="main app-content-wrap">
    <AppMainHeader title="查看产品详情" :hasBackBtn="true"></AppMainHeader>

    <el-form class="form-box" label-width="180px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="产品编码">
            <span>{{ form.code | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品状态" prop="name">
            <el-tag>{{ form.isEnabled === 0 ? '已禁用' : '已启用' | isNull}}</el-tag>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="租户-系统显示名称" prop="name">
            <span>{{ form.parentName | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="版本号" prop="version">
            <span>{{ form.version | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="机构-系统显示名称" prop="displayName">
            <span>{{ form.realName | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="系统显示LOGO" prop="logo">
            <img-skeleton :filekey='form.logoUrl' type='circle' class="avatar-icon"></img-skeleton>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="main-bottom">
      <AppMainHeader title="资源配置"></AppMainHeader>
      <TreeTable :treeConfig="treeConfig" :treeData="treeData" class="treeTable-warpper">
        <template slot="url" slot-scope="scope">
          <a>{{ scope.row.url | isNull}}</a>
        </template>
      </TreeTable>
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
    ImgSkeleton
  },
  data() {
    return {
      treeData: [],
      treeConfig: {
        showCheckbox: false,
        showHeader: true,
        showFooter: false,
        clientWidth: 1640,
        hideChecking: true,
        props: {
          children: 'childList' //根据这个值遍历节点。
        },
        nodeKey: 'resourceId', //节点数的唯一标识
        defaultExpandAll: true,
        headers: [
          { title: '资源名称', field: 'name', width: '30%', showIcon: true },
          { title: '资源别名', field: 'resourceAlias', width: '20%' },
          { title: '编码', field: 'code', width: '20%' },
          { title: '路径', tdTemplate: 'url', width: '30%' }
        ]
      },
      form: {}
    }
  },
  methods: {
    // 获取详情
    async _getDetail() {
      const params = {
        id: this.$route.query['productId']
      }
      const { code, data, msg } = await getProduct(params)
      if (code === '200') {
        this.form = data
      }
    },
    // 获取资源配置
    async _getResources() {
      const { code, data, msg } = await getRelevanceResource({
        id: this.$route.query['productId']
      })
      if (code === '200') {
        this.treeData = data
      }
    }
  },
  created() {
    this._getDetail()
    this._getResources()
  },
  mounted() {
    this.treeConfig.clientWidth = document.getElementsByClassName(
      'treeTable-warpper'
    )[0].clientWidth
  }
}
</script>
<style lang="scss" scoped>
.form-box {
  margin-top: 20px;
}
</style>
