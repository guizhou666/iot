<template>
  <div>
    <div class="app-content-wrap">
      <el-row>
        <el-form class="form-box" :model="form" label-width="180px" :rules="rules" ref="form">
          <el-col :span="14">
            <el-form-item label="机构编码：" prop="code">
              <el-input
                v-if="$route.name === 'Add'"
                placeholder="请输入机构编码"
                v-model="form.code"
                maxlength="20"
              >
                <el-tooltip
                  class="input_tip"
                  slot="suffix"
                  content="不填写，则系统自动生成"
                  placement="top"
                >
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </el-input>
              <span v-else>{{ form.code }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="机构名称：" prop="name">
              <el-input placeholder="请输入机构名称" v-model="form.name" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="法人代表：" prop="legalPerson">
              <el-input placeholder="请输入法人代表" v-model="form.legalPerson" maxlength="50">
                <i class="el-icon-user" slot="prepend"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="联系电话：" prop="contactPhone">
              <el-input placeholder="请输入联系电话" v-model="form.contactPhone" maxlength="11">
                <i class="el-icon-phone-outline" slot="prepend"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="电子邮箱：" prop="contactEmail">
              <el-input placeholder="请输入邮箱地址" v-model="form.contactEmail">
                <i class="el-icon-message" slot="prepend"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="地址：" prop="address">
              <CitySelect ref="citySelect" @change="changeAddress"></CitySelect>
            </el-form-item>
          </el-col>

          <el-col :span="14" class="form__access">
            <el-form-item label="登陆地址：">
              <span>{{ $route.name == 'Edit' ? form.loginType : '系统自动生成' | isNull }}</span>
            </el-form-item>
            <span class="form__text--setting" @click="showSetting">更多个性化设置</span>
          </el-col>

          <transition name="fade-transform" class="transition">
            <div v-if="setting" class="moreSetting__wrap" name="wrap">
              <el-col :span="14" key="displayName">
                <el-form-item label="显示名称：" prop="displayName">
                  <el-input v-model.trim="form.displayName" placeholder="请输入显示名称"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="14" key="logo">
                <el-form-item label="显示LOGO：" prop="logo">
                  <div class="form__item--logo">
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      list-type="picture-card"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <span>建议分辨率80*80；仅限于JPG，PNG，大小2M以内</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="18" key="bg">
                <el-form-item label="背景图片：" prop="logo">
                  <div class="form__item--bg">
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      list-type="picture-card"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <span>建议分辨率1920*1080；仅限于JPG，PNG，大小2M以内</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8" key="place">
                <el-form-item label="登陆框位置：" prop="logo">
                  <el-radio-group>
                    <el-radio label="左侧">左侧</el-radio>
                    <el-radio label="居中">居中</el-radio>
                    <el-radio label="右侧">右侧</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6" key="color">
                <el-form-item label="登陆框颜色：" prop="logo">
                  <el-color-picker></el-color-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6" key="reset">
                <span class="form__text--setting">恢复默认</span>
                <span style="margin-left: 10px" class="form__text--setting" @click="hideSetting"
                  >隐藏个性化设置</span
                >
              </el-col>
            </div>
          </transition>

          <el-col :span="14">
            <el-form-item label="机构状态：" prop="isEnabled">
              <el-radio :label="1" v-model="form.isEnabled">启用</el-radio>
              <el-radio :label="0" v-model="form.isEnabled">禁用</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="备注：" prop="description">
              <el-input
                type="textarea"
                :autosize="{ minRows: 6, maxRows: 6 }"
                placeholder="请输入备注信息"
                maxlength="500"
                show-word-limit
                v-model="form.description"
              ></el-input>
            </el-form-item>
          </el-col>
          <template v-if="$route.name !== 'Edit'">
            <el-col :span="24" style="margin: 0 0 40px 0">
              <AppMainHeader title="管理员账号"></AppMainHeader>
            </el-col>
            <el-col :span="14">
              <el-form-item label="用户名：" prop="userName">
                <el-input placeholder="请输入用户名" v-model="form.userName" maxlength="50">
                  <i slot="prepend" class="el-icon-user"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="初始密码：" prop="password">
                <el-input
                  type="password"
                  showPassword
                  placeholder="请输入初始密码"
                  v-model="form.password"
                  maxlength="20"
                >
                  <i slot="prepend" class="el-icon-lock"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="重复密码：" prop="rePassword">
                <el-input
                  type="password"
                  showPassword
                  placeholder="请重复初始密码"
                  v-model="form.rePassword"
                  maxlength="20"
                >
                  <i slot="prepend" class="el-icon-lock"></i>
                </el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-form>
      </el-row>
      <el-row :span="24" type="flex" justify="center">
        <el-col :span="2">
          <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, IconSelect, CitySelect } from '@/components'
