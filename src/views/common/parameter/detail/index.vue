<template>
  <div class="addPersonal">
    <div class="app-content-wrap">
      <AppMainHeader title="查看参数详情" hasBackBtn></AppMainHeader>

      <el-form class="form" ref="form" :model="form" label-width="240px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数编码：">
              <span>{{ form.code | isNull }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参数名称：" prop="name">
              <span>{{ form.name | isNull }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="值：" prop="papers">
              <span>{{ form.value | isNull}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：">
              <span class="breakall">{{ form.description | isNull }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="内容标识：">
              <span>{{ form.isInner ? '是' : '否' | isNull }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { AppMainHeader } from '@/components'
import { getParameterDetail } from '@/api/parameter'

export default {
  data() {
    return {
      form: {
        code: '',
        name: '',
        value: '',
        description: '',
        isInner: ''
      }
    }
  },
  components: {
    AppMainHeader
  },
  created() {
    this.getParameterDetail()
  },
  methods: {
    async getParameterDetail() {
      const { code, data, msg } = await getParameterDetail({
        id: this.$route.query.id
      })
      if (code === '200') {
        Object.assign(this.form, data)
      }
    }
  }
}
</script>
<style lang="scss">
.form {
  margin-top: 40px;
}
</style>