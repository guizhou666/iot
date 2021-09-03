<template>
  <div>
    <div class="treetable_buttonGroup">
      <slot name="operationBtn"></slot>
    </div>
    <div class="treetable">
      <div class="treetable_head" v-if="treeConfig.showHeader">
        <div
          class="treetable_head_item"
          :style="{ width: handlePX(item) }"
          v-for="item in treeConfig.headers"
          :key="item.title"
        >
          {{ item.title }}
        </div>
      </div>
      <div v-loading="treeConfig.loading">
        <template class="tree-body" v-if="treeList.length">
          <el-tree
            ref="treetable"
            class="treetable_container"
            :props="treeProps"
            :data="treeList"
            :showCheckbox="treeConfig.showCheckbox"
            :node-key="treeConfig.nodeKey"
            :default-expand-all="treeConfig.defaultExpandAll"
            :expand-on-click-node="false"
            :indent="0"
            :lazy="treeConfig.lazy"
            @check="check"
            @check-change="checkChange"
          >
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <div
                v-for="_item in treeConfig.headers"
                :key="_item.title"
                :style="{ 'min-width': handlePX(_item, data), width: handlePX(_item, data) }"
              >
                <template v-if="_item.tdTemplate">
                  <span v-if="_item.tdTemplate === 'operation'" class="operation-button">
                    <slot :name="_item.tdTemplate" :row="data"></slot>
                    <el-link v-if="treeConfig.showRename" @click="showRename(data)" type="primary"
                      >重命名</el-link
                    >
                    <el-link
                      v-if="treeConfig.showUpDown"
                      @click="upDown(data, 'up')"
                      :type="data.indexing === 0 ? 'info' : 'primary'"
                      :disabled="!data.indexing"
                      >上移</el-link
                    >
                    <el-link
                      v-if="treeConfig.showUpDown"
                      :type="data.lastIndex ? 'info' : 'primary'"
                      :disabled="data.lastIndex"
                      @click="upDown(data, 'down')"
                      >下移</el-link
                    >
                  </span>
                  <slot v-else :name="_item.tdTemplate" :row="data" class="ellipsis"></slot>
                </template>
                <template v-if="_item.field">
                  <div class="column-node">
                    <i class="column-node_icon" v-if="_item.showIcon" :class="data.icon"></i>
                    <span class="ellipsis" :title="data[_item.field]">{{
                      data[_item.field] | isNull
                    }}</span>
                  </div>
                </template>
              </div>
            </div>
          </el-tree>
          <div class="tree-button" v-if="treeConfig.showFooter">
            <el-radio v-model="treeConfig.allOrHalfSelect" label="全选" @change="allOrHalfSelect"
              >全选</el-radio
            >
            <el-radio v-model="treeConfig.allOrHalfSelect" label="全不选" @change="allOrHalfSelect"
              >全不选</el-radio
            >

            <slot name="footerBtn"></slot>
          </div>
        </template>
        <template v-else>
          <Empty></Empty>
        </template>
      </div>
      <rename
        :visible="renameVisible"
        :renameForm="renameForm"
        :treeList="renameTreeList"
        @rename="rename"
      ></rename>
    </div>
  </div>
</template>

