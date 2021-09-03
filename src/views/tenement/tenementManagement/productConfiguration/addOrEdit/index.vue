<template>
  <div class="addProductConfig">
    <div class="app-content-wrap">
      <app-mainHeader
        :title="$route.name === 'Edit' ? '修改产品' : '添加产品'"
        hasBackBtn
      ></app-mainHeader>
      <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
        <el-row>
          <el-col :span="10">
            <el-form-item
              :label="$route.name === 'Add' ? '选择产品：' : '产品名称：'"
              prop="appname"
            >
              <el-select
                v-if="$route.name === 'Add'"
                class="form-item"
                v-model="form.appname"
                placeholder="请选择"
              >
                <el-option
                  v-for="product in productList"
                  :key="product.id"
                  :label="product.name"
                  :value="product.id"
                >
                  <span class="option-ellpsis" :title="product.name + product.version">{{
                    product.name
                  }}</span>
                </el-option>
              </el-select>
              <span v-else>{{ idToName(form.appname) }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="选择版本：" prop="appId">
              <el-select class="form-item" v-model="form.appId" placeholder="请选择">
                <el-option
                  v-for="version in versionList"
                  :key="version.id"
                  :label="version.version"
                  :value="version.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="10">
            <el-form-item label="系统显示名称：" prop="displayName">
              <el-input
                class="form-item"
                placeholder="请输入系统显示名称"
                v-model.trim="form.displayName"
                maxlength="50"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="产品状态：" prop="isEnabled">
              <el-radio :label="1" v-model="form.isEnabled">启用</el-radio>
              <el-radio :label="0" v-model="form.isEnabled">禁用</el-radio>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="系统显示LOGO：" prop="description">
              <upload  :uploadConfig="uploadConfig" @handleFileList="handleFileList"></upload>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="生效日期：" prop="effectiveTime">
              <date-picker
                class="form-item"
                :disabledDate="{
                  compareTime: this.form.expireTime,
                  type: 'start'
                }"
                :date="form.effectiveTime"
                @change="(v) => (form.effectiveTime = v)"
              ></date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="失效日期：" prop="expireTime">
              <date-picker
                class="form-item"
                fullday
                :date="form.expireTime"
                :disabledDate="{
                  compareTime: this.form.effectiveTime,
                  type: 'end'
                }"
                @change="(v) => (form.expireTime = v)"
              ></date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="相关合同：">
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
                :limit="3"
                :file-list="fileList"
              >
                <el-button icon="el-icon-upload" size="small" type="primary">上传附件</el-button>
              </el-upload>
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
import { AppMainHeader, FilterForm, DatePicker, Upload } from '@/components'
import { flat, toTree } from '@/utils'
import resourceConfiguration from './resourceConfiguration.vue'
import {
  getProduct,
  getAppNames,
  getVersionList,
  updateProduct,
  editProduct,
  relevanceResource
} from '@/api/productManage'

export default {
  components: {
    AppMainHeader,
    resourceConfiguration,
    DatePicker,
    Upload
  },
  data() {
    return {
      form: {
        appname: '',
        displayName: '',
        isEnabled: 1,
        effectiveTime: '',
        expireTime: '',
        logoUrl: ''
      },
      rules: {
        appname: [
          this.$route.name === 'Add'
            ? { required: true, message: '请选择产品', trigger: 'blur' }
            : {}
        ],
        appId: [{ required: true, message: '请选择版本', trigger: 'blur' }],
        effectiveTime: [{ required: true, message: '请选择生效日期', trigger: 'blur' }],
        expireTime: [{ required: true, message: '请选择失效日期', trigger: 'blur' }]
      },
      productList: [],
      versionList: [],
      resources: [],
      processedTree: [],
      uploadConfig: {
        type: 'img', //上传类型
        filekey: '',
        fileType: 'jpg,png', //上传的文件类型
        limit: 2 //单位M
      },
      fileList: []
    }
  },

  created() {
    this.getAppNames()
  },
  watch: {
    'form.appname': {
      handler(val, oldVal) {
        if (val) {
          this.$set(this.form, 'appId', '')
          this.getVersionList(val)
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    // 获取主产品列表
    getAppNames() {
      getAppNames().then((res) => {
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
        this.$set(this.form, 'appname', data.mainId)
        this.uploadConfig.filekey = data.logo
      }
    },
    idToName(id) {
      if (this.productList.length && id) {
        return this.productList.filter((item) => item.id == id)[0].name
      }
    },
    /**
     * @description:
     * 如果是修改页面，获取版本后，根据产品找出对应的version,然后赋值
     * @param {*} id
     * @return {*}
     */
    getVersionList(id) {
      getVersionList({ id, flag: this.$route.name == 'Edit' ? 1 : 0 }).then((res) => {
        this.versionList = res.data
        if (this.$route.name === 'Edit') {
          let currentVersion = this.versionList.filter(
            (version) => version.version === this.form.version
          )[0]
          this.$set(this.form, 'appId', currentVersion.id)
        }
      })
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
          // 如果是修改，先调关联资源接口，查看产品是否已被订购，然后再调用修改产品接口
          // 更新和添加，先调产品接口，获取新的产品id，然后再关联资源
          if (this.$route.name === 'Edit') {
            this.relevanceResource().then((res) => {
              this.addEditProduct().then((result) => {
                this.handleResult(result)
              })
            })
          } else {
            this.addEditProduct().then((res) => {
              this.relevanceResource(res.data).then((result) => {
                this.handleResult(result)
              })
            })
          }
        }
      })
    },

    handleResult(result) {
      if (result.code == 200) {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.$router.push({
          path: '/tenementManagement/product',
          query: {
            tenantId: this.$route.query.tenantId
          }
        })
      }
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
            tenantId: this.$route.query.tenantId,
            id: this.$route.query.productId // 修改产品的id
          })
          code === '200' && resolve({ code, data, msg })
        } else {
          var { code, data, msg } = await updateProduct({
            ...this.form,
            tenantId: this.$route.query.tenantId
          })
          code === '200' && resolve({ code, data, msg })
        }
      })
    },

    async relevanceResource(id) {
      return new Promise(async (resolve, reject) => {
        id = this.$route.name == 'Add' ? id : this.$route.query.productId
        const { code, data, message } = await relevanceResource({
          id: id,
          resources: this.handleParams()
        })
        if (code == 200) {
          resolve({ code, data, message })
        }
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
    if (to.path === '/tenementManagement/product/table' && !Object.values(to.query).length) {
      next({
        path: '/tenementManagement/product/table',
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
      width: 70%;
    }
  }
}
.option-ellpsis {
  max-width: 500px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
