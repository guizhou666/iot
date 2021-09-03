<template>
  <div class="app-content-wrap">
    <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
      <el-form-item label="参数编码：" prop="code">
        <template v-if="type==='Add'">
          <el-input v-model.trim="form.code" placeholder="请输入参数编码" maxlength="20">
            <el-tooltip slot="suffix" content="不填写，则系统自动生成" placement="top">
              <i class="el-icon-warning tips"></i>
            </el-tooltip>
          </el-input>
        </template>
        <span v-else>{{ form.code }}</span>
      </el-form-item>
      <el-form-item label="参数名称：" prop="name">
        <el-input v-model.trim="form.name" placeholder="请输入参数名称" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="值：" prop="value">
        <el-input v-model.trim="form.value" placeholder="请输入值" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="description">
        <el-input
          v-model.trim="form.description"
          type="textarea"
          :autosize="{ minRows: 6,maxRows:6 }"
          placeholder="请输入备注信息"
          maxlength="500"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="内置标识：" prop="isInner">
        <el-checkbox v-model="form.isInner" :true-label="1" :false-label="0"></el-checkbox>
        <!-- <el-switch v-model="form.isInner" :active-value="1" :inactive-value="0"></el-switch> -->
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
        <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import { getParameterDetail, addParameter, editParameter } from '@/api/parameter'
export default {
  components: { AppMainHeader },
  data() {
    return {
      form: {
        code: '',
        name: '',
        value: '',
        description: '',
        isInner: 0
      },
      rules: {
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
        value: [{ required: true, message: '请输入值', trigger: 'blur' }]
      },
      type: this.$route.name
    }
  },
  computed: {
    title() {
      return this.$route.name === 'Add' ? '添加参数' : '修改参数'
    }
  },
  created() {
    if (this.$route.name === 'Edit') {
      this.getParameterDetail()
    }
  },
  mounted() {},
  methods: {
    async getParameterDetail() {
      const { code, data, message } = await getParameterDetail({ id: this.$route.query.id })
      if (code === '200') {
        this.form = data
      }
    },
    confirm() {
      this.$refs.form.validate(async validate => {
        if (validate) {
          let params = Object.assign(this.form, {
            id: this.$route.query.id
          })
          if (this.$route.name === 'Add') {
            const { code, data, message } = await addParameter(params)
            this.responseHandler(code, data, message).then(res => {
              this.$router.push('/parameter/table')
            })
          } else {
            const { code, data, message } = await editParameter(params)
            this.responseHandler(code, data, message).then(res => {
              this.$router.push('/parameter/table')
            })
          }
        }
      })
    },
    cancel() {
      this.$router.push('/parameter/table')
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
