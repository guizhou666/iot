<template>
  <div>
    <div class="app-content-wrap addTemplate">
      <el-form :model="form" label-width="180px" :rules="rules" ref="form">
        <el-form-item label="模板类型：" prop="name">
          <el-radio-group v-model="form.type">
            <el-radio v-for="item in templateType" :key="item.key" :label="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="模板编码：" prop="code">
          <template v-if="type==='Add'">
            <el-input v-model="form.code" placeholder="请输入模板编码" maxlength="20">
              <el-tooltip slot="suffix" content="不填写模板编码，则系统自动生成" placement="top">
                <i class="el-icon-warning tips"></i>
              </el-tooltip>
            </el-input>
          </template>
          <span v-else>{{ form.code }}</span>
        </el-form-item>
        <el-form-item label="模板名称：" prop="name">
          <el-input v-model="form.name" placeholder="请输入模板名称" maxlength="50"></el-input>
        </el-form-item>

        <el-form-item label="内容：" prop="address">
          <quill-editor v-model="form.content" ref="myQuillEditor" @change="onEditorChange($event)"></quill-editor>
        </el-form-item>

        <el-form-item label="备注：" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :autosize="{ minRows: 6,maxRows:6 }"
            placeholder="请输入备注信息"
            maxlength="500"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="消息类型：" prop="name">
          <el-radio-group v-model="form.messageType">
            <el-radio v-for="item in messageType" :key="item.key" :label="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
          <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import { addRole, editRole, getRole } from '@/api/roleManage'
export default {
  components: { AppMainHeader },
  data() {
    return {
      form: {
        type: 'common',
        code: '',
        name: '',
        content: '',
        description: '',
        messageType: 'notify'
      },
      templateType: [
        {
          label: '通用',
          key: 'common'
        },
        {
          label: '系统',
          key: 'system'
        },
        {
          label: '邮件',
          key: 'email'
        },
        {
          label: '短信',
          key: 'message'
        }
      ],
      messageType: [
        {
          label: '通知公告',
          key: 'notify'
        },
        {
          label: '系统通知',
          key: 'system'
        },
        {
          label: '任务跟催',
          key: 'task'
        },
        {
          label: '代办事项',
          key: 'agent'
        },
        {
          label: '其他',
          key: 'other'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }]
      },
      type: this.$route.name
    }
  },
  computed: {
    title() {
      return this.$route.name === 'Add' ? '添加模板' : '修改模板'
    }
  },
  created() {
    if (this.$route.name === 'Edit') {
      this.getRole()
    }
  },
  mounted() {},
  methods: {
    async getRole() {
      const { code, data, msg } = await getRole({ id: this.$route.query.id })
      if (code === '200') {
        this.form = {
          code: data.code,
          name: data.name,
          description: data.description
        }
      }
    },
    confirm() {
      this.$refs.form.validate(async validate => {
        if (validate) {
          let params = Object.assign(this.form, {
            id: this.$route.query.id
          })
          if (this.$route.name === 'Add') {
            const { code, data, message } = await addRole(params)
            this.responseHandler(code, data, message).then(res => {
              this.$router.push('/roleManagement/table')
            })
          } else {
            const { code, data, message } = await editRole(params)
            this.responseHandler(code, data, message).then(res => {
              this.$router.push('/roleManagement/table')
            })
          }
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.addTemplate {
  .el-form {
    width: 90%;
  }
}
</style>