import { addOrganization, editOrganization, getOrganization } from '@/api/organizationManage'
import { validatePhone, validateMail } from '@/utils/validate'

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    const validateAddress = (rule, value, callback) => {
      const { address, cityId, countyId, provinceId } = this.fullAddress
      if (!provinceId) {
        callback(new Error('请选择省份'))
      } else if (!cityId) {
        callback(new Error('请选择地市'))
      } else if (!countyId) {
        callback(new Error('请选择地区'))
      } else if (!address) {
        callback(new Error('请输入详细地址'))
      } else {
        callback()
      }
    }
    return {
      fullAddress: {},
      form: {
        code: '',
        name: '',
        legalPerson: '',
        contactPhone: '',
        contactEmail: '',
        address: '',
        isEnabled: 1,
        description: '',
        userName: '',
        password: ''
      },
      setting: false,
      rules: {
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        legalPerson: [
          { required: true, message: '请输入法人代表', trigger: 'blur' }
          // { validator: validateChinese, trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        contactEmail: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { validator: validateMail, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { validator: validateAddress, trigger: 'blur' }
        ],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入初始密码', trigger: 'blur' }],
        rePassword: [
          { required: true, message: '请重复初始密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    AppMainHeader,
    IconSelect,
    CitySelect
  },
  // computed 前边加上get前缀
  computed: {
    title() {
      return this.$route.name === 'Add' ? '添加机构' : '修改机构'
    }
  },
  created() {
    if (this.$route.name === 'Edit') {
      this.getOrganization()
    }
  },
  methods: {
    async getOrganization() {
      const { code, data, msg } = await getOrganization({ id: this.$route.query.orgId })
      if (code === '200') {
        this.form = {
          code: data.code,
          name: data.name,
          legalPerson: data.legalPerson,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          address: data.address,
          isEnabled: data.isEnabled,
          description: data.description,
          userName: data.userName,
          password: data.password
        }
        this.$refs.citySelect.setValue({
          provinceId: String(data.provinceId),
          cityId: String(data.cityId),
          countyId: String(data.countyId),
          address: String(data.address)
        })
      }
    },
    confirm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.form = Object.assign(this.form, this.fullAddress)
          if (this.$route.name === 'Add') {
            let { code, data, message } = await addOrganization(Object.assign(this.form))
            this.responseHandler(code, data, message).then((res) => {
              this.$router.push('/organizationManagement/table')
            })
          } else {
            const { code, data, message } = await editOrganization({
              id: this.$route.query.orgId,
              ...this.form
            })
            this.responseHandler(code, data, message).then((res) => {
              this.$router.push('/organizationManagement/table')
            })
          }
        }
      })
    },
    changeAddress(fullAddress) {
      this.form.address = fullAddress
      this.fullAddress = fullAddress
    },
    showSetting() {
      this.setting = true
    },
    hideSetting() {
      this.setting = false
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-box {
  margin-top: 40px;
  & .el-input,
  .el-textarea {
    width: 50%;
  }
}
.form__text--setting {
  line-height: 40px;
  font-size: 15px;
  cursor: pointer;
  @include font_color('primary_color');
  &:hover {
    @include font_color('primary_hover_color');
  }
}
.moreSetting__wrap {
  display: block;
  width: 88%;
  height: -webkit-fit-content;
  height: -moz-fit-content;
  height: fit-content;
  border: 1px solid #e7e7e7;
  box-shadow: 0 1px 2px #cceaff;
  overflow: hidden;
  padding-top: 24px;
  margin: 26px 0;
  background: #ecfbff26;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 3px 6px #bde1fc;
  }
  .form__item--logo,
  .form__item--bg {
    display: flex;
    align-items: center;
    span {
      color: #999;
      margin-left: 20px;
    }
  }
}
.form__access {
  position: relative;
  .form__text--setting {
    position: absolute;
    top: 0;
    right: 200px;
  }
}
</style>
