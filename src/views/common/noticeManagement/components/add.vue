<template>
  <div class="app-content-wrap">
    <AppMainHeader :title="title"></AppMainHeader>
    <div class="content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
      >
        <el-form-item label="标题：" prop="title">
          <el-input
            class="win200"
            v-model.trim="ruleForm.title"
            placeholder="请输入标题"
            maxlength="20"
          >
          </el-input>
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
          <el-radio v-model="ruleForm.messageType" label="1">备选项</el-radio>
          <el-radio v-model="ruleForm.messageType" label="2">备选项</el-radio>
        </el-form-item>
        <el-form-item label="发送对象：" prop="sendObj">
          <div class="send-obj" style="display: flex">
            <el-input class="win200" v-model="ruleForm.sendObj" maxlength="20"> </el-input>
            <el-button icon="el-icon-plus" style="margin-left: 20px">默认按钮</el-button>
          </div>
        </el-form-item>
        <el-form-item label="发送渠道：" prop="sendChannel">
          <el-checkbox-group v-model="ruleForm.sendChannel">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
            <el-checkbox label="复选框 C"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="发送方式：" prop="sendMethod">
          <el-radio v-model="ruleForm.sendMethod" label="1">备选项</el-radio>
          <el-radio v-model="ruleForm.sendMethod" label="2">备选项</el-radio>
        </el-form-item>
      </el-form>
      <div class="fotter-bottom" style="text-align: center">
          <el-button icon="el-icon-finished" type="primary" @click="_addDepartment()"
        >发送</el-button
      >
      <el-button icon="el-icon-finished" @click="_addDepartment()"
        >保存</el-button
      >
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
    
  </div>
</template>

<script>
import { AppMainHeader } from "@/components";
export default {
  components: {
    AppMainHeader
  },
  data() {
    return {
      ruleForm: {
          sendChannel:[]
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: ["blur", "change"] }],
        content: [{ required: true, message: "请输入标题", trigger: ["blur", "change"] }],
        sendObj: [{ required: true, message: "请输入标题", trigger: ["blur", "change"] }],
        messageType: [{ required: true, message: "请输入标题", trigger: ["blur", "change"] }],
        sendChannel: [{ required: true, message: "请输入标题", trigger: ["blur", "change"] }],
        sendMethod: [{ required: true, message: "请输入标题", trigger: ["blur", "change"] }],
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
  }
}
</style>
