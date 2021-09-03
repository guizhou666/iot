<template>
  <div class="addoredit_user">
    <div class="app-content-wrap">
      <AppMainHeader title="用户账号" hasBackBtn></AppMainHeader>
      <el-form class="form-box" :model="form" label-width="180px" ref="form">
        <el-form-item label="用户名：" prop="userAccount">
          <span>{{form.userAccount | isNull}}</span>
        </el-form-item>
        <el-form-item label="角色：" prop="roleIds">
          <span>{{form.roleNames | isNull}}</span>
          <!-- <span v-for="role in roleList" :key="role.id" :label='role.name' :value="role.id">{{role.name | isNull}}, </span> -->
        </el-form-item>

        <AppMainHeader title="个人信息：" style="margin-bottom:40px"></AppMainHeader>

        <el-row class="form-wrapper">
          <el-col :span="12">
            <el-form-item label="姓名：" prop="realName">
              <span>{{form.realName | isNull}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户头像：" prop="headUrl" justify="center">
              <div class="avatar-container">
                <img-skeleton  :filekey='form.headUrl' type='circle' class="avatar-icon"></img-skeleton>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="昵称：" prop="nickName">
              <span>{{form.nickName | isNull}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别：" prop="gender">
              <span>{{form.gender == '0' ? '男' : '女' | isNull}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="联系电话：" prop="phone">
          <span>{{form.phone | isNull}}</span>
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="email">
          <span>{{form.email | isNull}}</span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { AppMainHeader,ImgSkeleton } from '@/components'
import { getRoleList } from '@/api/roleManage'
import { getUser } from '@/api/userManage'

export default {
  components: { AppMainHeader,ImgSkeleton },
  data() {
    return {
      form: {
        userAccount: '',
        // roleIds: [],
        userPwd: '',
        repeatUserPwd: '',
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
  created() {
    // this.getRoleList()
    this.getUser()
  },
  methods: {
    async getRoleList() {
      const { code, data, msg } = await getRoleList()
      this.roleList = data
    },
    async getUser() {
      const { code, data, msg } = await getUser({ id: this.$route.query.id })
      if (code === '200') {
        this.form = {
          email: data.email,
          isEnabled: data.isEnabled,
          nickName: data.nickName,
          phone: data.phone,
          realName: data.realName,
          // roleIds: data.roleIds ? data.roleIds.split(',') : [],
          roleNames: data.roleNames,
          userAccount: data.userAccount,
          gender: data.gender,
          headUrl: data.headUrl
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
      margin-left: 6px;
      font-size: 16px;
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