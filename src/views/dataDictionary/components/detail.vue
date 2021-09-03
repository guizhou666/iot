<template>
  <div class="post-detail app-content-wrap">
    <AppMainHeader title="查看数据字典详情" :hasBackBtn="true"></AppMainHeader>
    <div class="detail-header">
      <el-form class="form-box" label-width="180px">
        <el-col :span="24">
          <el-form-item label="上级字典：">
            <span>{{ detailData.parentNames | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="字典编码：">
            <span>{{ detailData.code | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="字典名称：">
            <span>{{ detailData.name | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属组：">
            <span>{{ detailData.groupS | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：">
            <span class="breakall">{{ detailData.description | isNull }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内置标识：">
            <span>{{ detailData.isInner ? '是' : '否' | isNull }}</span>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import { getDetail } from '@/api/dataDictionary'
export default {
  components: {
    AppMainHeader
  },
  data() {
    return {
      detailData: {}
    }
  },
  computed: {},
  //监控data中的数据变化
  watch: {},
  created() {
    this._getDetail()
  },
  mounted() {},
  methods: {
    // 查看人员信息
    viewDetail(id) {
      this.$router.push({
        path: '/departmentManagement/detail/userDetail',
        query: { userId: id }
      })
    },
    // 部门详情
    async _getDetail() {
      const params = {
        id: this.$route.query.id
      }
      const { code, data, msg } = await getDetail(params)
      if (code == 200) {
        this.detailData = data
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.post-detail {
  width: 100%;
  .detail-header {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 0px;
    .el-form {
      width: 100%;
    }
    .wid100 {
      width: 50%;
    }
  }
}
</style>
