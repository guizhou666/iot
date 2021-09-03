<template>
  <div :class="['main', !showSideMenu ? 'home_userinfo' :'app-content-wrap' ]">
    <app-mainHeader title="个人档案" hasBackBtn></app-mainHeader>
    <div class="content-box">
      <div class="content-box-header">
        <div class="header-left">
          <span>用户头像：</span>
            <img-skeleton :filekey='form.headUrl' type='circle' class="avatar-icon"></img-skeleton>
            <upload :uploadConfig="uploadConfig" @handleFileList="handleFileList">
              <el-button slot='button' type="primary" size="mini" @click="changeHeadImg()">更换头像</el-button>
           </upload>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="changeUserInfo()">修改个人信息</el-button>
          <br>
          <el-button class="change-pass" type="primary" @click="changePass()">修改密码</el-button>
        </div>
      </div>
      <div class="content-box-bottom">
        <li><span>用户名：</span><span>{{form.userAccount | isNull}}</span></li>
        <li><span>密码：</span><span>已设置</span></li>
        <li><span>姓名：</span><span>{{form.realName | isNull}}</span></li>
        <li><span>昵称：</span><span>{{form.nickName | isNull}}</span></li>
        <li><span>角色：</span><span>{{form.roleNames | isNull}}</span></li>
        <li><span>性别：</span><span>{{form.gender ? '女' : '男' | isNull}}</span></li>
        <li><span>联系电话：</span><span>{{form.phone | isNull}}</span></li>
        <li><span>电子邮箱：</span><span>{{form.email | isNull}}</span></li>
        <li><span>所属部门：</span><span>{{form.deptNames | isNull}}</span></li>
        <li><span>所属单位：</span><span>{{form.postNames | isNull}}</span></li>
      </div>
    </div>
    <!-- 修改个人信息 -->
    <iot-dialog :dialogConfig="changeInfoConfig" @confirmBtn='confirmEditUserInfo'></iot-dialog>
    <!-- 修改密码 -->
    <iot-dialog :dialogConfig="changePassConfig" @confirmBtn='confirmEditPsw'></iot-dialog>
  </div>
</template>

<script>
import { AppMainHeader, ImgSkeleton, Upload } from '@/components'
import iotDialog from '@/components/iot-dialog'
import { getUser, editUser } from '@/api/userManage'
import { resetPassword, updateUserIcon } from '@/api/user'


export default {
  components: {
    AppMainHeader,
    ImgSkeleton,
    iotDialog,
    Upload
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.changePassConfig.model.userPwd) {
        callback(new Error('重置密码和重复密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        userAccount: '', //用户名
        userPwd: '',
        nickName: '', // 昵称
        realName: '', //名称
        roleNames: '',
        gender: 0,
        phone: '',
        email: '',
        headUrl: ''
      },
      changeInfoConfig: {
        showDialog: false,
        title: '修改个人信息',
        dialogWidth: 600,
        model: {
          password: '',
          realName: '',
          nickName: '',
          userName: '',
          gender: '',
          phone: '',
          email: ''
        },
        formGroup: [
          { label: '姓名:', type: 'input', filed: 'realName', width: '250px' },
          { label: '昵称:', type: 'input', filed: 'nickName', width: '250px' },
          {
            label: '性别:',
            type: 'radio',
            filed: 'gender',
            width: '250px',
            waitChoose: [
              { label: 0, content: '男' },
              { label: 1, content: '女' }
            ]
          },
          { label: '联系电话:', type: 'input', filed: 'phone', width: '250px' },
          { label: '电子邮箱:', type: 'input', filed: 'email', width: '250px' }
        ],
        rules: {
          // name:[{required:true,message:'请填写姓名',trigger: ['blur','change']},{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        }
      },
      changePassConfig: {
        showDialog: false,
        title: '修改密码',
        dialogWidth: 600,
        model: {
          oldPass: '',
          userPwd: '',
          repeatUserPwd: '',
        },
        formGroup: [
          { label: '原密码:', type: 'input', filed: 'oldPass', width: '250px' },
          { label: '重置密码:', type: 'input', filed: 'userPwd', width: '250px' },
          { label: '重复密码:', type: 'input', filed: 'repeatUserPwd', width: '250px' }
        ],
        rules: {
          repeatUserPwd:[
            { validator: validatePassword, trigger: 'blur' }
          ],
        }
      },
      uploadConfig: {
        type: 'img', //上传类型
        showButton: true,
        filekey: '',
        fileType: 'jpg,png', //上传的文件类型
        limit: 2 //单位M
      },
      filekey: ''
    }
  },
  computed: {
    showSideMenu() {
      return this.$store.getters.showSideMenu
    }
  },
  //监控data中的数据变化
  watch: {},
  inject: ['reload'],
  created() {
    this.getUser()
  },
  methods: {
    async getUser() {
      const { code, data } = await getUser({ id: this.userInfo.userId })
      if (code == '200') {
        this.form = data
      }
    },
    changeHeadImg(filekey) {
      // this.filekey = filekey
    },
    // 修改个人信息
    changeUserInfo() {
      this.changeInfoConfig.showDialog = true
      const arr = ['realName','nickName','gender','phone','email']
      arr.map((item)=>{
        this.$set(this.changeInfoConfig.model,item,this.form[item])
      })
    },
    confirmEditUserInfo(model) {
       editUser({...model, id: this.userInfo.userId }).then(res => {
        if (res.code == '200') {
          this.$message.success(res.message)
          this.changeInfoConfig.showDialog = false
          this.getUser()
        }
      })
    },
    handleFileList(file) {
      updateUserIcon({
         headUrl: file.filekey,
         id: this.userInfo.userId
      }).then(res => {
          if (res.code == '200') {
            this.$message.success(res.message)
            this.$store.dispatch('user/getUserInfo',this.userInfo.userId).then(res=>{
              this.reload()
            })
          }
        })
    },
    // 修改密码
    changePass() {
      this.changePassConfig.showDialog = true
      this.$set(this.changePassConfig.model,'oldPass',this.form.userPwd)
      
    },
    // 确认修改密码
    confirmEditPsw(model) {
      resetPassword({...model, id: this.userInfo.userId }).then(res => {
        if (res.code == '200') {
          this.$message.success('密码已重置，请使用新密码登录')
          this.changePassConfig.showDialog = false
          this.getUser()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  &.home_userinfo {
    margin: 0 auto;
    width: 70%;
  }
  .content-box {
    padding: 20px 0px 0px 20px;
    .content-box-header {
      display: flex;
      height: 100px;
      .header-left {
        width: 50%;
        display: flex;
        align-items: center;
        .avatar-icon {
          display: inline-block;
          width: 60px;
          height: 60px;
          margin: 0 20px;
        }
      }
      .header-right {
        width: 50%;
        text-align: right;
        .el-button {
          width: 126px;
          margin-top: 10px;
          .change-pass {
            margin-top: 10px;
          }
        }
      }
    }
    .content-box-bottom {
      width: 70%;
      display: flex;
      flex-wrap: wrap;
      line-height: 80px;
      li {
        width: 50%;
        list-style-type: none;
      }
    }
  }
}
</style>
