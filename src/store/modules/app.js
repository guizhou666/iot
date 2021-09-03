
import Cookies from 'js-cookie'
import storage from 'store'
import store from '../index'
import {
  UPDATE_ACTIVEMENU,
  UPDATE_PRODUCTLIST,
  IS_HOME,
  UPDATE_THEME,
  UPDATE_ACTIVEDIRECTORY,
  UPDATE_DIRECTORYS,
  UPDATE_MENUS,
  UPDATE_CACHECOMPONENTS,
  UPDATE_SETTING,
  UPDATE_APPINFO,
  UPDATE_RELEVANCERESOURCE,
  UPDATE_ACTIVEURL,
  UPDATE_ISCOLLAPSE,
  INITIAL_URL,
  IS_NEWTAB,
  SHOW_SIDEMENU
} from '@/store/mutation-types'
import { getRelevanceResource } from '@/api/resourceManage'
import { getProductList } from '@/api/productManage'
import { filterChecking } from '@/utils'


const app = {
  // 当namespaced=true 时， vuex, 将会自动给各自module 添加访问路径名。 方便区分moduel
  // namespaced: true,

  state: {
    // 产品列表
    productList: storage.get('productList') || [],
    // 产品信息
    appInfo: storage.get('appInfo') || [],
    // 关联资源信息
    relevanceResource: storage.get('relevanceResource') || [],
    // 是否是首页
    ishome: storage.get('ishome') || false,
    activeDirectory: storage.get('activeDirectory') || {},
    activeMenu: storage.get('activeMenu') || {},
    directorys: storage.get('directorys') || [],
    menus: storage.get('menus') || [],
    // 主题设置
    theme: storage.get('theme') || '01',
    // 个性化设置
    setting: storage.get('setting') || {},
    // 缓存组件
    cacheCompounted: [],
    // 当前激活url
    activeUrl: storage.get('activeUrl') || '',
    // 是否折叠菜单
    isCollapse: storage.get('isCollapse') || false,

    initialUrl: storage.get('initialUrl') || '',

    // 是不是新的标签页,如果是新页签直接清除所有数据
    isNewTab: sessionStorage.getItem('isNewTab') || true,

    showSideMenu: storage.get('showSideMenu') || true,

  },

  mutations: {
    // 更新产品列表
    [UPDATE_PRODUCTLIST](state, payload) {
      state.productList = payload
      storage.set('productList', payload)
    },
    // 更新产品信息
    [UPDATE_APPINFO](state, payload) {
      state.appInfo = payload
      storage.set('appInfo', payload)
    },
    // 更新关联资源
    [UPDATE_RELEVANCERESOURCE](state, payload) {
      state.relevanceResource = payload
      storage.set('relevanceResource', payload)
    },
    // 更新菜单
    [UPDATE_ACTIVEMENU]: (state, activeMenu) => {
      storage.set('activeMenu', activeMenu)
      state.activeMenu = activeMenu
    },
    [IS_HOME]: (state, ishome) => {
      storage.set(IS_HOME, ishome)
      state.ishome = ishome
    },
    // 更新主题
    [UPDATE_THEME]: (state, payload) => {
      state.theme = payload
      storage.set('theme', payload)
    },
    // 更新目录
    [UPDATE_DIRECTORYS]: (state, payload) => {
      state.directorys = payload
      storage.set('directorys', payload)
    },
    // 更新菜单
    [UPDATE_MENUS]: (state, payload) => {
      state.menus = payload
      storage.set('menus', payload)
    },
    // 更新当前目录
    [UPDATE_ACTIVEDIRECTORY]: (state, activeDirectory) => {
      state.activeDirectory = activeDirectory
      storage.set('activeDirectory', activeDirectory)
    },
    [UPDATE_CACHECOMPONENTS]: (state, cacheCompounted) => {
      state.cacheCompounted = cacheCompounted
    },
    [UPDATE_SETTING]: (state, setting) => {
      storage.set('setting', setting)
      state.setting = setting
    },
    [UPDATE_ACTIVEURL]: (state, payload) => {
      storage.set('activeUrl', payload)
      state.activeUrl = payload
    },
    [UPDATE_ISCOLLAPSE]: (state, payload) => {
      storage.set('isCollapse', payload)
      state.isCollapse = payload
    },
    [INITIAL_URL]: (state, payload) => {
      storage.set('initialUrl', payload)
      state.initialUrl = payload
    },
    [IS_NEWTAB]: (state, payload) => {
      sessionStorage.setItem('isNewTab', payload)
      state.isNewTab = payload
    },
    [SHOW_SIDEMENU]: (state, payload) => {
      storage.set('showSideMenu', payload)
      state.showSideMenu = payload
    },
  },

  actions: {
    // 获取产品关联资源
    getProductList({ commit }, payload) {
      const { flag } = payload
      debugger
      console.log(store.state.app.appInfo)
      const outAppId  =store.state.app.appInfo &&  store.state.app.appInfo.appId
      return new Promise((resolve, reject) => {
        getProductList({
          flag,
          outAppId, //从产品退出的标示
        }).then(res => {
          if (res.code === '200') {
            //过滤掉pda产品
            res.data = res.data.filter(item=> !item.pdaFlag)
            resolve(res.data)
            commit(UPDATE_PRODUCTLIST, res.data)
          } else {
            reject(res)
          }
        })
      })
    },

    // 获取产品关联资源
    getRelevanceResource({ commit }, payload) {
      const { id, roleIds, flag } = payload
      return new Promise((resolve, reject) => {
        getRelevanceResource({
          id,
          roleIds,
          flag,
        }).then(res => {
          if (res.code === '200') {
            // 过滤出已关联的资源
            const { userType } = storage.get('userInfo')
            const relevanceResource = userType == '平台' ? res.data : filterChecking(res.data)
            commit(UPDATE_RELEVANCERESOURCE, relevanceResource)
            resolve(res)
          } else {
            reject()
          }
        })
      })
    },
  }
}

export default app