<script>
import Empty from '@/components/Empty'
import Rename from './Rename'
import { flat, deepCopy, toTree } from '@/utils'
export default {
  name: 'TreeTable',
  components: { Empty, Rename },
  data() {
    return {
      renameVisible: false,
      renameForm: {
        code: '',
        name: '',
        resourceAlias: ''
      },
      treeList: [],
      excludeSelectList: []
    }
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return []
      }
    },
    treeConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    selectKey: {
      type: Object,
      default() {
        return {
          id: 'id',
          name: ['name']
        }
      }
    },
    defaultCheckedKeys: {
      tyep: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    renameTreeList() {
      return this.treeData
    },
    treeProps() {
      return { children: this.treeConfig.props.children }
    },
    handlePX() {
      return (item, node) => {
        let clientWidth = this.treeConfig.clientWidth

        if (node && item.showIcon) {
          let boxPadding = 10 //最外层 padding
          let iconWidth = 14
          let nodePadding = 16 * 2 * node.level
          let triangleWidth = 16 //小三角的宽度
          let selectWidth = this.treeConfig.showCheckbox && 22

          let width =
            (parseInt(item.width) / 100) * clientWidth -
            nodePadding -
            boxPadding -
            selectWidth -
            iconWidth

          return parseFloat(width) + 'px'
        } else {
          return (parseInt(item.width) / 100) * clientWidth + 'px'
        }
      }
    }
  },
  watch: {
    treeData: {
      handler(val) {
        this.handleData(val)
        if (!this.treeConfig.hideChecking) {
          this.treeList = val
        } else {
          let tree = this.excludeSelect(val)
          this.treeList = toTree(tree)
        }
      },
      immediate: true,
      deep: true
    },
    treeList(val) {
      this.$emit('changeTree', val)
    },
    defaultCheckedKeys(val) {
      setTimeout(() => {
        this.$refs.treetable.setCheckedKeys(val)
      }, 0)
    }
  },
  mounted() {
    this.treeConfig.clientWidth =
      document.getElementsByClassName('treeTable-warpper')[0].clientWidth
  },
  methods: {
    handleData(treeData) {
      this.addIndex(treeData)
      treeData.reduce((res, item) => this.handleTreeItem(item, res), [])
    },
    //给每一条数据添加索引，用于移动
    addIndex(treeData) {
      treeData.map((item, i) => {
        item.indexing = i
        if (treeData.length - 1 === i) {
          item.lastIndex = true
        }else {
          item.lastIndex = false // 避免存在lastIndex的情况
        }
        if (item.childList && item.childList.length) {
          this.addIndex(item.childList)
        }
      })
    },
    excludeSelect(tree) {
      const flatTree = flat(deepCopy(tree))
      const checkNode = flatTree.filter((item) => item.checking == 1)
      let result = deepCopy(checkNode)
      let checkList = this.getParent(checkNode, flatTree)
      return checkList
    },
    getParent(checkList, tree) {
      checkList.map((item) => {
        let parent = tree.filter((v) => v.id == item.parentId)
        if (parent.length) {
          if (!checkList.includes(parent[0])) {
            checkList.push(parent[0])
            this.getParent(checkList, tree)
          }
        }
      })
      return checkList
    },
    // 返回的是最底层的，选中的key
    handleTreeItem(treeItem, res, level = 1) {
      const { resetKey, children } = this.treeConfig.props
      if (!treeItem) return res
      // 如果遍历的节点key不统一，需要统一把resetKey转换为children对应的值
      if (treeItem[resetKey]) {
        treeItem[children] = treeItem[resetKey]
        delete treeItem[resetKey]
      }

      // 给 tree的每一个节点都加上level
      treeItem['level'] = level
      // 如果 treeItem
      if (treeItem[children] && treeItem[children].length) {
        level++
        treeItem[children].map((children) => this.handleTreeItem(children, res, level))
      } else {
        res.push(treeItem)
      }
      return res
    },
    getCheckedKeys() {
      return this.$refs.treetable.getCheckedKeys()
    },
    setCheckedKeys(keys) {
      this.$refs.treetable.setCheckedKeys(keys)
    },
    check(checkNode, { checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes }) {
      this.$emit('check', {
        checkNode,
        checkedKeys,
        checkedNodes,
        halfCheckedKeys,
        halfCheckedNodes
      })

      //勾选选择框的时候要根据条件切换全选和全不选的状态
      if (this.treeConfig.allOrHalfSelect === '全选') {
        if (checkedKeys.length !== halfCheckedKeys.length) {
          this.treeConfig.allOrHalfSelect = ''
        }
      }
      if (this.treeConfig.allOrHalfSelect === '全不选') {
        if (checkedKeys.length) {
          this.treeConfig.allOrHalfSelect = ''
        }
      }
    },
    // 节点选中状态发生变化时的回调
    // 传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
    checkChange(node, isSelected, hasCheckedNode) {
      // let checkedNodes = []
      // let list = checkedNodes.map((item) => item.id)
      // let index = list.indexOf(node.id)
      // if (isSelected) {
      //   if (index == -1) {
      //     checkedNodes.push(node)
      //   } else {
      //     checkedNodes.splice(index, 1)
      //   }
      // }
    },
    // 全选半选
    allOrHalfSelect(value) {
      const keys = this.treeList.map((data) => data.id)
      const flatTree = flat(deepCopy(this.treeList))
      if (value === '全选') {
        this.$refs.treetable.setCheckedKeys(keys)
        this.$emit('allOrHalfSelect', flatTree)
      } else {
        this.$refs.treetable.setCheckedKeys([])
        this.$emit('allOrHalfSelect', [])
      }
    },
    // 重命名弹出框
    showRename(row) {
      this.renameVisible = true
      this.renameForm = {
        name: row.name,
        code: row.code,
        resourceAlias: row.resourceAlias,
        id: row.id,
        tenantId: this.$route.query.tenantId,
        appId: this.appId
      }
    },
    rename(type) {
      this.renameVisible = false
      if (type == 'cancel') return
      let flatTree = flat(this.treeList)
      flatTree.map((item) => {
        if (item.id == this.renameForm.id) {
          item.resourceAlias = this.renameForm.resourceAlias
        }
      })
      // 获取选中的节点
      let getCheckedKeys = this.$refs.treetable.getCheckedKeys()
      this.treeList = toTree(flatTree)
      this.$refs.treetable.setCheckedKeys(getCheckedKeys)
    },

    // 上移
    upDown(row, type) {
      if (type === 'up' && !row.indexing) return
      if (type === 'down' && row.lastIndex) return
      let flatData = flat(deepCopy(this.treeList))

      // 获取选中的节点
      let getCheckedKeys = this.$refs.treetable.getCheckedKeys()
      let handleTree = this.handleUpDown(row, flatData, type)
      this.treeList = toTree(handleTree)
      this.$refs.treetable.setCheckedKeys(getCheckedKeys)
      // this.$refs.treetable.store.nodesMap['1386167471175946242'].expanded = false
      this.$emit('change', this.treeList)
    },
    // 通过 找到同级别的list
    handleUpDown(cur, list, type) {
      
      let sameLevel = []
      let index = cur['indexing']
      list.map((item, i) => {
        item.initialIndex = i
        if (item.level === cur.level && item.parentId === cur.parentId) {
          sameLevel.push(item)
        }
      })
      let arr1, arr2
      if (type === 'up') {
        ;[arr1, arr2] = [sameLevel[index], sameLevel[index - 1]]
      } else {
        ;[arr1, arr2] = [sameLevel[index], sameLevel[index + 1]]
      }

      let [init1, init2] = [arr1['initialIndex'], arr2['initialIndex']]
      ;[list[init1]['indexing'], list[init2]['indexing']] = [
        list[init2]['indexing'],
        list[init1]['indexing']
      ]
      ;[list[init1]['lastIndex'], list[init2]['lastIndex']] = [
        list[init2]['lastIndex'],
        list[init1]['lastIndex']
      ]
      ;[list[init1], list[init2]] = [list[init2], list[init1]]
      return list
    },
    getParams(type, row, msg) {
      let params, content, nameList
      const { id, name } = this.selectKey
      let selectList = type == 'batch' ? this._selectList : [row]
      // 判断selectkey中的name是不是数组
      nameList = selectList.map((item) => {
        if (item[name[0]]) return item[name[0]]
        return item[name[1]]
      })

      params = { ids: [row[id]] }
      content = `${msg}` + `${nameList.join(',')}` + '?'
      return { params, content }
    },
    // 作废
    invalid(type, row, message) {
      const h = this.$createElement
      return new Promise((resolve, reject) => {
        let { params, content } = this.getParams(type, row, '确定删除')
        return this.$confirm(
          h('span', [
            h('span', content),
            message ? h('span', { class: 'confirmTips' }, `(${message})`) : null
          ]),
          '提示',
          {
            confirmButtonText: '确定',
            confirmButtonClass: 'el-icon-finished',
            cancelButtonText: '取消',
            cancelButtonClass: 'el-icon-refresh-left',
            type: 'error'
          }
        )
          .then(() => {
            resolve(params)
          })
          .catch(() => {})
      })
    },
    getCheckedNodes() {
      if (this.$refs.treetable) {
        return this.$refs.treetable.getCheckedNodes()
      } else {
        return []
      }
    }
  }
}
</script>
<style lang="scss">
.treetable_container {
  .el-tree-node {
    position: relative;
    padding-left: 16px; // 缩进量
    & .el-tree-node__content {
      // margin-left: 10px;
    }
  }
  .el-tree-node__children {
    padding-left: 16px; // 缩进量
  }

  // 竖线
  .el-tree-node::before {
    content: '';
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -26px;
    border-width: 1px;
    border-left: 1px dashed #a2a2a2;
  }
  // 当前层最后一个节点的竖线高度固定
  .el-tree-node:last-child::before {
    height: 38px; // 可以自己调节到合适数值
  }

  // 横线
  .el-tree-node::after {
    content: '';
    width: 24px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 12px;
    border-width: 1px;
    border-top: 1px dashed #a2a2a2;
  }

  // 去掉最顶层的虚线，放最下面样式才不会被上面的覆盖了
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }

  // 展开关闭的icon
  .el-tree-node__expand-icon {
    font-size: 16px;
    // 叶子节点（无子节点）
    &.is-leaf {
      color: transparent;
      // display: none; // 也可以去掉
    }
  }
}
</style>

