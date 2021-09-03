<template>
  <el-dialog
    title="重命名"
    :visible.sync="visible"
    destroy-on-close
    width="30%"
    @close="cancel"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form :model="renameForm" label-width="140px" ref="form">
      <el-form-item label="资源编码" prop="code">
        <span>{{renameForm.code}}</span>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <span>{{renameForm.name}}</span>
      </el-form-item>
      <el-form-item label="资源别名" prop="resourceAlias">
        <el-input
          style="width:80%"
          v-model.trim="renameForm.resourceAlias"
          maxlength="20"
          placeholder="请输入资源别名"
        ></el-input>
      </el-form-item>
      <el-row type="flex" justify="center">
        <!-- <el-col :span="4"> -->
          <el-button style="margin-right:10px" icon="el-icon-finished" type="primary" @click="rename">确定</el-button>
        <!-- </el-col> -->
        <!-- <el-col :span="4"> -->
          <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
        <!-- </el-col> -->
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { flat, deepCopy, toTree } from '@/utils'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    renameForm: {
      type: Object
    },
    treeList: {
      type: Array
    }
  },
  methods: {
    rename(row) {
      this.$emit('rename')
    },
    cancel() {
      this.renameForm.resourceAlias = ''
      this.$emit('rename', 'cancel')
    }
  }
}
</script>
