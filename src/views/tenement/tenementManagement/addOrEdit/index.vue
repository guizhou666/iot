<template>
  <div class="app-content-wrap card__wrapper">
    <el-row>
      <el-form :model="form" label-width="180px" :rules="rules" ref="form">
        <el-col :span="14">
          <el-form-item label="租户编码：" prop="code">
            <template v-if="$route.name == 'Add'">
              <el-input placeholder="请输入租户编码" v-model.trim="form.code" maxlength="20">
                <el-tooltip
                  slot="suffix"
                  class="input_tip"
                  content="不填写，则系统自动生成"
                  placement="top"
                >
                  <i class="el-icon-warning"></i>
                </el-tooltip>
              </el-input>
            </template>
            <span v-else>{{ form.code }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="租户名称：" prop="name">
            <el-input
              placeholder="请输入租户名称"
              v-model.trim="form.name"
              maxlength="50"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="法人代表：" prop="legalPerson">
            <el-input placeholder="请输入法人代表" v-model.trim="form.legalPerson" maxlength="50">
              <i class="el-icon-user" slot="prepend"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="联系电话：" prop="contactPhone">
            <el-input placeholder="请输入联系电话" v-model.trim="form.contactPhone" maxlength="11">
              <i class="el-icon-phone-outline" slot="prepend"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="电子邮箱：" prop="contactEmail">
            <el-input placeholder="请输入邮箱地址" v-model.trim="form.contactEmail">
              <i class="el-icon-message" slot="prepend"></i>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="20">
          <el-form-item label="地址：" prop="address">
            <CitySelect ref="citySelect" @change="changeAddress"></CitySelect>
          </el-form-item>
        </el-col>

        <el-col :span="5">
          <el-form-item label="访问方式：" prop="accessMode">
            <el-radio :label="1" v-model="form.accessMode">域名</el-radio>
            <el-radio :label="2" v-model="form.accessMode">IP</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="18" class="form__accessType">
          <el-form-item label="二级域名：" prop="subdomain" v-if="form.accessMode === 1">
            <el-input
              placeholder="请输入域名"
              v-model.trim="form.subdomain"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <div style="display: flex">
            <el-form-item label="IP" prop="proxyIp" v-if="form.accessMode === 2">
              <ip-input
                style="width: 200px"
                v-model.trim="form.proxyIp"
                :defaultValue="proxyIp"
              ></ip-input>
            </el-form-item>
            <el-form-item label="端口" prop="proxyPort" v-if="form.accessMode === 2">
              <el-input
                style="width: 100%"
                v-model.trim="form.proxyPort"
                @input="inputPort"
                @paste="pastePort"
                maxlength="11"
              ></el-input>
            </el-form-item>
          </div>
          <span class="form__text--setting" @click="showSetting">更多个性化设置</span>
        </el-col>
        <transition name="fade-transform" class="trans ition">
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
          <el-form-item label="机构数量：" prop="orgNum">
            <el-input
              v-model.trim="form.orgNum"
              @input="changeOrgNum"
              @paste="changeOrgNum"
              placeholder="请输入机构数量"
            >
              <el-tooltip
                slot="suffix"
                class="input_tip"
                content="不输入值，即不控制最大数量"
                placement="top"
              >
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="租户状态：" prop="isEnabled">
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
              <el-input placeholder="请输入用户名" v-model.trim="form.userName" maxlength="50">
                <i slot="prepend" class="el-icon-user"></i>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="初始密码：" prop="password">
              <el-input
                maxlength="20"
                type="password"
                showPassword
                placeholder="请输入初始密码"
                v-model.trim="form.password"
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
                maxlength="20"
                placeholder="请重复初始密码"
                v-model.trim="form.rePassword"
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
</template>

<script>
import { AppMainHeader, IconSelect, CitySelect, IpInput } from '@/components'
import { addTenement, editTenement, getTenement } from '@/api/tenementManage'
import {
  validatePhone,
  validateMail,
  validateUrl,
  validateChinese,
  validateIP,
  validateSubDomain,
  validateLenth,
  validatePort
} from '@/utils/validate'

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
        accessMode: 1, //访问方式
        subdomain: '', //二级域名
        proxyIp: '', // IP
        proxyPort: '', //端口
        orgNum: '', //机构数量
        isEnabled: 1,
        description: '',
        userName: '',
        password: ''
      },
      proxyIp: '',
      rules: {
        name: [{ required: true, message: '请输入租户名称', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '请输入法人代表', trigger: 'blur' }],
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
        subdomain: [{ required: true, message: '请输入二级域名', trigger: 'blur' }],
        proxyIp: [
          { required: true, message: '请输入IP', trigger: 'blur' },
          { validator: validateIP, trigger: 'blur' }
        ],
        proxyPort: [
          { required: true, message: '请输入端口', trigger: 'blur' },
          { validator: validatePort, trigger: 'blur' }
        ],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入初始密码', trigger: 'blur' }],
        rePassword: [
          { required: true, message: '请重复初始密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ]
      },
      setting: false
    }
  },
  components: {
    AppMainHeader,
    IconSelect,
    CitySelect,
    IpInput
  },
  computed: {
    title() {
      return this.$route.name === 'Add' ? '添加租户' : '修改租户'
    }
  },

  created() {
    if (this.$route.name === 'Edit') {
      this.getTenement()
    }
  },
  methods: {
    async getTenement() {
      const { code, data, msg } = await getTenement({ id: this.$route.query.tenantId })
      if (code === '200') {
        this.form = {
          code: data.code,
          name: data.name,
          legalPerson: data.legalPerson,
          contactPhone: data.contactPhone,
          contactEmail: data.contactEmail,
          address: data.address,
          accessMode: data.accessMode, //访问方式
          subdomain: data.subdomain, //二级域名
          proxyIp: data.proxyIp, // IP
          proxyPort: data.proxyPort, //端口
          orgNum: data.orgNum == -1 ? '' : data.orgNum, //机构数量
          isEnabled: data.isEnabled,
          description: data.description,
          userName: data.userName,
          password: data.password
        }
        this.proxyIp = data.proxyIp

        this.$refs.citySelect.setValue({
          provinceId: String(data.provinceId),
          cityId: String(data.cityId),
          countyId: String(data.countyId),
          address: String(data.address)
        })
      }
    },

    changeAddress(fullAddress) {
      this.form.address = fullAddress
      this.fullAddress = fullAddress
    },

    confirm() {
      this.form = Object.assign(this.form, this.fullAddress)
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.$route.name === 'Add') {
            const { code, data, message } = await addTenement(Object.assign(this.form))
            this.responseHandler(code, data, message).then((res) => {
              this.$router.push('/tenementManagement/table')
            })
          } else {
            const { code, data, message } = await editTenement({
              id: this.$route.query.tenantId,
              ...this.form
            })
            this.responseHandler(code, data, message).then((res) => {
              this.$router.push('/tenementManagement/table')
            })
          }
        }
      })
    },
    showSetting() {
      this.setting = true
    },
    hideSetting() {
      this.setting = false
    },
    cancel() {
      this.$router.go(-1)
    },
    changeOrgNum(num) {
      // 值只能是数字
      if (/^[0-9]*$/.test(num)) {
        if (num > 1000) {
          this.form.orgNum = '1000'
        } else {
          this.form.orgNum = num
        }
      } else {
        this.form.orgNum = ''
      }
    },
    inputOrgNum(value) {
      if (value > 1000) {
        this.form.orgNum = 1000
      } else if (value < 0) {
        this.form.orgNum = 0
      }
    },
    pasteOrgNum(value) {
      if (value.length == 1) {
        this.form.orgNum = value.replace(/[^1-9]/g, '')
      } else {
        this.form.orgNum = value.replace(/\D/g, '')
      }
    },
    inputPort(value) {
      if (value.length == 1) {
        this.form.proxyPort = value.replace(/[^1-9]/g, '')
      } else {
        this.form.proxyPort = value.replace(/\D/g, '')
      }
    },
    pastePort(value) {
      if (value.length == 1) {
        this.form.proxyPort = value.replace(/[^1-9]/g, '')
      } else {
        this.form.proxyPort = value.replace(/\D/g, '')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card__wrapper {
  ::v-deep .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }

  .el-row {
    padding-top: 40px;

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
    }
    .form__accessType {
      position: relative;
      .form__text--setting {
        position: absolute;
        top: 0;
        right: 280px;
      }
    }
    & .el-input,
    .el-textarea {
      width: 50%;
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
}
</style>

