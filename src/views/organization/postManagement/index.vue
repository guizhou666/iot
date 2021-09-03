<template>
  <div class="main">
    <div class="main-content">
      <div class="content__left app-content-wrap">
        <div class="resize__line"></div>
        <div class="resize__bar"></div>
        <div class="content__left--content">
          <el-form ref="form" label-width="80px" @submit.native.prevent>
            <el-form-item :label="$t('postManagement.depName')">
              <el-input style="width: 200px" v-model.trim="departmentName" @input="_getDepartmentTree" @clear="clearDep" :placeholder="$t('inputTip')" maxlength="50" size="small" clearable>
              </el-input>
            </el-form-item>
          </el-form>
          <el-tree :highlight-current="true" class="tree" :data="treeData" node-key="id" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="defaultExpandedKeys" :expand-on-click-node="false">
            <span slot-scope="{ node }">
              <span :title="node.label" class="node__label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="content__right">
        <FilterForm @onSearch="onSearch" ref="filterForm"></FilterForm>
        <div class="app-content-wrap">
          <CommonTable ref="table" class="table" :dataList="tableData" :getListHandle="_getPost" :tableConfig.sync="tableConfig" @handleSelectChange="handleSelectChange">
            <template slot="operationBtn">
              <el-button icon="el-icon-delete" :disabled="idList.length < 2" type="primary" @click="invalid('batch')" v-has>批量作废</el-button>
              <el-button icon="el-icon-plus" type="primary" @click="addOrEditPost('add')" style="float: right" v-has>添加岗位</el-button>
            </template>
            <template slot="operation" slot-scope="scope">
              <el-link type="primary" @click="viewDetail(scope.row)" v-has>查看</el-link>
              <el-link type="primary" @click="addOrEditPost('edit', scope.row)" v-has>修改</el-link>
              <el-link type="danger" @click="invalid('sigle', scope.row)" v-has>作废</el-link>
            </template>
          </CommonTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, CommonTable } from '@/components'
