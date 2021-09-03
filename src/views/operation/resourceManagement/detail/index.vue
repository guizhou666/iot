<template>
  <div class="addoredit_user">
    <div class="app-content-wrap">
      <AppMainHeader title="查看资源详情" hasBackBtn></AppMainHeader>
      <el-form class="form-box" label-width="180px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源ID：">
              <span>{{ form.id | isNull }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="资源类型：">
              <el-tag>
                <span>{{resourceType | isNull}}</span>
              </el-tag>
            </el-form-item>
          </el-col>

          <template v-if="form.type == '1'">
            <el-col :span="12">
              <el-form-item label="目录编码：" prop="code">
                <span>{{form.code | isNull}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="目录名称：" prop="name">
                <span>{{form.name | isNull}}</span>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="form.type == '2'">
            <el-col :span="12">
              <el-form-item label="菜单编码：" prop="code">
                <span>{{form.code | isNull}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="菜单名称：" prop="name">
                <span>{{form.name | isNull}}</span>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="form.type == '3'">
            <el-col :span="12">
              <el-form-item label="按钮编码：" prop="code">
                <span>{{form.code | isNull}}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="按钮名称：" prop="name">
                <span>{{form.name | isNull}}</span>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item label="APPID：" prop="appId">
              <span>{{form.appId | isNull}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.type !==3">
            <el-form-item label="图标：" prop="icon">
              <i v-if="form.icon" :class="form.icon"></i>
              <span v-else>--</span>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-if="form.type==2">
            <el-form-item label="菜单路径：" prop="description">
              <span>{{form.url | isNull}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="description">
              <span>{{form.description | isNull}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <AppMainHeader title="使用情况"></AppMainHeader>

      <Useage :id="$route.query.id"></Useage>
    </div>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import { getResource } from '@/api/resourceManage'
import Useage from './Useage'

export default {
  components: { AppMainHeader, Useage },
  data() {
    return {
      form: {
        userAccount: '',
        roleIds: [],
        userPwd: '',
        repeatResourcePwd: '',
        realName: '',
        headUrl: '',
        nickName: '',
        gender: 0,
        phone: '',
        email: ''
      },
      roleList: []
    }
  },
  computed: {
    resourceType() {
      let res
      switch (this.form.type) {
        case 1:
          res = '目录'
          break
        case 2:
          res = '菜单'
          break
        case 3:
          res = '按钮'
          break
      }
      return res
    }
  },
  created() {
    this.getResource()
  },
  methods: {
    async getResource() {
      const { code, data, msg } = await getResource({ id: this.$route.query.id })
      if (code === '200') {
        this.form = {
          type: data.type,
          code: data.code,
          name: data.name,
          icon: data.icon,
          url: data.url,
          appId: data.appId,
          description: data.description,
          id: data.id,
          parentId: data.parentId
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addoredit_user {
  .form-box {
    margin-top: 40px;
    & .el-input,
    .el-textarea {
      width: 50%;
    }
    .tips {
      margin-left: 12px;
      font-size: 112px;
      color: #00a4ff;
      transition: 0.3s;
      &:hover {
        font-size: 18px;
        color: #0193e2;
      }
    }
    .avatar-container {
      display: flex;
      align-items: center;
      .el-avatar {
        margin-right: 20px;
      }
    }
  }
  .footer {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    & .el-button {
      margin: 0 20px;
    }
  }
}
</style>
