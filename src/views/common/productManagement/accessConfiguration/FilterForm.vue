<template>
  <div class="filter-wrap">
    <FilterForm @toggle="() => (this.showForm = !this.showForm)" @onSearch='onSearch' @onClear='onClear'>
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form
            :inline="true"
            :model="form"
            ref="form"
            label-width="100px"
            class="demo-form-inline"
          >
            <el-col :span="7">
              <el-form-item label="产品模板：" prop="code">
                <el-select v-model="form.appInfoId" placeholder="请选择">
                  <el-option
                    v-for="(product, i) in productList"
                    :key="i"
                    :label="`${product.realName}`"
                    :value="product.id"
                  >{{product.realName}}</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="资源编码" prop="code">
                <el-input size="small" v-model.trim="form.code" placeholder="请输入关键字" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="资源名称" prop="name">
                <el-input size="small" v-model.trim="form.name" placeholder="请输入关键字" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <transition-group name="fade-transform" class="transition">
              <template v-if="showForm">
                <el-col :span="7" key="appId">
                  <el-form-item label="APPID" prop="appId">
                    <el-input size="small" v-model.trim="form.appId" placeholder="请输入关键字" maxlength="20"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="7" key="description">
                  <el-form-item label="备注" prop="description">
                    <el-input size="small" maxlength="500" v-model.trim="form.description" placeholder="请输入关键字"></el-input>
                  </el-form-item>
                </el-col>
              </template>
            </transition-group>
          </el-form>
        </el-row>
      </template>
    </FilterForm>
  </div>
</template>

<script>
import FilterForm from '@/components/FilterForm'
import { getProductList } from '@/api/productManage'

export default {
  name: 'PersonalFile',
  components: { FilterForm },
  data() {
    return {
      form: {
        code: '',
        name: '',
        description: '',
        appId: ''
      },
      showForm: false,
      productList: []
    }
  },
  created() {
    this.getProductList()
  },
  methods: {
    async getProductList() {
      const { code, msg, data } = await getProductList()
      if (code === '200') {
        this.productList = data
      }
    },
    //   检验是否为空
    validate(form) {
      const formValues = Object.values(form)
      const validate = formValues.some(item => {
        if (typeof item === 'string') {
          return item !== ''
        } else if (Array.isArray(item)) {
          return item.length
        }
      })
      return validate
    },
    onSearch() {
      this.$emit('onSearch', this.form)
    },
    onClear() {
      this.form = {}
      this.$emit('onClear', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
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
