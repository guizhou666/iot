<template>
  <div class="access-wrapper">
    <div class="app-content-wrap">
      <el-radio-group v-model="tab" style="margin: 30px 0;">
        <el-radio-button :label="1">已关联资源</el-radio-button>
        <el-radio-button :label="2">未关联资源</el-radio-button>
      </el-radio-group>
      <filter-form v-show="tab === 2" @onSearch="onSearch" @onClear="onClear"></filter-form>
      <RelevanceTree
        @change="changeTree"
        @clickButton="clickButton"
        v-show="tab === 1"
        :treeData="relevanceResources"
        :relevanceLoading="loading"
      ></RelevanceTree>
      <UnRelevanceTree
        @clickButton="clickButton"
        v-show="tab===2"
        :treeData="unRelevanceResources"
        :relevanceLoading="loading"
      ></UnRelevanceTree>

      <el-row class="access-footer">
        <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
        <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AppMainHeader } from '@/components'
import FilterForm from './FilterForm'
import RelevanceTree from './RelevanceResource'
import UnRelevanceTree from './UnRelevanceResource'
import { deepCopy, flat } from '@/utils'

import { getResources } from '@/api/resourceManage'
import { getRelevanceResource, relevanceResource } from '@/api/productManage'

export default {
  components: { AppMainHeader, FilterForm, RelevanceTree, UnRelevanceTree },
  data() {
    return {
      tab: 1,
      searchParams: {},
      resources: [], //总资源列表
      relevanceResources: [], //已关联资源
      unRelevanceResources: [], // 未关联资源
      currentResource: [], // 当前类型数组列表
      handleResource: [], // 其他类型数组列表
      loading: false
    }
  },
  created() {
    this.getResources()
  },
  methods: {
    // 查询全部资源
    async getResources(search) {
      this.loading = true
      const { code, data, msg } = await getResources(this.searchParams)
      if (code === '200') {
        this.resources = data
        if (search) {
          this.loading = false
          this.relevanceResources = this.getIntersection(this.relevanceResources, this.resources)
          this.getUnRelevanceResouce()
        } else {
          this.getRelevanceResource()
        }
      }
    },
    // 查询已关联资源
    async getRelevanceResource() {
      const { code, data, msg } = await getRelevanceResource({ id: this.$route.query.id })
      if (code === '200') {
        this.relevanceResources = data
        this.loading = false
      }
    },
    /**
     * @description:
     * 获取未关联资源
     * 1. 如果已关联资源查询是空的，未关联资源就等于查询的总资源
     * 2. 如果已关联资源不是空，比较全部资源和已关联资源。
     */
    getUnRelevanceResouce() {
      if (!this.relevanceResources.length) {
        this.unRelevanceResources = deepCopy(this.resources)
      } else {
        this.initUnRelevanceResource()
      }
    },

    /**
     * 点击查询按钮后，获取查出的产品下的所有资源和当前已关联资源的交集，作为新的已关联数据
     */
    getIntersection(arr1, arr2) {
      let flatArr1 = this.flat(deepCopy(arr1))
      let flatArr2 = this.flat(deepCopy(arr2))
      let array1 = this.delChildList(flatArr1)
      let array2 = this.delChildList(flatArr2)
      let res = array1.filter(item => array2.map(v => v.id === item.id))
      return this.toTree(res)
    },

    // 初始化未关联数据
    initUnRelevanceResource() {
      // 获取全选节点
      let checkedNodes = this.getCheckedNodes(this.relevanceResources)
      // 获取所有全选择的id列表
      let checkedIds = this.getAllCheckedIds(checkedNodes, deepCopy(this.resources))

      // 把所有节点扁平化
      let resources = this.flat(deepCopy(this.resources))
      // 删除childList
      resources = this.delChildList(resources)
      // 过滤当前选择的
      let current = this.deleteCheckedNodes(resources, checkedIds)

      current = this.getNode(current)

      current = this.toTree(current)
      current = this.filterParent(current, this.resources)
      this.unRelevanceResources = deepCopy(current)
    },
    // 如果是目录层的话，下边没有子元素的删掉
    filterParent(list, resources) {
      resources.map(item => {
        if (item.type == '1') {
          list.map((v, i) => {
            if (v.id === item.id) {
              if (item.childList && item.childList.length) {
                let flat = this.flat(item.childList)
                let hasson = flat.filter(k => k.id == v.id)
                if (!v.childList.length && !hasson.length) {
                  list.splice(i, 1)
                }
              }
            }
          })
        }
      })
      return list
    },
    getCheckedNodes(relevance, nodes = []) {
      relevance.map(item => {
        if (item.childList && item.childList.length) {
          this.getCheckedNodes(item.childList, nodes)
        } else {
          nodes.push(item)
        }
      })
      return nodes
    },
    getAllCheckedIds(checkedNodes, allNodes) {
      let checkedIds = checkedNodes.map(item => item.id)
      allNodes = this.flat(allNodes, 'childList', false)

      allNodes.map(node => {
        let checkedLength, childLength

        checkedNodes.map(checked => {
          if (checked.parentId === node.id) {
            checkedLength = checkedNodes.filter(v => v.parentId == node.id).length
            childLength = node.childList.length
            if (childLength == checkedLength) {
              checkedIds.push(checked.id)
            }
          }
        })
      })
      return checkedIds
    },

    getNode(arr) {
      let allNodes = this.flat(this.resources, 'childList', false)
      let deepCopyArr = deepCopy(arr)
      arr.map((item, i) => {
        // 没有子节点
        if (!arr.filter(k => k.parentId === item.id).length) {
          if (allNodes.filter(v => v.id === item.id)[0].childList.length) {
            delete deepCopyArr[i]
          }
        }
      })
      return deepCopyArr
    },
    changeTree(val) {
      this.relevanceResources = val
    },
    onSearch(searchParmas) {
      this.searchParams = searchParmas
      this.getResources('search')
    },
    onClear(searchParmas) {
      this.searchParams = searchParmas
      this.getResources('search')
    },
    /**
     * @description:
     * 点击关联资源和取消关联都会触发改方法
     * @param {*}
     * allCheckedNodes 已经勾选的全部节点信息（包括半选）
     * checkedNodes 全选节点（不含半选）
     * @return {*}
     */
    clickButton(allCheckedNodes, checkedNodes) {
      let currentResource = []
      let handleResource = []
      if (this.tab === 1) {
        currentResource = this.relevanceResources
        handleResource = this.unRelevanceResources
      } else {
        currentResource = this.unRelevanceResources
        handleResource = this.relevanceResources
      }
      this.getCurrentResource(checkedNodes, currentResource)
      this.getHandleResource(allCheckedNodes, handleResource)
    },
    changeTab() {
      this.tab === 1 ? (this.tab = 2) : (this.tab = 1)
    },
    getCurrentResource(checkedNodes, currentResource) {
      // 获取所有全选择的id列表
      let checkedIds = checkedNodes.map(node => node.id)
      // 把所有节点扁平化
      let resources = this.flat(deepCopy(currentResource))
      resources = this.delChildList(resources)
      let current = this.deleteCheckedNodes(resources, checkedIds)
      current = this.toTree(current)
      this.tab === 1
        ? (this.relevanceResources = deepCopy(current))
        : (this.unRelevanceResources = deepCopy(current))
    },
    /**
     * @description: 删除childList
     * @param { nodes } 节点信息
     * @return { node }  删除后的list信息，没有childList
     */
    delChildList(nodes) {
      return nodes.map(node => {
        node.childList && delete node.childList
        return node
      })
    },
    deleteCheckedNodes(resources, checkedIds) {
      let result = deepCopy(resources)
      resources.map((item, i) => {
        if (checkedIds.includes(item.id)) {
          result = result.filter(v => v.id !== item.id)
        }
      })
      return result
    },
    //获取其他tab的资源
    getHandleResource(allCheckedNodes, handleResource) {
      let flatArr = this.flat(handleResource)
      // 将待处理的数组和全部选择的数组合并去重。
      let concatArr = this.unique([...allCheckedNodes, ...flatArr])
      handleResource = this.toTree(concatArr)
      this.tab === 1
        ? (this.unRelevanceResources = handleResource)
        : (this.relevanceResources = handleResource)
    },
    /**
     * @description: 把要被比较的数据扁平化，并且去掉所有的childList，便于比较
     * @param {*} arr delkey 被比较的数组
     * @return {*}
     */
    flat(arr, delKey = 'childList', isDelete) {
      return arr.reduce((prev, current) => {
        prev.push(current)
        if (current[delKey] && current[delKey].length) {
          prev = [...prev, ...this.flat(current[delKey])]
        }
        isDelete && delete current[delKey]
        return prev
      }, [])
    },
    // 根据 id 把数组去重
    unique(arr) {
      let obj = {}
      arr.map(item => {
        if (!obj[item.id]) {
          obj[item.id] = item
        }
      })
      return Object.values(obj)
    },
    /**
     * @description: 将扁平数据变成树形数据
     * @param {*}
     * @return {*}
     */
    toTree(dataSource, parentId = '-1') {
      let tree = []
      dataSource.map(item => {
        if (item.parentId === parentId) {
          // 递归寻找
          item.childList = this.toTree(dataSource, item.id)
          tree.push(item)
        }
      })
      return tree
    },
    async confirm() {
      let { code, data, message } = await relevanceResource({
        id: this.$route.query.id,
        resources: this.relevanceResources
      })
      message = code == '200' ? '关联资源成功' : message
      this.responseHandler(code, data, message).then(res => {
        this.$router.push('/productManagement/table')
        this.$store.dispatch('user/getMenuList')
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.access-wrapper {
  .access-info {
    padding: 20px 0;
    display: flex;
    section {
      width: 600px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      .el-tag {
        margin-right: 20px;
      }
      .access-info_text {
        font-size: 16px;
        color: rgb(100, 100, 100);
      }
    }
  }
  .access-footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    & .el-button {
      margin-right: 20px;
    }
  }
}
</style>
