<template>
  <div class="innerMessage_detail app-content-wrap">
    <AppMainHeader title="站内信详情" :hasBackBtn="true"></AppMainHeader>
    <el-form label-width="180px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="发件人：">
            <span>{{ form.receive | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="发送时间：">
            <span>{{ form.time }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="抄送人：" prop="code">
            <span>{{ form.copyto | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="标题：" prop="name">
            <span>{{ form.title | isNull }}</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="附件：" prop="appId">
            <span>{{form.file | isNull}}</span>
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
              v-model="form.content"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="message in messageList" :key="message.id" :name="message.id">
        <template slot="title">
          <div class="header_text">
            <div class="receive">收件人：{{message.send}}</div>
            <div class="title" v-if="showMessageTitle(message.id)">标题：{{message.title}}</div>
            <div class="time">发送时间：{{message.time}}</div>
          </div>
        </template>
        <message-content :content="message.content"></message-content>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import MessageContent from './MessageContent'
export default {
  components: { AppMainHeader, MessageContent },
  data() {
    return {
      form: {
        receive: '张三',
        time: '2020-10-04',
        copyto: '李四',
        title: '这是一封最新的邮件，请查收',
        file: '',
        content: ''
      },
      activeNames: ['1'],
      messageList: [
        {
          id: '1',
          title: '标题一',
          send: '战三',
          time: '2020-10-14',
          content: {
            receive: '张三',
            time: '2020-10-04',
            copyto: '李四',
            title: '这是一封最新的邮件，请查收',
            file: '',
            content: ''
          }
        },
        {
          id: '2',
          title: '这是一封最新的邮件，请查收',
          send: '战三',
          time: '2020-10-14',
          content: {
            receive: '张三',
            time: '2020-10-04',
            copyto: '李四',
            title: '这是一封最新的邮件，请查收',
            file: '',
            content: ''
          }
        }
      ],
      expandIds: []
    }
  },
  computed: {
      showMessageTitle(id) {
          return ()=>{
              return !this.expandIds.includes(id)
          } 
      }
  },
  created() {},

  methods: {
    handleChange(val) {
      this.expandIds = val
    }
  }
}
</script>

<style lang="scss" scoped>
.innerMessage_detail {
  .el-collapse {
    .el-collapse-item {
      .el-collapse-item__header {
        .header_text {
          padding: 0 100px;
          width: 90%;
          display: flex;
          justify-content: space-around;
          font-size: 14px;
          .receive,
          .time {
            width: 20%;
          }
          .title {
            flex: 1;
          }
        }
      }
      .el-collapse-item__wrap {
        .el-collapse-item__content {
          padding: 0 100px;
        }
      }
    }
  }
}
</style>
