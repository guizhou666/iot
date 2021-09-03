<template>
  <el-form label-width="180px">
    <el-row>
      <el-col :span="12">
        <el-form-item label="发件人：">
          <span>{{ content.receive | isNull }}</span>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="发送时间：">
          <span>{{ content.time }}</span>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="抄送人：" prop="code">
          <span>{{ content.copyto | isNull }}</span>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="标题：" prop="name">
          <span>{{ content.title | isNull }}</span>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="附件：" prop="appId">
          <span>{{content.file | isNull}}</span>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="内容：" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 6 }"
            placeholder="请输入备注信息"
            maxlength="500"
            show-word-limit
            v-model.trim="content.content"
          ></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    content: {
      type: Object,
      default: {}
    }
  }
}
</script>

