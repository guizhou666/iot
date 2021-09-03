<template>
  <div class="add-post">
    <div class="app-content-wrap">
      <div class="content-box">
        <el-form ref="form" :model="ruleForm" :rules="rules" label-width="100px">
          <el-form-item label="岗位编码：">
            <el-input
              v-model="ruleForm.code"
              class="wid200"
              maxlength="20"
              placeholder="请输入岗位编码"
              :disabled="$route.query.type === 'edit'"
            >
              <el-tooltip v-if="$route.query.type !== 'edit'" slot="suffix" content="不填写岗位编码，则系统自动生成" placement="top">
                <i class="el-icon-warning tips"></i>
              </el-tooltip>
            </el-input>
          </el-form-item>
          <el-form-item label="岗位名称：" prop="name">
            <el-input v-model="ruleForm.name" class="wid200" placeholder="请输入岗位名称" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="所属部门：">
            <el-cascader
              popper-class="cascader-department"
              filterable
              class="wid200"
              v-model="deptId"
              :options="options"
              :props="defaultProps"
              placeholder="请选择"
              clearable
            >
              <template slot-scope="{ node }">
                <span :title="node.label">{{ node.label }}</span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item label="岗位职责：" prop="duty">
            <el-input
              type="textarea"
              v-model="ruleForm.duty"
              class="wid200"
              placeholder="请输入岗位职责"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="description">
            <el-input
              placeholder="请输入备注信息"
              type="textarea"
              v-model="ruleForm.description"
              class="wid200"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="fotter-bottom">
        <el-button icon="el-icon-finished" type="primary" @click="confirmAddPost()">确定</el-button>
        <el-button icon="el-icon-refresh-left" plain @click="cancel()">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import { addPost, getDepartmentTree, editPost } from '@/api/postManage'
import { clearEmptyChild } from '@/utils'
export default {
  components: {
    AppMainHeader
  },
  data() {
    return {
      title: '添加岗位',
      options: [],
      deptId: [],
      ruleForm: {
        code: '',
        deptId: [],
        duty: '',
        name: '',
        description: ''
      },
      defaultProps: {
        children: 'childList',
        label: 'name',
        checkStrictly: true,
        value: 'id'
      },
      rules: {
        name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {
    this._getDepartmentTree();
    this.deptId = this.$route.query.deptId ? this.$route.query.deptId.reverse() : [];
    if (this.$route.query.type === "edit") {
      const getData = JSON.parse(this.$route.query.data);
      delete getData.createTime;
      this.ruleForm = getData;
      this.deptId = getData.deptId;
      this.title = "修改岗位";
    }
  },
  mounted() {},
  methods: {
    cancel() {
      this.$router.back()
    },
    // 添加岗位
    async confirmAddPost() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const type = this.$route.query.type
          if (type === 'add') {
            this.ruleForm.deptId = this.deptId[this.deptId.length - 1]
            const { code, data, msg } = await addPost(this.ruleForm)
            if (code == 200) {
              this.$message.success('添加成功')
              this.$router.back()
            } else {
              //   this.$message.error(msg);
            }
          } else {
            this.ruleForm.deptId =
              typeof this.deptId == 'object' ? this.deptId[this.deptId.length - 1] : this.deptId
            delete this.ruleForm.deptCode
            const { code, data, msg } = await editPost(this.ruleForm)
            if (code == 200) {
              this.$message.success('修改成功')
              this.$router.back()
            } else {
              //   this.$message.error(msg);
            }
          }
        }
      })
    },
    // 获取部门树
    async _getDepartmentTree() {
      const { code, data, msg } = await getDepartmentTree()
      if (code === '200') {
        this.options = data
        this.options = clearEmptyChild(data,'childList')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-post {
  .content-box {
    padding: 40px 70px;
    .wid200 {
      width: 40%;
    }
    .wid800 {
      width: 800px;
    }
  }
  .fotter-bottom {
    text-align: center;
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
  ::v-deep .el-textarea__inner {
      max-height: 200px;
  }
}
</style>