<style lang="scss" scoped>
.treetable_buttonGroup {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  color: #fff;
}
.treetable {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  .treetable_head {
    width: 100%;
    display: flex;
    align-items: center;
    font-weight: 700;
    padding-right: 28px;
    font-size: 15px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial,
      sans-serif;
    @include background_color('treetable_header_background');
    @include font_color('treetable_header_color');
    @include height('treetable_header_height');
    border-bottom: 1px solid #ebeef5;
    .treetable_head_item {
      text-align: center;
      border-right: 1px solid #dcdde1;
      &:nth-last-child(1) {
        border: none;
      }
    }
  }
  .treetable_container {
    padding: 10px 0;
    max-height: 400px;
    min-height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .custom-tree-node {
    width: calc(100% - 24px);
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
    position: relative;
    & .column-node {
      display: flex;
      align-items: center;
      & .column-node_icon {
        margin-right: 4px;
      }
    }
  }
  .tree-button {
    border-top: 1px solid #dcdde1;
    padding: 20px 0 20px 20px;
  }
  & .operation-button {
    display: flex;
    justify-content: space-around;
  }
  .tree-table .custom-tree-node {
    font-size: 16px;
  }
  .ellipsis {
    @include textOverflow(1, 90%, block);
  }
  .disabled-text {
    color: #b5b5b5;
  }
}
</style>
