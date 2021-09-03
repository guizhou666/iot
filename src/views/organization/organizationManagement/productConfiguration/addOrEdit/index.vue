<template>
  <div class="addProductConfig">
    <!-- <app-mainHeader :title="$route.name === 'Edit' ? '修改产品' : '添加产品'"></app-mainHeader> -->
    <div class="app-content-wrap">
      <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
        <el-row>
          <el-col :span="14">
            <el-form-item label="租户-系统显示名称：" prop="appId">
              <el-select
                v-if="$route.name === 'Add'"
                class="form-item"
                v-model="form.appId"
                placeholder="请选择"
              >
                <el-option
                  v-for="product in productList"
                  :key="product.id"
                  :label="`${product.realName}`"
                  :value="product.id"
                ></el-option>
              </el-select>
              <span v-else>{{ tenement && tenement.realName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="机构-系统显示名称：" prop="displayName">
              <el-input
                class="form-item"
                v-model="form.displayName"
                placeholder="请输入系统显示名称"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="机构-系统显示LOGO：" prop="description">
              <upload  :uploadConfig="uploadConfig" @handleFileList="handleFileList"></upload>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="产品状态" prop="isEnabled">
              <el-radio :label="1" v-model="form.isEnabled">启用</el-radio>
              <el-radio :label="0" v-model="form.isEnabled">禁用</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <app-mainHeader title="资源配置"></app-mainHeader>

      <resource-configuration
        @changeTree="changeTree"
        ref="resources"
        :appId="form.appId"
      ></resource-configuration>

      <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-col :span="2">
          <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, Upload } from '@/components'
import { flat, toTree } from '@/utils'
import resourceConfiguration from './resourceConfiguration.vue'
import {
  getProduct,
  getTenementAppNames,
  getVersionList,
  updateProduct,
  editProduct,
  relevanceResource
} from '@/api/productManage'

export default {
  data() {
    return {
      form: {
        appId: '',
        displayName: '',
        isEnabled: 1,
        logoUrl: ''
      },
      rules: {
        appId: [
          this.$route.name === 'Add' ? { required: true, message: '请选择', trigger: 'blur' } : {}
        ]
      },
      productList: [],
      versionList: [],
      resources: [],
      fileList: [],
      processedTree: [],
      uploadConfig: {
        type: 'img', //上传类型
        filekey: '',
        fileType: 'jpg,png', //上传的文件类型
        limit: 2 //单位M
      },
    }
  },

  components: {
    AppMainHeader,
    resourceConfiguration,
    Upload
  },
  computed: {
    tenement() {
      return this.productList.filter((item) => item.id === this.form.appId)[0]
    }
  },
  created() {
    this.getTenementAppNames()
  },
  methods: {
    // 获取主产品列表
    getTenementAppNames() {
      getTenementAppNames({
        id: this.$route.query.tenantId
      }).then((res) => {
        this.productList = res.data
        // 如果是修改，先查找产品列表，然后查找当前产品详情获取主产品ID
        if (this.$route.name === 'Edit') {
          this.getProduct()
        }
      })
    },

    // 查询产品详情
    async getProduct() {
      const { code, data, msg } = await getProduct({
        id: this.$route.query.productId
      })
      if (code === '200') {
        this.form = data
        // 赋值主产品
        this.$set(this.form, 'appId', data.appId)
        this.uploadConfig.filekey = data.logo
      }
    },

    handleFileList(file) {
      this.form.logo = file.filekey
      this.form.logoUrl = file.origUrl
    },

    cancel() {
      this.$router.go(-1)
    },
    confirm() {
      this.$refs.form['validate']((validate) => {
        if (validate) {
          this.addEditProduct().then((res) => {
            this.relevanceResource(res.data)
          })
        }
      })
    },

    /**
     * @description: 这里的添加产品，实际是调用更新租户产品的接口
     * @param {*}
     * @return {*}
     */
    async addEditProduct() {
      return new Promise(async (resolve, reject) => {
        if (this.$route.name === 'Edit') {
          var { code, data, msg } = await editProduct({
            ...this.form,
            orgId: this.$route.query.orgId,
            tenantId: this.$route.query.tenantId,
            id: this.form.id
          })
          code === '200' && resolve({ code, data, msg })
        } else if (this.$route.name === 'Add') {
          var { code, data, msg } = await updateProduct({
            ...this.form,
            orgId: this.$route.query.orgId,
            tenantId: this.$route.query.tenantId,
            id: this.form.appId
          })
          code === '200' && resolve({ code, data, msg })
        }
      })
    },

    /**
     * @description: 关联资源
     * @param {*}
     * @return {*}
     */
    async relevanceResource(id) {
      id = this.$route.name == 'Add' ? id : this.$route.query.productId
      const { code, data, message } = await relevanceResource({
        id: id,
        resources: this.handleParams()
      })
      this.responseHandler(code, data, message).then((res) => {
        this.$router.push({
          path: '/organizationManagement/product',
          query: {
            tenantId: this.$route.query.tenantId,
            orgId: this.$route.query.orgId
          }
        })
      })
    },
    handleParams() {
      let { resources } = this.$refs
      let { treetable } = resources.$refs
      let checkedNodes = treetable.getCheckedNodes(true)
      let allResource = flat(this.processedTree)
      allResource.map((item) => (item.checking = 0))
      checkedNodes.map((item) => {
        allResource.map((v) => {
          if (v.id == item.id) {
            v.checking = 1
          }
        })
      })

      return toTree(allResource)
    },
    changeTree(val) {
      this.processedTree = val
    }
  },

  // 解决点击breadcrumb会丢失url中参数的问题
  beforeRouteLeave(to, from, next) {
    if (to.path === '/organizationManagement/product/table' && !Object.values(to.query).length) {
      next({
        path: '/organizationManagement/product/table',
        query: from.query
      })
    } else {
      next()
    }
  }
}
</script>

<style lang="scss">
.addProductConfig {
  .form-box {
    margin-top: 20px;
    .el-upload-dragger {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-upload__tip {
      margin-left: 20px;
      display: inline-block;
    }
    .form-item {
      width: 50%;
    }
  }
}
</style>