import { getDepartmentTree, getPostList, deletePost } from '@/api/postManage'
import FilterForm from './FilterForm'
import { deepCopy } from '@/utils'
import { UPDATE_CACHECOMPONENTS } from '@/store/mutation-types'
export default {
  name: 'postTable',
  components: { AppMainHeader, FilterForm, CommonTable },
  data() {
    return {
      idList: [],
      tableData: [],
      treeData: [],
      tableConfig: {
        id: 'assetsCenter-categoryAssets',
        pageSize: 5,
        pageNum: 1,
        total: 0,
        border: false,
        pageSizeOptions: [5, 10, 100, 200, 500],
        loading: false,
        showPagination: true,
        showOperationBtn: true,
        showCheckbox: true,
        headers: [
          { title: this.$t('postManagement.postCode'), field: 'code' },
          { title: this.$t('postManagement.postName'), field: 'name' },
          { title: this.$t('addTime'), field: 'createdTime' },
          { title: this.$t('opraction'), tdTemplate: 'operation', width: 250 }
        ]
      },
      departmentName: '',
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      nowChooseDep: '', //聚焦部门
      defaultExpandedKeys: [], // 展开的部门节点
      timer: null,
      clickId: ''
    }
  },
  activated() {
    this._getPost()
  },
  created() {
    this._getDepartmentTree()
    this._getPost()
  },
  mounted() {},
  methods: {
    // 获取部门树
    _getDepartmentTree(type) {
      const params = {
        name: this.departmentName
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        getDepartmentTree(params).then((res) => {
          if (res.code === '200') {
            this.defaultExpandedKeys = []
            this.getKeyIds(this.treeData)
            this.treeData = res.data
          }
        })
      }, 500)
      //   // 如果试手动搜索，则展开节点
      //   if(type === 'search'){

      //   }
    },
    // 循环递归获取节点id
    getKeyIds(treeData) {
      treeData.forEach((item) => {
        if (item.childList && item.childList?.length) {
          item.childList.forEach((item2) => {
            if (item2.name.includes(this.departmentName) != -1) {
              this.defaultExpandedKeys.push(item.id)
            }
          })
          this.getKeyIds(item.childList)
        }
      })
    },
    onSearch(params) {
      this.tableConfig.pageNum = 1
      this._getPost(params)
    },
    clearDep() {
      this.clickId = ''
      this.tableConfig.pageNum = 1
      this._getPost()
    },
    // 选择部门
    handleNodeClick(data, node, dom) {
      this.clickId = this.clickId == data.id ? '' : data.id

      const isClickSame = dom.$el.getAttribute('class').includes('is-current')
      if (isClickSame) {
        let classVal = dom.$el.getAttribute('class')
        classVal = classVal.replace('is-current', 'write')
        dom.$el.setAttribute('class', classVal)
      } else {
        let classVal = dom.$el.getAttribute('class')
        classVal = classVal.replace('write', '')
        classVal = classVal.concat(' is-current')
        dom.$el.setAttribute('class', classVal)
      }
      this.nowChooseDep = data.deptIds
      const filterFrom = this.$refs.filterForm.form
      let searchParmas = Object.assign(deepCopy(filterFrom), {
        startTime: filterFrom.startTime,
        endTime: filterFrom.endTime
      })
      delete searchParmas.date
      const searchData = {
        deptId: this.clickId,
        ...searchParmas
      }
      this._getPost(searchData)
    },
    // 获取岗位
    async _getPost(searchData) {
      let params = {
        size: this.tableConfig.pageSize,
        current: this.tableConfig.pageNum,
        deptId: this.clickId
      }
      if (searchData) {
        params = {
          size: this.tableConfig.pageSize,
          current: this.tableConfig.pageNum,
          deptId: this.clickId,
          ...searchData
        }
      }
      this.tableConfig.loading = true
      const { code, data, msg } = await getPostList(params)
      if (code == 200) {
        this.tableData = data.records
        this.tableConfig.loading = false
        this.tableConfig.total = data.total
      }
    },
    // 查看详情
    viewDetail(row) {
      this.$router.push({
        path: '/organization/postDetail',
        query: { id: row.id, departmentId: row.deptId, code: row.deptCode }
      })
    },
    invalid(type, row) {
      this.$refs.table.invalid(type, row).then(async (params) => {
        const { code, data, message } = await deletePost(params)
        this.responseHandler(code, data, message).then((res) => {
          this.onSearch()
        })
      })
    },
    // 添加岗位
    addOrEditPost(type, data) {
      this.$router.push({
        path: `/organization/${type}Post`,
        query: { type: type, data: JSON.stringify(data), deptId: this.clickId }
      })
    },
    // 批量勾选
    handleSelectChange(e) {
      this.idList = e.map((item) => item.id)
    }
  },
  beforeRouteEnter(to, from, next) {
    const cacleList = [
      '/organization/addPost',
      '/organization/editPost',
      '/organization/postDetail'
    ]
    if (!cacleList.includes(from.path)) {
      next((vm) => {
        // 避免第一次缓存的时候失效
        vm.$store.commit(UPDATE_CACHECOMPONENTS, [vm.$options.name])
      })
    } else {
      next()
    }
  },

  beforeRouteLeave(to, from, next) {
    const cacleList = [
      '/organization/addPost',
      '/organization/editPost',
      '/organization/postDetail'
    ]
    if (cacleList.includes(to.path)) {
      this.$store.commit(UPDATE_CACHECOMPONENTS, [this.$options.name])
    } else {
      this.$store.commit(UPDATE_CACHECOMPONENTS, [])
    }
    next()
  }
}
</script>

<style lang="scss">
.text {
  @include font_color('font_color1');
}
.main {
  .main-content {
    display: flex;
    .content__left {
      padding: 0;
      position: relative;
      height: calc(100vh - 130px);
      .resize__bar {
        width: 320px;
        height: inherit;
        resize: horizontal;
        cursor: ew-resize;
        opacity: 0;
        overflow: scroll;
        max-width: 500px;
      }
      .resize__line {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        // border-right: 2px solid #eee;
        border-left: 1px solid #dadada;
        pointer-events: none;
      }
      .resize__bar:hover ~ .resize__line,
      .resize__bar:active ~ .resize__line {
        border-left: 1px dashed skyblue;
      }
      .resize__bar::-webkit-scrollbar {
        width: 200px;
        height: inherit;
      }
      // /* Firefox只有下面一小块区域可以拉伸 */
      // @supports (-moz-user-select: none) {
      //   .resize-bar:hover ~ .resize-line,
      //   .resize-bar:active ~ .resize-line {
      //     border-left: 1px solid #bbb;
      //   }
      //   .resize-bar:hover ~ .resize-line::after,
      //   .resize-bar:active ~ .resize-line::after {
      //     content: '';
      //     position: absolute;
      //     width: 16px;
      //     height: 16px;
      //     bottom: 0;
      //     right: -8px;
      //     // background: url(./resize.svg);
      //     background-size: 100% 100%;
      //   }
      // }
      .content__left--content {
        position: absolute;
        top: 0;
        right: 5px;
        bottom: 0;
        left: 0;
        padding: 16px;
        overflow-x: hidden;
      }
      .node__label {
        display: inline-block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
      }
    }
    .content__right {
      overflow: auto;
      margin-left: 10px;
      flex: 1;
      display: block;
    }
  }
}
</style>
