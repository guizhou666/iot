import store from '@/store'
import { UPDATE_DIRECTORYS, UPDATE_MENUS } from '@/store/mutation-types'
import { deepCopy } from '@/utils'
import storage from 'store'

// 主题风格
export const themeSetting = {
  '01': {
    styleKey: 'default',
    // directoryLayout: 'vertical',// 目录菜单布局  vertical 垂直 horizaontal水平
    // menuLayout: 'vertical',// 菜单布局
    showNavMenu: false, // 展示顶部菜单
    showSubNavMenu: false // 展示顶部二级菜单
  },
  '02': {
    styleKey: 'htsy',
    // directoryLayout: 'horizontal',// 目录菜单布局  vertical 垂直 horizaontal水平
    // menuLayout: 'vertical',// 菜单布局
    showNavMenu: true, // 展示顶部菜单
    showSubNavMenu: false // 展示顶部二级菜单
  },
  '03': {
    styleKey: 'yyzc',
    // directoryLayout: 'horizontal',// 目录菜单布局  vertical 垂直 horizaontal水平
    // menuLayout: 'horizontal',// 菜单布局
    showNavMenu: true, // 展示顶部菜单
    showSubNavMenu: true, // 展示顶部二级菜单

  },
  '04': {
    styleKey: 'csfg',
    // directoryLayout: 'vertical', // 目录菜单布局  vertical 垂直 horizaontal水平
    // menuLayout: 'vertical', // 菜单布局
    showNavMenu: false, // 展示顶部菜单
    showSubNavMenu: false // 展示顶部二级菜单
  },
}

// 个性化设置
export const uniqueSetting = {
  setting1: {
    primaryColor: '#00569d',
    loginPosition: 'flex-end',
    bgUrl: 'bg1.jpg',
    logoUrl: 'logo1.png'
  },
  setting2: {
    primaryColor: '#094675',
    loginPosition: 'center',
    bgUrl: 'bg2.jpg',
    logoUrl: 'logo2.png'
  },
  setting3: {
    primaryColor: '#fe7b25',
    loginPosition: 'flex-end',
    bgUrl: 'bg3.jpg',
    logoUrl: 'logo3.png'
  },
  setting4: {
    primaryColor: '#c9252b',
    loginPosition: 'flex-start',
    bgUrl: 'bg4.jpg',
    logoUrl: 'logo4.png'
  },
}


const addHome = (list) => {
  return list.unshift({
    code: "000000",
    icon: "el-icon-s-home",
    id: "0000000",
    name: "返回首页",
    parentId: "-1",
    resourceSort: 0,
    type: 1,
    url: "/home",
    childList: []
  })
}


export const handleLayout = (resource) => {
  let relevanceResource = deepCopy(resource)
  return new Promise((resolve, reject) => {

    const { menus, directorys } = handleMenu(relevanceResource)

    store.commit(UPDATE_DIRECTORYS, directorys);
    store.commit(UPDATE_MENUS, menus);
    resolve({ directorys, menus })
  })
}

const handleMenu = (relevanceResource) => {
  let menus, directorys
  const oneProduct =  storage.get('productList').length == 1
  const theme = storage.get('theme')
  switch (theme) {
    case '01':
      menus = relevanceResource
      directorys = []
      !oneProduct && addHome(menus)
      break;
    case '02':
      menus = relevanceResource[0].childList || []
      directorys = relevanceResource
      !oneProduct && addHome(directorys)
      break;
    case '03':
      menus = relevanceResource[0].childList || []
      directorys = relevanceResource
      !oneProduct && addHome(directorys)
      break;
    default:
      menus = relevanceResource
      directorys = []
      !oneProduct && addHome(menus)
      break;
  }
  return {
    menus, directorys
  }
}

