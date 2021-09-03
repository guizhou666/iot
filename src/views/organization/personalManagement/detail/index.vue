<template>
  <div class="addPersonal">
    <div class="app-content-wrap">
      <AppMainHeader title="查看人员详情" hasBackBtn></AppMainHeader>
      <div class="addPersonal_box">
        <el-form class="addPersonal_form" ref="form" :model="form" label-width="240px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="工号：" class="addPersonal_workid">
                <span>{{ form.code | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="姓名：" prop="name">
                <span>{{ form.name | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="身份证：" prop="papers">
                <span>{{ form.papers | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="性别：">
                <span>{{ form.gender == 1 ? '男' : '女' | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="所属部门：" prop="deptId">
                <span>{{ form.depName | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="岗位：" prop="postIdList">
                <span>{{ postNames | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="联系电话：" prop="phone">
                <span>{{ form.phone | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="电子邮箱：" prop="email">
                <span>{{ form.email | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="备注：" prop="description">
                <span>{{ form.description | isNull }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="20" style="margin-bottom:40px">
              <AppMainHeader title="用户账号"></AppMainHeader>
            </el-col>
          </el-row>
          <transition-group name="fade-transform">
            <el-row key="username">
              <el-col :span="10">
                <el-form-item label="用户名：" prop="userAccount">
                  <span>{{ form.userAccount | isNull }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row key="role">
              <el-col :span="10">
                <el-form-item label="角色：" prop="roleIds">
                  <span>{{ roleNames | isNull }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </transition-group>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { AppMainHeader } from '@/components'
import { getDepartmentTree, getPostList } from '@/api/postManage'
import { getPersonDetail } from '@/api/personalManage'
import { getRoles } from '@/api/roleManage'

export default {
  data() {
    return {
      form: {
        name: '',
        papers: '',
        gender: 1,
        deptId: '',
        email: '',
        description: '',
        userAccount: '',
        roleIds: ''
      },
      departProps: {
        label: 'name',
        value: 'id',
        children: 'childList',
        emitPath: false
      },
      departTree: [],
      postList: [],
      roleList: [],
      postNames: '',
      roleNames: ''
    }
  },
  computed: {
    createAccount() {
      let { userAccount, roleIds } = this.form
      if (!userAccount && roleIds.length) {
        return true
      }
      return false
    }
  },
  components: {
    AppMainHeader
  },
  created() {
    this.getPersonDetail()
  },
  methods: {
    async getPersonDetail() {
      const { code, data, msg } = await getPersonDetail({
        id: this.$route.query.id
      })
      if (code === '200') {
        Object.assign(this.form, data)
        this.getRoles()
        this.getPostList()
      }
    },

    async getRoles() {
      const { code, data, msg } = await getRoles()
      if (code === '200') {
        this.roleList = this.arrayToObj(data.records)
        this.roleNames = this.getName(this.roleList, this.form.roleIds)
      }
    },
    delLastChildlist(data) {
      data.map(item => {
        if (item.childList && item.childList.length) {
          this.delLastChildlist(item.childList)
        } else {
          delete item.childList
        }
      })
    },
    async getPostList() {
      const { code, data, msg } = await getPostList()
      if (code == 200) {
        this.postList = this.arrayToObj(data.records)
        this.postNames = this.getName(this.postList, this.form.postIdList)
      }
    },
    getName(list, ids) {
      let names = ids.map(item => list[item].name)
      return names.join(',')
    },
    arrayToObj(arr) {
      let obj = {}
      arr.map(item => {
        obj[item.id] = item
      })
      return obj
    },
    handleResult(res) {
      if (res.code == '200') {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.$router.push('/personalManagement/table')
      } else {
        this.$message({
          type: 'error',
          message: res.message
        })
      }
    },
    cancel() {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss">
.addPersonal {
  .addPersonal_form {
    margin: 40px 0;
  }
  .form-item {
    width: 80%;
  }
}

/*fade-transform*/
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.4s;
}
.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
