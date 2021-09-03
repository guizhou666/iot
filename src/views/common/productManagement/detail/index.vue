<template>
  <div class="addoredit_user app-content-wrap">
    <AppMainHeader title="查看产品详情" :hasBackBtn="true"></AppMainHeader>

    <el-form class="form-box" label-width="180px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="APPID：">
            <span>{{ form.appId | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品图标：" justify='center'>
            <img-skeleton :filekey='form.logo' />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品编码：" prop="code">
            <span>{{ form.code | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品名称：" prop="name">
            <span>{{ form.name | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品状态：" prop="icon">
            <el-tag>{{form.isEnabled ? '启用' : '禁用'}}</el-tag>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="显示风格：" prop="appId">
            <span>{{form.displayStyleName | isNull}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="备注：" prop="description">
            <span class="description">{{ form.description | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="产品标识：" prop="description">
            <span>{{ !form.pdaFlag  ? 'web端' : '客户端' }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <AppMainHeader title="已关联资源" style="margin-bottom:40px">
      <template slot="content">
        <span>版本号：{{form.version | isNull}}</span>
      </template>
    </AppMainHeader>
    <TreeTable class="treeTable-warpper" :treeConfig="treeConfig" :treeData="treeData"></TreeTable>
  </div>
</template>

<script>
import { AppMainHeader, TreeTable, ImgSkeleton } from '@/components'
import { getProductDetail, getProductCondtion, getRelevanceResource } from '@/api/productManage'
export default {
  components: { AppMainHeader, TreeTable, ImgSkeleton },
  data() {
    return {
      form: {
        appId: '',
        icon: '',
        code: '',
        name: '',
        isEnabled: '',
        displayStyle: '',
        description: '',
        version: '',
        displayStyleName: '',
        logo: '',
        pdaFlag: '',
      },
      roleList: [],
      treeData: [],
      treeConfig: {
        showCheckbox: false,
        showHeader: true,
        showFooter: false,
        clientWidth: 0,
        props: {
          children: 'childList', //根据这个值遍历节点。
        },
        nodeKey: 'resourceId',
        defaultExpandAll: true,
        headers: [
          { title: '资源名称', field: 'name', width: '25%' },
          { title: '资源别名', field: 'resourceAlias', width: '20%' },
          { title: '编码', field: 'code', width: '20%' },
          { title: '路径', field: 'url', width: '20%' },
        ],
      },
      displayStyle: [
        {
          key: '0',
          label: '默认皮肤',
        },
        {
          key: '1',
          label: '风格皮肤一',
        },
        {
          key: '2',
          label: '风格皮肤二',
        },
      ],
    }
  },
  created() {
    this.getProductDetail()
    this.getRelevanceResource()
  },
  mounted() {
    this.treeConfig.clientWidth =
      document.getElementsByClassName('treeTable-warpper')[0].clientWidth
  },
  methods: {
    async getProductDetail() {
      const { code, data, msg } = await getProductDetail({
        id: this.$route.query.id,
      })
      if (code === '200') {
        this.form = {
          appId: data.appId,
          icon: data.icon,
          code: data.code,
          name: data.name,
          isEnabled: data.isEnabled,
          displayStyle: data.displayStyle,
          description: data.description,
          version: data.version,
          displayStyleName: data.displayStyleName,
          logo: data.logo,
          pdaFlag: data.pdaFlag,
        }
      }
    },
    async getRelevanceResource() {
      const { code, data, msg } = await getRelevanceResource({
        id: this.$route.query.id,
      })
      if (code === '200') {
        this.treeData = data
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.addoredit_user {
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
    .product__icon {
      width: 60px;
      height: 60px;
    }
    .description {
      @include textOverflow();
    }
  }
  .footer {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    & .el-button {
      margin: 0 20px;
    }
  }
}
</style>
