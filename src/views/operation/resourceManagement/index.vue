<template>
  <div class="resource-warpper">
    <FilterForm @onSearch="onSearch"></FilterForm>
    <div class="app-content-wrap">
      <TreeTable
        ref="treetable"
        :treeConfig="treeConfig"
        :treeData="treeData"
        class="treeTable-warpper"
      >
        <template slot="url" slot-scope="scope">
          <span class="ellipsis" :title="scope.row.url">{{ scope.row.url | isNull }}</span>
        </template>
        <template slot="operationBtn">
          <el-button icon="el-icon-plus" type="primary" @click="addResource" v-has
            >添加资源</el-button
          >
        </template>
        <template slot="operation" slot-scope="scope">
          <el-link
            type="primary"
            @click="addResource(scope.row)"
            :class="{ 'hidden-button': scope.row.type === 3 }"
            v-text="scope.row.type === 1 ? '添加资源' : '添加按钮'"
            v-has
          ></el-link>
          <el-link type="primary" @click="viewResource(scope.row)" v-has>查看</el-link>
          <el-link type="primary" @click="editResource(scope.row)" v-has>修改</el-link>
          <el-link type="danger" @click="invalid('sigle', scope.row)" v-has>作废</el-link>
        </template>
      </TreeTable>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, TreeTable } from '@/components/index.js'

import { getResources, delResource } from '@/api/resourceManage'
import FilterForm from './FilterForm.vue'
import { UPDATE_CACHECOMPONENTS } from '@/store/mutation-types'
export default {
  name: 'ResourceManagement',
  data() {
    return {
      treeData: [],
      treeConfig: {
        loading: false,
        showCheckbox: false,
        // showFilter:true,
        showHeader: true,
        showFooter: false,
        clientWidth: 1625,
        props: {
          children: 'childList' //根据这个值遍历节点。
        },
        nodeKey: 'resourceId', //节点数的唯一标识
        defaultExpandAll: true,
        headers: [
          { title: '资源名称', field: 'name', width: '30%', showIcon: true },
          { title: '编码', field: 'code', width: '20%' },
          { title: '路径', tdTemplate: 'url', width: '30%' },
          { title: '操作', tdTemplate: 'operation', width: '20%' }
        ]
      },
      idList: [],
      searchParams: {}
    }
  },

  components: {
    AppMainHeader,
    TreeTable,
    FilterForm
  },
  created() {
    this.getResources()
  },
  activated() {
    this.getResources()
  },
  methods: {
    async getResources() {
      this.treeConfig.loading = true
      const { code, data, msg } = await getResources(this.searchParams)
      if (code === '200') {
        this.treeData = data
      }
      this.treeConfig.loading = false
    },
    /*
    添加资源，
    类型 = 1目录     2 菜单   3 按钮
    */
    addResource(row) {
      if (row && row.type === 3) return
      this.$router.push({
        path: '/resourceManagement/add',
        query: {
          id: row && row.id,
          appId: row && row.appId,
          type: (row && row.type) || 1
        }
      })
    },
    editResource(row, type) {
      this.$router.push({
        path: '/resourceManagement/edit',
        query: {
          id: row.id,
          type: row.type
        }
      })
    },
    invalid(type, row) {
      this.$refs.treetable.invalid(type, row).then(async (params) => {
        const { code, data, message } = await delResource(params)
        this.responseHandler(code, data, message).then((res) => {
          this.onSearch()
        })
      })
    },
    viewResource(row) {
      this.$router.push({
        path: '/resourceManagement/detail',
        query: {
          id: row.id
        }
      })
    },
    onSearch(params) {
      Object.assign(this.searchParams, params)
      this.getResources()
    }
  },
  beforeRouteEnter(to, from, next) {
    const cacleList = [
      '/resourceManagement/add',
      '/resourceManagement/edit',
      '/resourceManagement/detail'
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
      '/resourceManagement/add',
      '/resourceManagement/edit',
      '/resourceManagement/detail'
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

<style lang="scss" scoped>
.resource-warpper {
  .text {
    @include font_color('font_color1');
  }
  .hidden-button {
    visibility: hidden;
    cursor: none !important;
  }
}
</style>
