<template>
  <div class="update_product">
    <div class="app-content-wrap">
      <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
        <el-form-item label="APPID：" prop="appId" v-if="type === 'Edit'">
          <template>
            <span>{{ form.appId }}</span>
          </template>
        </el-form-item>
        <el-form-item label="产品编码：" prop="code">
          <template v-if="type === 'Add'">
            <el-input prepend-icon class="form-item" v-model.trim="form.code" placeholder="请输入产品编码" maxlength="20">
              <el-tooltip slot="suffix" content="不填写产品编码，则系统自动生成" placement="top">
                <i class="el-icon-warning tips"></i>
              </el-tooltip>
            </el-input>
          </template>
          <el-tag v-else>{{ form.code }}</el-tag>
        </el-form-item>
        <el-form-item label="产品名称：" prop="name">
          <el-input v-if="type !== 'Update'" class="form-item" v-model.trim="form.name" placeholder="请输入产品名称" maxlength="50"></el-input>
          <span v-else>{{ form.name }}</span>
        </el-form-item>
        <el-form-item label="版本号：" prop="version">
          <el-input v-if="type !== 'Edit'" class="form-item" v-model.trim="form.version" placeholder="请输入版本号" maxlength="20"></el-input>
          <span v-else>{{ form.version }}</span>
        </el-form-item>
        <el-form-item label="产品标识：" prop="pdaFlag">
          <el-radio-group v-model="form.pdaFlag">
            <el-radio :label="0">web端</el-radio>
            <el-radio :label="1">客户端</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品图标：" prop="logo">
          <upload :uploadConfig="uploadConfig" @handleFileList="handleFileList"></upload>
          <em>仅限于JPG，PNG，大小2M以内</em>
        </el-form-item>
        <el-form-item label="显示风格：" prop="displayStyle">
          <el-select class="form-item" v-model="form.displayStyle" @change="change" filterable>
            <el-option v-for="item in styleList" :value="item.id" :label="item.name" :key="item.id">{{ item.name }}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产品状态：" prop="isEnabled">
          <el-radio v-model="form.isEnabled" :label="1">启用</el-radio>
          <el-radio v-model="form.isEnabled" :label="0">禁用</el-radio>
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input class="form-item" maxlength="500" show-word-limit v-model="form.description" type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" placeholder="请输入备注信息"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 40px">
          <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
          <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, Upload } from '@/components'
import { addProduct, editProduct, getProduct, updateProduct } from '@/api/productManage'
import { getStyle } from '@/api/dataDictionary'
export default {
  components: { AppMainHeader, Upload },
  data() {
    return {
      form: {
        appId: '',
        code: '',
        name: '',
        version: '',
        logo: '',
        displayStyle: '',
        displayStyleName: '风格一',
        isEnabled: 1,
        description: '',
        pdaFlag: 0
      },
      uploadConfig: {
        type: 'img', //上传类型
        filekey: '',
        fileType: 'jpg,png', //上传的文件类型
        limit: 2 //单位M
      },
      type: this.$route.name,
      dialogVisible: false,
      styleList: []
    }
  },
  computed: {
    title() {
      if (this.$route.name === 'Add') {
        return '添加产品'
      } else if (this.$route.name === 'Edit') {
        return '修改产品'
      } else if (this.$route.name === 'Update') {
        return '更新产品'
      }
    },
    rules() {
      let type = this.type
      return {
        name:
          type !== 'Update' ? [{ required: true, message: '请输入产品名称', trigger: 'blur' }] : [],
        version:
          type !== 'Edit' ? [{ required: true, message: '请输入版本号', trigger: 'blur' }] : []
      }
    }
  },
  created() {
    if (this.$route.name === 'Edit' || this.$route.name === 'Update') {
      this.getProduct()
    }
    this.getStyle()
  },
  methods: {
    getStyle() {
      getStyle().then((res) => {
        this.styleList = res.data
      })
    },
    async getProduct() {
      const { code, data, msg } = await getProduct({ id: this.$route.query.id })
      if (code === '200') {
        this.form = {
          appId: data.appId,
          code: data.code,
          name: data.name,
          description: data.description,
          version: data.version,
          logo: data.logo,
          origUrl: data.origUrl,
          displayStyle: data.displayStyle,
          isEnabled: data.isEnabled,
          pdaFlag: data.pdaFlag
        }
        this.uploadConfig.filekey = data.logo
      }
    },
    handleFileList(file) {
      this.$set(this.form, 'logo', file.filekey)
      this.$set(this.form, 'logoUrl', file.origUrl)
    },
    change(e) {
      this.form.displayStyleName = this.styleList.filter((item) => item.id == e)[0].name
    },
    confirm() {
      this.$refs.form.validate(async (validate) => {
        if (validate) {
          if (this.$route.name === 'Add') {
            const { code, data, msg } = await addProduct({
              ...this.form,
              id: this.$route.query.id
            })
            this.handleResult('Add', code, msg)
          } else if (this.$route.name === 'Edit') {
            const { code, data, msg } = await editProduct({
              ...this.form,
              id: this.$route.query.id
            })
            this.handleResult('Edit', code, msg)
          } else if (this.$route.name === 'Update') {
            const { code, data, msg } = await updateProduct({
              ...this.form,
              id: this.$route.query.id,
              appId: this.$route.query.id
            })
            this.handleResult('Update', code, msg)
          }
        }
      })
    },
    handleResult(type, code, msg) {
      if (code !== '200') {
        return this.$message.error(msg)
      }
      if (type === 'Add') {
        this.$message.success('添加产品成功')
      } else if (type === 'Edit') {
        this.$message.success('修改产品成功')
      } else if (type === 'Update') {
        this.$message.success('更新产品成功')
      }
      this.$router.push('/productManagement/table')
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang='scss'>
.product_icon {
  display: inline-block;
  margin-right: 10px;
  .el-upload {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    em {
      display: inline-block;
    }
  }
}
</style>
<style lang="scss" scoped>
.form-box {
  margin-top: 40px;
  & .el-input,
  .el-textarea {
    width: 50%;
  }
  .tips {
    margin-left: 6px;
    font-size: 16px;
    color: #00a4ff;
    transition: 0.3s;
    &:hover {
      font-size: 18px;
      color: #0193e2;
    }
  }
  .form-item {
    width: 40%;
  }
}
</style>
