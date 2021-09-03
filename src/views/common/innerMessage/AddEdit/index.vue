<template>
  <div>
    <div class="app-content-wrap add-innerMessage">
      <AppMainHeader title="编辑站内信"></AppMainHeader>
      <el-row>
        <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
          <el-col :span="16">
            <el-form-item label="收件人：" prop="receive">
              <div class="receive-row">
                <el-input placeholder="请选择收件人" v-model.trim="form.receive" maxlength="50"></el-input>
                <el-button @click="selectUser" type="primary" icon="el-icon-plus"></el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="抄送人：" prop="copyto">
              <div class="copyto-row">
                <el-input placeholder="请选择抄送人" v-model.trim="form.copyto" maxlength="50">
                  <i class="el-icon-user" slot="prepend"></i>
                </el-input>
                <el-button @click="selectUser" type="primary" icon="el-icon-plus"></el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="标题：" prop="title">
              <el-input placeholder="请输入标题" v-model.trim="form.title" maxlength="11">
                <i class="el-icon-phone-outline" slot="prepend"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="附件：" prop="contactEmail">
              <i class="el-icon-iot-fujian"></i>
              <app-ufast-upload
                ref="file"
                :uploadConfig="$data._uploadConfig"
                @handleFileList="handleFileList"
              ></app-ufast-upload>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="内容：" prop="address">
              <quill-editor
                v-model.trim="form.content"
                ref="myQuillEditor"
                @change="onEditorChange($event)"
              ></quill-editor>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <el-row :span="24" type="flex" justify="center">
        <el-col :span="2">
          <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-refresh-left" @click="cancel">保存</el-button>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </div>
    <select-user ref="selectUser"></select-user>
  </div>
</template>

<script>
import { AppMainHeader, SelectUser } from '@/components'

export default {
  components: {
    AppMainHeader,
    SelectUser
  },
  data() {
    return {
      form: {},
      proxyIp: '',
      rules: {
        receive: [{ required: true, message: '请选择收件人', trigger: 'blur' }]
      },
      _uploadConfig: {
        type: 'filePin',
        address: 'htsy-assets',
        filekey: '',
        showfilelist: true,
        showModal: false
      }
    }
  },
  computed: {
    title() {
      return this.$route.name === 'Add' ? '添加租户' : '修改租户'
    }
  },
  created() {},
  methods: {
    handleFileList() {},
    selectUser() {
      this.$refs.selectUser.show()
    },
    confirm() {},

    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss">
.add-innerMessage {
  .receive-row,
  .copyto-row {
    display: flex;
    .el-button {
      margin-left: 10px;
    }
  }
}
</style>

