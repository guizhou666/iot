<template>
  <div class="add-department">
    <div class="app-content-wrap">
      <AppMainHeader :title="$route.meta.title"></AppMainHeader>
      <div class="content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="上级字典：">
            <span>{{ ruleForm.parentNames }}</span>
          </el-form-item>
          <el-form-item label="字典编码：">
            <el-input
              class="win200"
              v-model="ruleForm.code"
              placeholder="请输入字典编码"
              maxlength="20"
              :disabled="getSendData.type == 'edit'"
            >
              <el-tooltip v-if="$route.meta.title == '添加字典'" slot="suffix" content="不填写字典编码，则系统自动生成" placement="top">
                <i class="el-icon-warning tips"></i>
              </el-tooltip>
            </el-input>
          </el-form-item>
          <el-form-item label="字典名称：" prop="name">
            <el-input class="win200" v-model="ruleForm.name" placeholder="请输入字典名称" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="所属组：">
            <el-input
              class="win200"
              v-model="ruleForm.groupS"
              :placeholder=" (!!ruleForm.parentNames || getSendData.type == 'edit') ? '' : '请输入组名'"
              maxlength="50"
              :disabled="!!ruleForm.parentNames || getSendData.type == 'edit'"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              class="win200"
              type="textarea"
              v-model="ruleForm.description"
              placeholder="请输入备注信息"
              maxlength="500"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="内置标识：">
            <el-checkbox v-model="ruleForm.isInner"></el-checkbox>
          </el-form-item>
        </el-form>
      </div>
      <div class="fotter-bottom">
        <el-button icon="el-icon-finished" type="primary" @click="_addDataDictionary()">确定</el-button>
        <el-button
          icon="el-icon-refresh"
          plain
          @click="
          () => {
            this.$router.back();
          }
        "
        >取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import { addDictionary, getDetail, changeData } from '@/api/dataDictionary'
export default {
  components: {
    AppMainHeader
  },
  data() {
    return {
      ruleForm: {
        parentNames: '',
        code: '',
        name: '',
        groupS: '',
        description: '',
        isInner: false,
        // type: '',
        parentId: '-1'
      },
      rules: {
        name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }]
      },
      getSendData: {},
      id: '', // 传递过来的id
      detailData: {}
    }
  },
  //监控data中的数据变化
  watch: {
    detailData(res) {
      if (res) {
        const type = this.getSendData.type
        if (type == 'equative') {
          this.ruleForm.parentNames = res.parentNames
          if (this.ruleForm.parentNames) {
            this.ruleForm.groupS = res.groupS
          }
        } else if (type == 'edit') {
          this.ruleForm = res
          this.ruleForm.isInner = res.isInner ? true : false
        } else if (type == 'addChild') {
          if (res.parentNames) {
            this.ruleForm.parentNames = res.parentNames + '>' + res.name
          } else {
            this.ruleForm.parentNames = res.name
          }
          this.ruleForm.groupS = res.groupS
        }
      }
    }
  },
  created() {
    if (this.$route.query.data) {
      this.getSendData = JSON.parse(this.$route.query.data)
      this.id = this.getSendData.id || ''
      if (this.getSendData.type == 'edit') {
        this.title = '修改数据字典'
      }
      if (this.id) {
        this._getDetail(this.id)
      }
    }
  },
  mounted() {},
  methods: {
    // 添加/修改部门
    _addDataDictionary() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const params = {
            ...this.ruleForm
          }
          params.isInner = params.isInner ? 1 : 0
          if (this.getSendData.type && this.getSendData.type !== 'edit') {
            const type = this.getSendData.type
            // 添加子级
            if (type === 'addChild') {
              params.parentId = this.detailData.id
            } else if (type === 'equative') {
              // 添加同级
              params.parentId = this.detailData.parentId
            }
            const { code, data, msg } = await addDictionary(params)
            this.message('add', code, msg)
          } else {
            // 修改部门
            params.id = this.detailData.id
            const { code, data, msg } = await changeData(params)
            this.message('edit', code, msg)
          }
        }
      })
    },
    // 字典详情
    async _getDetail(id) {
      const params = {
        id: id
      }
      const { code, data, msg } = await getDetail(params)
      if (code == 200) {
        this.detailData = data
      } else {
        // this.$message.error(msg);
      }
    },
    // 提示语
    message(type, code, msg) {
      if (code != 200) {
        return
      }
      this.$message({
        type: code == 200 ? 'success' : 'error',
        message: code == 200 ? (type == 'add' ? '添加成功' : '修改成功') : msg,
        duration: 1000
      })
      if (code == 200) {
        this.$router.back()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-department {
  .content {
    span.tip {
      margin-left: 20px;
    }
    padding: 20px 70px;
    .win200 {
      width: 40%;
    }
    .win500 {
      width: 500px;
    }
    .el-form-item {
      margin-bottom: 60px;
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
  .fotter-bottom {
    text-align: center;
  }
}
</style>
