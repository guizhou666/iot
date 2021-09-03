<template>
  <div class="filter-wrap">
    <FilterForm
      :showSearchText="false"
      @toggle="() => (this.showForm = !this.showForm)"
      @onSearch="onSearch"
      @onClear="onClear"
    >
      <template slot="form">
        <el-row class="form-wrapper">
          <el-form :inline="true" :model="form" ref="form" class="demo-form-inline">
            <el-col :span="7">
              <el-form-item label="表名" prop="code">
                <el-input
                  size="small"
                  v-model="form.code"
                  placeholder="请输入关键字"
                  maxlength="20"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="表描述" prop="name">
                <el-input
                  size="small"
                  v-model="form.name"
                  placeholder="请输入关键字"
                  maxlength="50"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="表类型" prop="description">
                <el-radio-group>
                  <el-radio v-for="item in chartType" :key="item.key" :label="item.label">{{
                    item.label
                  }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </template>
    </FilterForm>
  </div>
</template>

<script>
import { FilterForm, DatePicker } from '@/components'
import { deepCopy } from '@/utils'

export default {
  name: 'PersonalFile',
  components: { FilterForm, DatePicker },
  data() {
    return {
      form: {
        code: '',
        name: '',
        description: '',
        createdTimeStart: '',
        createdTimeEnd: ''
      },
      showForm: false,
      chartType: [
        {
          key: 1,
          label: '主表'
        },
        {
          key: 2,
          label: '子表'
        },
        {
          key: 3,
          label: '单表'
        },
        {
          key: 4,
          label: '单表(树)'
        }
      ]
    }
  },
  methods: {
    onSearch() {
      this.handleSearchParams()
    },
    onClear() {
      this.$refs.form.resetFields()
      this.handleSearchParams()
    },
    handleSearchParams() {
      let searchParmas = deepCopy(this.form)
      this.$emit('onSearch', searchParmas)
    }
  }
}
</script>

