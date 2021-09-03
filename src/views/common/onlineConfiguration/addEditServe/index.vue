<template>
  <el-dialog
    class="dataBase__wrap"
    :title="$route.name == 'Edit' ? '编辑微服务' : '生成微服务'"
    :visible.sync="visible"
    width="70%"
  >
    <el-form :model="form" :rule="rules" label-width="100px" :inline="true">
      <el-form-item label="代码生成目录">
        <el-input class="dataBase__formitem--catalog" size="small" v-model="form.catalog">
          <el-button slot="suffix" type="primary">浏览</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="微服务名称">
        <el-input size="small" v-model="form.serviceName"></el-input>
      </el-form-item>
      <el-form-item label="包名">
        <el-input size="small" v-model="form.bagName"></el-input>
      </el-form-item>
      <el-form-item label="端口号">
        <el-input size="small" v-model="form.port"></el-input>
      </el-form-item>
    </el-form>

    <!-- 数据表 -->
    <el-tabs>
      <el-tab-pane label="数据表">
        <data-base></data-base>
      </el-tab-pane>
      <el-tab-pane label="支持项">
        <support-item></support-item>
      </el-tab-pane>
    </el-tabs>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DataBase from './DataBase.vue'
import supportItem from './supportItem.vue'
export default {
  components: { DataBase,supportItem },
  data() {
    return {
      visible: false,
      form: {
        catalog: '',
        serviceName: '',
        bagName: '',
        port: ''
      },
      rules: {
        catalog: [{ required: true, message: '请输入代码生成目录', trigger: 'blur' }]
      },
      microService: {}
    }
  },
  methods: {
    show(operation) {
      this.visible = true
    },
    cancle() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.dataBase__wrap{
  ::v-deep .el-dialog__body {
    padding: 40px;
  }
  .dataBase__formitem--catalog ::v-deep {
    .el-input__suffix {
      right: 0;
    }
  }
}
</style>>
