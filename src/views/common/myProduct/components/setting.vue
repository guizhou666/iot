<template>
  <div class="main">
    <div class="app-content-wrap">
      <div class="setting-input">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="系统显示名称:" prop="realName">
            <el-input v-model.trim="ruleForm.realName" maxlength="50" />
          </el-form-item>
          <el-form-item label="系统显示LOGO:" prop="logo">
            <upload  :uploadConfig="uploadConfig" @handleFileList="handleFileList"></upload>
          </el-form-item>
          <el-form-item label="显示风格:" prop="displayStyle">
            <el-select v-model="ruleForm.displayStyle" placeholder="请选择" @change="change">
              <el-option
                v-for="item in styleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="fotter-bottom">
        <el-button type="primary" @click="confirm()">确定</el-button>
        <el-button
          plain
          @click="
            () => {
              this.$router.back()
            }
          "
        >取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { AppMainHeader,Upload } from '@/components'
import { getProduct, updateProduct, batchChangeLogoOrStyle } from '@/api/productManage'
import { getStyle } from '@/api/dataDictionary'
export default {
    components: {
        AppMainHeader,
        Upload
    },
    data() {
        return {
            _uploadConfig: {
                type: 'img',
                address: 'htsy-assets',
                filekey: ''
            },
            ruleForm: {
                realName: '',
                displayStyle: '',
                displayStyleName: ''
            },
            styleList: [],
            value: '',
            rules: {
                realName: [{ required: true, message: '请输入系统显示名称', trigger: 'blur' }],
                displayStyle: [{ required: true, message: '请选择系统显示风格', trigger: 'change' }]
            },
            uploadConfig: {
              type: 'img', //上传类型
              filekey: '',
              fileType: 'jpg,png', //上传的文件类型
              limit: 2 //单位M
            },
        }
    },

    // 监控data中的数据变化
    created() {
        if (this.$route.query.id) {
            this._getDetail()
        }
        this.getStyle()
    },
    methods: {
        getStyle() {
            getStyle().then(res => {
                this.styleList = res.data
            })
        },
        change(e) {
            this.ruleForm.displayStyleName = this.styleList.filter(item => item.id == e)[0].name
        },
        handleFileList() {},
        // 获取详情
        async _getDetail() {
            const params = {
                id: this.$route.query.id
            }
            const { code, data, msg } = await getProduct(params)
            if (code === '200') {
                this.ruleForm.realName = data.realName
                this.ruleForm.displayStyle = data.displayStyle
                this.uploadConfig.filekey = data.logo
            }
        },

        handleFileList(file) {
          this.ruleForm.logo = file.filekey
          this.ruleForm.logoUrl = file.origUrl
        },


        // 确定按钮
        confirm() {
            this.$refs.ruleForm.validate(async valid => {
                if (valid) {
                    const params = {
                        ids: [this.$route.query.id],
                        displayName: this.ruleForm.realName,
                        displayStyle: this.ruleForm.displayStyle,
                        displayStyleName: this.ruleForm.displayStyleName
                    }
                    const { code, data, msg } = await batchChangeLogoOrStyle(params)
                    if (code === '200') {
                        this.$message.success('修改成功')
                        this.$router.back()
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.main {
  .setting-input {
    width: 40%;
    margin-top: 20px;
    padding-left: 70px;
    line-height: 20px;
  }
  .fotter-bottom {
    text-align: center;
    margin-top: 100px;
  }
}
</style>
