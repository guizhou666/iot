<template>
  <div class="app-content-wrap">
    <AppMainHeader title="公告详情" :hasBackBtn="true"></AppMainHeader>
    <div class="content">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题：" prop="title">
          <span>{{'关于XXXXXXXX的通知'}}</span>
        </el-form-item>
        <el-form-item label="附件：">
          <app-ufast-upload
            ref="file"
            :uploadConfig="$data._uploadConfig"
            @handleFileList="handleFileList"
          ></app-ufast-upload>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <quill-editor
            v-model.trim="ruleForm.content"
            ref="myQuillEditor"
            @change="onEditorChange($event)"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="消息类型：" prop="messageType">
          <el-radio v-model="ruleForm.messageType" label="1" disabled>通知公告</el-radio>
          <el-radio v-model="ruleForm.messageType" label="2" disabled>系统通知</el-radio>
        </el-form-item>
        <el-form-item label="发送对象：" prop="sendObj">
          <span>{{'平台，XX租户A，XX租户-XX机构，张三，李四，王五'}}</span>
        </el-form-item>
        <el-form-item label="发送渠道：" prop="sendChannel">
          <el-checkbox-group v-model="ruleForm.sendChannel">
            <el-checkbox label="系统" disabled></el-checkbox>
            <el-checkbox label="邮件" disabled></el-checkbox>
            <el-checkbox label="短信" disabled></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="发送方式：" prop="sendMethod">
          <el-radio v-model="ruleForm.sendMethod" label="1" disabled>立即发送</el-radio>
          <el-radio v-model="ruleForm.sendMethod" label="2" disabled>定时发送</el-radio>
        </el-form-item>
        <el-form-item label="发送状态：" prop="sendState">
          <span>{{'草稿'}}</span>
        </el-form-item>
      </el-form>
    </div>
    
  </div>
</template>

<script>
import { AppMainHeader } from "@/components";
export default {
  components: {
    AppMainHeader,
  },
  data() {
    return {
      ruleForm: {
          sendChannel:[]
      },
      title: "添加公告",
      _uploadConfig: {
        type: "filePin",
        address: "htsy-assets",
        filekey: "",
        showfilelist: true,
        showModal: false,
      },
    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {},
  mounted() {},
  methods: {
    _addDepartment() {},
    handleFileList() {},
    onEditorChange() {},
  },
};
</script>
<style lang="scss" scoped>
.app-content-wrap {
  .content {
    width: 70%;
    ::v-deep .el-radio__input.is-disabled + span.el-radio__label, ::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label{
        color: #000000;
    }
    
  }
}
</style>
