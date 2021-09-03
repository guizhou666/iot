<template>
  <div class="roleAccess-wrapper">
    <div class="app-content-wrap">
      <div class="access-info">
        <section>
          <el-tag type="success">角色编码</el-tag>
          <span class="access-info_text">{{ $route.query.code }}</span>
        </section>
        <section>
          <el-tag type="success">角色名称</el-tag>
          <span class="access-info_text">{{ $route.query.name }}</span>
        </section>
      </div>
      <div class="roleAccess-treebox">
        <TreeTable
          ref="tree"
          v-for="(tree, i) in totalResourceList"
          :key="i"
          :defaultCheckedKeys="getDefaultCheckeys(tree)"
          class="treeTable-warpper"
          @check="(node) => checkTree(node, tree && tree[0].id, i)"
          :treeConfig="treeConfig"
          :treeData="tree"
        >
          <template slot="name" slot-scope="scope">
            <span class="ellipsis">{{ showDisplayName(scope.row) }}</span>
          </template>
        </TreeTable>
      </div>
      <el-row class="access-footer">
        <el-button icon="el-icon-finished" type="primary" @click="confirm">确定</el-button>
        <el-button icon="el-icon-refresh-left" @click="cancel">取消</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import { AppMainHeader, TreeTable } from '@/components'
import { getProductList } from '@/api/productManage'
import { getAccess, saveAccess } from '@/api/roleManage'
import { getRelevanceResource } from '@/api/productManage'
import { filterChecking, deepCopy } from '@/utils'
export default {
  components: { AppMainHeader, TreeTable },
  data() {
    return {
      treeConfig: {
        showCheckbox: true,
        showHeader: false,
        showFooter: false,
        clientWidth: 1625,
        props: {
          children: 'childList'
          //   resetKey: 'id'
        },
        nodeKey: 'id',
        defaultExpandAll: false,
        headers: [{ title: '资源名称', tdTemplate: 'name', showIcon: true, width: '100%' }]
      },
      defaultCheckedKeys: [],
      totalResourceList: [], // 全部资源集合
      resourceIds: []
    }
  },
  computed: {
    getDefaultCheckeys() {
      return (tree) => {
        if (!tree) return
        // 如果产品下有资源，返回资源列表
        if (this.defaultCheckedKeys[tree[0].id]) {
          if (this.defaultCheckedKeys[tree[0].id].length) {
            return this.defaultCheckedKeys[tree[0].id]
          } else {
            //如果产品下无资源，返回产品id
            return [tree[0].id]
          }
        } else {
          return []
        }
      }
    }
  },
  created() {
    this.getProductList()
  },
  methods: {
    // 查询产品
    getProductList() {
      getProductList().then((res) => {
        if (res.code === '200') {
          this.getRelevanceResource(res.data)
        }
      })
    },
    // 根据每个产品查出对应产品下的资源
    getRelevanceResource(appInfo) {
      appInfo.map((item, i) => {
        getRelevanceResource({ id: item.id }).then((res) => {
          if (res.code == 200) {
            // 平台的产品没有checking字段，所以不需要过滤
            if (this.userInfo.userType == '平台') {
              item.childList = res.data //将查询出的资源和产品进行关联
            } else {
              item.childList = filterChecking(res.data)
            }
            // 设置树形 list
            this.$set(this.totalResourceList, i, [item])
            // 最后一次 查询 已关联角色id
            if (i == appInfo.length - 1) {
              // 初始化已关联的角色资源
              this.getAccess()
            }
          }
        })
      })
    },
    // 获取角色资源
    getAccess() {
      getAccess({ id: this.$route.query.id }).then((res) => {
        if (res.code == '200') {
          // 避免修改到defaultCheckedKeys
          this.resourceIds = deepCopy(res.data)
          this.defaultCheckedKeys = res.data
        }
      })
    },
    checkTree(node, appid, index) {
      // 把顶级目录过滤掉，作为map的key
      const checkedId = this.$refs.tree[index].getCheckedKeys()
      // let checkedKeys = node.checkedKeys.concat([])
      // const checkedId = checkedKeys.filter((item) => item != appid)
      if (checkedId.length) {
        this.$set(this.resourceIds, appid, checkedId)
      } else {
        delete this.resourceIds[appid]
      }
    },

    showDisplayName(row) {
      // 产品
      if (row.level == 1) {
        return row.realName
      } else {
        return row.resourceAlias || row.name
      }
    },
    async confirm() {
      const { code, data, message } = await saveAccess({
        id: this.$route.query.id,
        resourceIds: this.resourceIds
      })
      this.responseHandler(code, data, message).then((res) => {
        this.$router.push('/roleManagement')
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss">
.roleAccess-wrapper {
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
  .roleAccess-treebox {
    padding: 20px;
    max-height: 800px;
    min-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #ebeef5;
    .treeTable-warpper {
      .treetable_buttonGroup {
        padding: 0;
      }
      .treetable {
        border: none;
        .el-tree {
          padding: 0;
          max-height: none;
          min-height: 0;
          overflow-x: hidden;
          overflow-y: hidden;
        }
      }
    }
  }
}
</style>