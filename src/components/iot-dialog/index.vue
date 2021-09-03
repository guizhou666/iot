<template>
  <div class="dialog-content">
    <el-dialog
      class="dialog"
      :visible.sync="$data._dialogConfig.showDialog"
      :width="$data._dialogConfig.dialogWidth + 'px'"
    >
      <div slot="title" class="dialogTitle">
        <h3 class="title-left">{{ $data._dialogConfig.title }}</h3>
      </div>
      <el-form
        ref="form"
        :model="$data._dialogConfig.model"
        label-width="100px"
        :rules="$data._dialogConfig.rules"
      >
        <template v-for="(_item, index) in $data._dialogConfig.formGroup">
          <el-form-item :label="_item.label" :prop="_item.filed" :key="index">
            <el-input
             maxlength="50"
              v-if="_item.type == 'input'"
              :style="{ width: _item.width }"
              v-model="$data._dialogConfig.model[_item.filed]"
            ></el-input>
            <template  v-if="_item.type == 'radio'">
                <el-radio v-for="(_radio,_index) in _item.waitChoose" :key="_index" v-model="$data._dialogConfig.model[_item.filed]" :label="_radio.label">{{_radio.content}}</el-radio>
            </template>
            <!-- 随机，自定义 -->
              <template v-if="_item.type == 'auto'">
                <slot :name="_item.filed"></slot>
              </template>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button icon="el-icon-finished" type="primary" @click="confirm()">确 定</el-button>
        <el-button icon="el-icon-refresh-left" @click="$data._dialogConfig.showDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deepCopy } from '@/utils'
export default {
  components: {},
  data() {
    return {
      _dialogConfig: {},
      form_field: {},
      ruleForm: {
        name: "",
      },
    };
  },
  computed: {},
  //监控data中的数据变化
  watch: {
    dialogConfig: {
      handler(newValue, oldValue) {
        this.$data._dialogConfig = newValue;
        this.$nextTick(() => {
          this.$refs.form?.clearValidate();
        });
      },
      deep: true,
    },
    'dialogConfig.showDialog'(res){
        if(!res) {
            // 关闭弹框清空值
            this.$data._dialogConfig.model = {};
        }
    }
  },
  props: {
    dialogConfig: {},
  },
  methods: {
    confirm() {
      this.$refs.form.validate((valid) => {
        valid && this.$emit('confirmBtn',this.$data._dialogConfig.model);
      });
    },
    // 关闭弹框
    closedDialog(){
    }
  },
  created() {
    this.$data._dialogConfig = this.dialogConfig;
    this.$nextTick(() => {
      this.$refs.form?.clearValidate();
    });
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.ialog-content {
}
.dialog {
  ::v-deep .el-dialog__header {
    padding: 0px !important;
    border-left: none;
  }
  .dialogTitle {
    .title-left {
      padding-left: 10px;
      border-left: 6px solid #00a4ff;
    }
    .title {
      font-size: 14px;
      font-weight: bolder;
    }
  }
}
</style>
