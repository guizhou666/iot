<template>
  <div class="main">
    <FilterForm @onSearch="onSearch" :options='options'></FilterForm>
    <div class="app-content-wrap">
      <CommonTable class="table" :dataList="tableData" :getListHandle="_getProducts" :tableConfig.sync="tableConfig" @handleSelectChange="handleSelectChange">
        <template slot="operationBtn">
          <el-button :disabled="choosedIds.length < 2" type="primary" @click="changeLogo()" v-has>批量更换LOGO</el-button>

          <el-button :disabled="choosedIds.length < 2" type="primary" @click="setStyle()">批量设置显示风格</el-button>
        </template>
        <template slot="proState" slot-scope="scope">
          <el-tag v-if="scope.row.isEnabled">已启用</el-tag>
          <el-tag v-else type="danger">已禁用</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-link :underline="false" type="primary" @click="lookDetail(scope.row.id)" v-has>查看</el-link>
          <el-link :underline="false" type="primary" @click="setting(scope.row)" v-has>设置</el-link>
        </template>
      </CommonTable>
    </div>
    <!-- 批量更换Logo -->
    <iot-dialog :dialogConfig="changeLogoConfig" @confirmBtn="confirmBtn(arguments, 'changeLogo')">
      <template slot="logo">
        <upload :uploadConfig="uploadConfig" @handleFileList="handleFileList"></upload>
        <span>仅限于JPG，PNG，大小2M以内</span>
      </template>
    </iot-dialog>
    <!-- 批量设置显示风格 -->
    <iot-dialog :dialogConfig="setStyleConfig" @confirmBtn="confirmBtn(arguments, 'changeStyle')">
      <template slot="setStyle">
        <el-select v-model="displayStyle" placeholder="请选择" @change="changeSelect($event)" value-key="id">
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </template>
    </iot-dialog>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable,Upload } from '@/components'
import { getProducts } from '@/api/productManage'
import { batchChangeLogoOrStyle } from '@/api/productManage'
import iotDialog from '@/components/iot-dialog'
import FilterForm from './FilterForm'
import { getStyle } from '@/api/dataDictionary'
export default {
  name: 'PersonalFile',
  components: { AppMainHeader, FilterForm, CommonTable, iotDialog,Upload },
  data() {
    return {
      searchParams: {},
      tableData: [],
      tableConfig: {
        id: 'assetsCenter-categoryAssets',
        pageSize: 5,
        pageNum: 1,
        total: 0,
        border: true,
        pageSizeOptions: [5, 10, 100, 200, 500],
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: this.$t('myProduct.productCode'), field: 'code' },
          { title: this.$t('myProduct.productName'), field: 'parentName' },
          { title: this.$t('myProduct.nowVersion'), field: 'version' },
          { title: this.$t('myProduct.sysShowName'), field: 'realName' },
          { title: this.$t('myProduct.productState'), tdTemplate: 'proState' },
          { title: this.$t('myProduct.showStyle'), field: 'displayStyleName' },
          { title: this.$t('opraction'), tdTemplate: 'operation', width: 100 }
        ]
      },
      uploadConfig: {
        type: 'img', //上传类型
        filekey: '',
        fileType: 'jpg,png', //上传的文件类型
        limit: 2 //单位M
      },
      changeLogoConfig: {
        showDialog: false,
        title: '批量更换Logo',
        dialogWidth: 600,
        model: {
          logo: ''
        },
        formGroup: [{ label: '上传Logo：', type: 'auto', filed: 'logo', width: '260px' }],
        rules: {
          // name:[{required:true,message:'请填写姓名',trigger: ['blur','change']},{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        }
      },
      options: [],
      setStyleConfig: {
        showDialog: false,
        title: '批量设置显示风格',
        dialogWidth: 600,
        model: {
          setStyle: {
            displayStyle: '',
            displayStyleName: ''
          }
        },
        formGroup: [{ label: '显示风格:', type: 'auto', filed: 'setStyle', width: '250px' }],
        rules: {}
      },
      choosedIds: [],
      displayStyle: '',
      displayStyleName: '',
    }
  },
  created() {
    this._getProducts()
    // 租户版的不同
    if (this.userInfo.userType === '租户') {
      this.tableConfig.headers = [
        { title: '产品编码', field: 'code' },
        { title: '产品名称', field: 'parentName' },
        { title: '系统显示名称', field: 'realName' },
        { title: '产品状态', tdTemplate: 'proState' },
        { title: '显示风格', field: 'displayStyleName' },
        { title: '生效日期', field: 'effectiveTime' },
        { title: '失效日期', field: 'expireTime' },
        { title: '操作', tdTemplate: 'operation', width: 100 }
      ]
    }
    this._getStyle()
  },
  mounted() {},
  methods: {
    // 获取产品列表
    async _getProducts() {
      this.searchParams.size = this.tableConfig.pageSize
      this.searchParams.current = this.tableConfig.pageNum
      this.tableConfig.loading = true
      const { code, data, msg } = await getProducts(this.searchParams)
      if (code === '200') {
        this.tableConfig.loading = false
        data.records.forEach((item) => {
          item.effectiveTime = item.effectiveTime?.split(' ')[0]
          item.expireTime = item.expireTime?.split(' ')[0]
        })
        this.tableData = data.records
        this.tableConfig.total = data.total
      } else {
        this.tableConfig.loading = false
      }
    },
    onSearch(params) {
      this.tableConfig.current = 1
      // 租户版
      if (this.userInfo.userType === '机构') {
        params.parentDisplayName = params.name
        delete params.name
      }
      Object.assign(this.searchParams, params)
      this._getProducts()
    },
    // 查看
    lookDetail(id) {
      this.$router.push({ path: '/myProduce/detail', query: { id: id } })
    },
    // 设置
    setting(row) {
      this.$router.push({ path: '/myProduce/setting', query: { id: row.id } })
    },
    // 批量更换Logo
    changeLogo() {
      this.changeLogoConfig.showDialog = true
    },
    // 确认更换logo或显示风格
    async confirmBtn(e, type) {
      const params = {
        ids: this.choosedIds
      }
      if (type === 'changeLogo') {
        params.logo = this.filekey
      } else {
        // params.displayStyle = this.setStyleConfig.model.setStyle.displayStyle
        // (params.displayStyleName = this.setStyleConfig.model.setStyle.displayStyleName)
        params.displayStyle = this.displayStyle
        params.displayStyleName = this.displayStyleName
      }
      const { code, data, msg } = await batchChangeLogoOrStyle(params)
      if (code == '200') {
        this.$message.success('更换成功')
        this.setStyleConfig.showDialog = false
        this.changeLogoConfig.showDialog = false
        this._getProducts()
        this.uploadConfig.filekey = ''
        this.filekey = ''
      }
    },
    // 复选框
    handleSelectChange(res) {
      this.choosedIds = res.map((item) => item.id)
    },
    // 批量设置风格
    setStyle() {
      this.setStyleConfig.showDialog = true
    },
    handleFileList(file) {
      this.filekey = file.filekey
    },
    _getStyle() {
      getStyle().then((res) => {
        if (res.code == 200) {
          this.options = res.data
        }
      })
    },
    // 更换select
    changeSelect(event) {
      this.displayStyle = event
      this.displayStyleName = this.options.filter(item=> item.id == event)[0]['name']
      // this.setStyleConfig.model.setStyle.displayStyle = event
      // this.setStyleConfig.model.setStyle.displayStyleName = event.name
    }
  }
}
</script>

<style lang="scss">
.text {
  @include font_color('font_color1');
}
</style>
