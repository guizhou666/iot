<template>
  <div class="add-department app-content-wrap">
    <AppMainHeader :title="title"></AppMainHeader>
    <div class="content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="上级部门：">
          <span>{{ ruleForm.parentName }}</span>
        </el-form-item>
        <el-form-item label="部门编码：">
          <el-input
            class="win200"
            v-model="ruleForm.code"
            placeholder="请输入部门编码"
            maxlength="20"
            :disabled='getSendData.type == "edit"'
          >
          <el-tooltip slot="suffix" content="不填写部门编码，则系统自动生成" placement="top">
              <i class="el-icon-warning tips"></i>
            </el-tooltip>
          </el-input>
        </el-form-item>
        <el-form-item label="部门名称：" prop="name">
          <el-input
            class="win200"
            v-model="ruleForm.name"
            placeholder="请输入部门名称"
            maxlength="50"
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
      </el-form>
    </div>
    <div class="fotter-bottom">
      <el-button icon="el-icon-finished" type="primary" @click="_addDepartment()">确定</el-button>
      <el-button
        icon="el-icon-refresh-left"
        plain
        @click="
          () => {
            this.$router.back();
          }
        "
        >取消</el-button
      >
    </div>
  </div>
</template>

<script>
import { AppMainHeader } from "@/components";
import { addDepartment,editDepartment } from "@/api/postManage";

export default {
  components: {
    AppMainHeader,
  },
  data() {
    return {
      title:'添加部门',
      ruleForm: {
          parentName:'',
          code:'',
          name:'',
          description:'',
      },
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
      },
      getSendData: {},
    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {
    if (this.$route.query.data) {
      this.getSendData = JSON.parse(this.$route.query.data);
      this.ruleForm.parentName = this.getSendData.data?.parentNames;
      this.ruleForm.parentId = this.getSendData.data?.parentId;
      if(this.getSendData.type == 'edit') {
          this.title = '修改部门';
          const {name,code,description} = {...this.getSendData.data};
          this.ruleForm.name = name;
          this.ruleForm.code = code;
          this.ruleForm.description = description;
      } else if(this.getSendData.type == 'addChild') {
          if(this.getSendData.data?.parentNames) {
              this.ruleForm.parentName = this.getSendData.data?.parentNames + '>' +this.getSendData.data.name
          } else {
              this.ruleForm.parentName = this.getSendData.data.name
          } 
      }
    }
  },
  mounted() {},
  methods: {
    // 添加/修改部门
    _addDepartment() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const params = {
            code: this.ruleForm.code,
            name: this.ruleForm.name,
            description: this.ruleForm.description,
            parentId:this.ruleForm.parentId
          };
          if (this.getSendData.type && this.getSendData.type !== "edit") {
            const type = this.getSendData.type;
            params.parentId = '-1';
            // 添加子级
            if (type === "addChild") {
              params.parentId = this.getSendData.data.id;
            } else if (type === "equative") {
              // 添加同级
              if(this.getSendData.data.parentId) {
                  params.parentId = this.getSendData.data.parentId;
              }
            }
            const { code, data, msg } = await addDepartment(params);
            this.message("add", code, msg);
          } else {
              // 修改部门
            params.id = this.getSendData.data.id
            const { code, data, msg } = await editDepartment(params);
            this.message("edit", code, msg);
          }
        }
      });
    },
    // 提示语
    message(type, code, msg) {
        if(code != 200) {
            return;
        }
        this.$message({
          type:code == 200 ? 'success' : 'error' ,
          message: code == 200 ? type == 'add' ? "添加成功" : '修改成功' : msg,
          duration: 1000,
        });
      if(code == 200) {
          this.$router.back();
      }
    },
  },
};
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
