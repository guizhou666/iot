<template>
  <div class="addoredit_user app-content-wrap">
    <AppMainHeader title="查看机构详情" :hasBackBtn="true"></AppMainHeader>
    <el-form class="form-box" label-width="180px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构ID:">
            <span>{{ form.id | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="机构状态:">
            <el-tag>{{ form.isEnabled === 0 ? '已禁用' : '已启用' | isNull }}</el-tag>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="机构编码:" prop="code">
            <span>{{ form.code | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="机构名称:" prop="name">
            <span>{{ form.name | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="法人代表:" prop="icon">
            <span>{{ form.legalPerson | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="用户名:" prop="appId">
            <span>{{ form.userName | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话:" prop="appId">
            <span>{{ form.contactPhone | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电子邮箱:" prop="appId">
            <span>{{ form.contactEmail| isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="地址:" prop="appId">
            <span>{{ form.fullAddress | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属租户:" prop="tenantName">
            <span>{{ form.tenantName | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品数量:" prop="appNum">
            <span>{{ form.appNum | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注" prop="description">
            <span>{{ form.description | isNull }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <AppMainHeader title="产品配置" style="margin-bottom:40px"></AppMainHeader>
    <productConfigurate type="detail"></productConfigurate>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import { getOrganization } from '@/api/organizationManage'
import productConfigurate from '../productConfiguration/index.vue'

export default {
  data() {
    return {
      form: {
        id: '',
        code: '',
        name: '',
        legalPerson: '',
        contactPhone: '',
        contactEmail: '',
        address: '',
        orgNum: '', //机构数量
        isEnabled: 0,
        description: '',
        userName: '',
        tenantName: ''
      }
    }
  },
  components: {
    AppMainHeader,
    productConfigurate
  },
  created() {
    this.getOrganization()
  },
  methods: {
    async getOrganization() {
      const { code, data, msg } = await getOrganization({
        id: this.$route.query.orgId
      })
      if (code === '200') {
        this.form = {
          id: data.id,
          code: data.code,
          name: data.name,
          legalPerson: data.legalPerson,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          fullAddress: data.fullAddress,
          accessMode: data.accessMode, //访问方式
          subdomain: data.subdomain, //二级域名
          proxyIp: data.proxyIp, // IP
          proxyPort: data.proxyPort, //端口
          orgNum: data.orgNum, //机构数量
          isEnabled: data.isEnabled,
          description: data.description,
          appNum: data.appNum,
          userName: data.userName,
          tenantName: data.tenantName
        }
      }
    }
  }
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
