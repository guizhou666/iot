<template>
  <div>
    <template v-if="!isDirectory">
      <template v-if="isMenu(item)">
        <app-link :to="item.url">
          <el-menu-item :index="item.id" @click.native="handleClick(item)">
            <item :icon="item.icon" :title="item.resourceAlias || item.name" />
          </el-menu-item>
        </app-link>
      </template>
      <!-- 子菜单 -->
      <el-submenu v-else ref="subMenu" :index="item.id" popper-append-to-body>
        <template slot="title">
          <item :icon="item.icon" :title="item.resourceAlias || item.name" />
        </template>
        <template v-for="child in item.childList">
          <sidebar-item :key="child.id" :is-nest="true" :item="child" class="nest-menu" />
        </template>
      </el-submenu>
    </template>

    <template v-else>
      <app-link :to="item.url">
        <el-menu-item @click.native="handleClick(item)" :index="item.id">
          <item :icon="item.icon" :title="item.name" />
        </el-menu-item>
      </app-link>
    </template>
  </div>
</template>
<script>
import Item from './Item'
import AppLink from './Link'
import {
  UPDATE_ACTIVEDIRECTORY,
  UPDATE_ACTIVEMENU,
  UPDATE_MENUS,
  UPDATE_ACTIVEURL
} from '@/store/mutation-types'
import { getFirst } from '@/utils'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    item: {
      type: Object,
      required: true
    },
    isDirectory: {
      type: Boolean
    },
    mode: {
      type: String
    }
  },
  computed: {
    isCollapse() {
      return this.$store.state.app.isCollapse
    }
  },
  data() {
    return {}
  },
  methods: {
    // 如果type 是 2,展示的是菜单，否则展示div
    isMenu(node) {
      return (node.type === 2 ? true : false) || (node.type == 1 && node.url == '/home')
    },
    handleClick(node) {
      if (node.url == '/home') return
      // 如果是navbar，
      this.$store.commit(UPDATE_ACTIVEURL, node.url)

      if (this.mode == 'horizontal') {
        // 目录节点
        this.$store.commit(UPDATE_ACTIVEDIRECTORY, node)
        // this.$store.commit(UPDATE_ACTIVEMENU, getFirst(node.childList))
      } else {
        // this.$store.commit(UPDATE_ACTIVEMENU, node)
      }
    }
  }
}
</script>
