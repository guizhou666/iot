<template>
  <div class="addresource-wrapper">
    <div class="app-content-wrap">
      <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
        <template v-if="shwoResource">
          <el-form-item label="资源类型：">
            <el-radio-group v-model="form.type" @change="changeType">
              <el-radio-button v-if="showResourceType(1)" :label="1">目录</el-radio-button>
              <el-radio-button v-if="showResourceType(2)" :label="2">菜单</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.type === 1">
            <el-form-item label="目录编码：" prop="code">
              <template v-if="this.$route.name === 'Add'">
                <el-input
                  class="form-item"
                  placeholder="请输入目录编码"
                  v-model.trim="form.code"
                  maxlength="20"
                >
                  <el-tooltip
                    slot="suffix"
                    class="input_tip"
                    content="不填写目录编码，则系统自动生成"
                    placement="top"
                  >
                    <i class="el-icon-warning tips"></i>
                  </el-tooltip>
                </el-input>
              </template>
              <template v-else>
                <span>{{ form.code }}</span>
              </template>
            </el-form-item>
            <el-form-item label="目录名称：" prop="name">
              <el-input
                class="form-item"
                v-model.trim="form.name"
                placeholder="请输入目录名称"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="图标：" prop="icon">
              <el-input class="form-item" v-model="form.icon" style="display: none"></el-input>
              <icon-select
                class="form-item"
                :icon="form.icon"
                @change="(val) => (form.icon = val)"
              ></icon-select>
            </el-form-item>
          </template>
          <template v-if="form.type === 2">
            <el-form-item label="菜单编码：" prop="code">
              <template v-if="this.$route.name === 'Add'">
                <el-input
                  class="form-item"
                  placeholder="请输入菜单编码"
                  v-model.trim="form.code"
                  maxlength="20"
                >
                  <el-tooltip
                    slot="suffix"
                    class="input_tip"
                    content="不填写菜单编码，则系统自动生成"
                    placement="top"
                  >
                    <i class="el-icon-warning tips"></i>
                  </el-tooltip>
                </el-input>
              </template>
              <template v-else>
                <span>{{ form.code }}</span>
              </template>
            </el-form-item>
            <el-form-item label="菜单名称：" prop="name">
              <el-input
                class="form-item"
                placeholder="请输入菜单名称"
                v-model.trim="form.name"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="图标：" prop="icon">
              <el-input class="form-item" v-model="form.icon" style="display: none"></el-input>
              <icon-select
                class="form-item"
                :icon="form.icon"
                @change="(val) => (form.icon = val)"
              ></icon-select>
            </el-form-item>
            <el-form-item label="菜单路径：" prop="url">
              <el-input
                class="form-item"
                placeholder="请输入菜单路径"
                v-model.trim="form.url"
                maxlength="50"
              >
                <i class="el-icon-link" slot="prepend"></i>
              </el-input>
            </el-form-item>
          </template>
        </template>
        <template v-else>
          <el-form-item label="按钮编码：" prop="code">
            <template v-if="this.$route.name === 'Add'">
              <el-input
                class="form-item"
                placeholder="请输入按钮编码"
                v-model.trim="form.code"
                maxlength="20"
              >
                <el-tooltip slot="suffix" content="不填写按钮编码，则系统自动生成" placement="top">
                  <i class="el-icon-warning tips"></i>
                </el-tooltip>
              </el-input>
            </template>
            <template v-else>
              <span>{{ form.code }}</span>
            </template>
          </el-form-item>
          <el-form-item label="按钮名称：" prop="name">
            <el-input
              v-if="$route.name == 'Add'"
              class="form-item"
              placeholder="请输入按钮名称"
              v-model.trim="form.name"
              maxlength="50"
            ></el-input>
            <span v-else>{{ form.name }}</span>
          </el-form-item>
        </template>

        <el-form-item label="APPID：" prop="appId">
          <el-input placeholder="请输入APPID" v-model.trim="form.appId" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="description">
          <el-input
            maxlength="500"
            show-word-limit
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 6 }"
            placeholder="请输入备注信息"
            v-model="form.description"
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
import { AppMainHeader, IconSelect } from '@/components'
import { addResource, editResource, getResource } from '@/api/resourceManage'
export default {
  components: { AppMainHeader, IconSelect },
  data() {
    return {
      form: {
        type: 1,
        code: '',
        name: '',
        icon: '',
        url: '',
        appId: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入菜单路径', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      let str1 = this.$route.name === 'Add' ? '添加' : '修改'
      let str2 = this.type === 3 ? '按钮' : '资源'
      let title = str1 + str2
      this.$route.meta.title = title
      return title
    },
    type() {
      if (this.$route.name === 'Add') {
        return this.$route.query.type === 2 ? 3 : 1
      } else {
        return this.$route.query.type
      }
    },
    shwoResource() {
      if (this.$route.name === 'Add' && this.type == 1) {
        return true
      }
      if (this.$route.name === 'Edit' && this.type !== 3) {
        return true
      }
      return false
    }
  },
  created() {
    if (this.$route.name === 'Add') {
      this.form.type = this.$route.query.type === 2 ? 3 : 1
      this.form.appId = this.$route.query.appId
    }
    if (this.$route.name === 'Edit') {
      this.form.type = this.$route.query.type === 2 ? 3 : 1
      this.getResource()
    }
  },
  methods: {
    showResourceType(type) {
      return this.$route.name === 'Add' || this.$route.query.type === type
    },
    changeType() {
      // this.form = {
      //   ...this.form,
      //   ...{
      //     code: '',
      //     name: '',
      //     icon: '',
      //     url: '',
      //     appId: '',
      //     description: ''
      //   }
      // }
    },
    async getResource() {
      const { code, data, msg } = await getResource({ id: this.$route.query.id })
      if (code === '200') {
        this.form = {
          type: data.type,
          code: data.code,
          name: data.name,
          icon: data.icon,
          url: data.url,
          appId: data.appId,
          description: data.description,
          parentId: data.parentId
        }
      }
    },
    confirm() {
      this.$refs.form.validate(async (validate) => {
        if (validate) {
          if (this.$route.name === 'Add') {
            const { code, data, msg } = await addResource(
              Object.assign(this.form, {
                parentId: this.$route.query.id || -1
              })
            )
            this.handleResult('Add', code, msg)
          } else {
            const { code, data, msg } = await editResource(this.form, this.$route.query.id)
            this.handleResult('Edit', code, msg)
          }
        }
      })
    },
    handleResult(type, code, msg) {
      if (code !== '200') {
        return this.$message.error(msg)
      }
      if (type === 'Add') {
        this.$message.success('添加资源成功')
        this.$router.push('/resourceManagement/table')
      } else {
        this.$message.success('修改资源成功')
        this.$router.push('/resourceManagement/table')
      }
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.addresource-wrapper {
  .form-box {
    margin-top: 40px;
    & .el-input,
    .el-textarea {
      width: 40%;
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
    // .form-item {
    //   width: 70%;
    // }
  }
}
</style>
