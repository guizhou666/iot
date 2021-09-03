<template>
  <div>
    <div class="app-content-wrap">
      <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
        <el-form-item label="角色编码：" prop="code">
          <template v-if="type==='Add'">
            <el-input v-model.trim="form.code" placeholder="请输入角色编码" maxlength="20">
              <el-tooltip slot="suffix" content="不填写角色编码，则系统自动生成" placement="top">
                <i class="el-icon-warning tips"></i>
              </el-tooltip>
            </el-input>
          </template>
          <span v-else>{{ form.code }}</span>
        </el-form-item>
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入角色名称" maxlength="50"></el-input>
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
        code: '',
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      type: this.$route.name
    }
  },
  computed: {
    title() {
      return this.$route.name === 'Add' ? '添加角色' : '修改角色'
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
.form-box {
  .form-item {
    width: 40%;
  }
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
}
</style>
