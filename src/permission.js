import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { flat, deepCopy } from '@/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/nomenu', '/home', '/404','/personalInfo/table'] // 白名单

const hasMenu = (to, from) => {
    const relevanceResource = deepCopy(store.getters.relevanceResource) //资源列表
    // 如果是从首页点击跳转，或者跳转到首页 404 登录页 绕过判断
    if (!relevanceResource.length) return true

    const flatMenu = flat(relevanceResource)
    const menus = flatMenu.filter(item => item.type == 2)
    const menuPath = menus.map(item => item.url)
    const fullPath = to.fullPath.split('/table')[0]
    const matchPath = to.matched[0].path

    if (menuPath.includes(fullPath) || menuPath.includes(matchPath)) {
        return true
    }
    return false
}


router.beforeEach(async (to, from, next) => {
    const hasToken = getToken()
    const isOneProduct = store.state.app.productList && (store.state.app.productList.length == 1) //是否只有一个产品
    const initialUrl = store.state.app.initialUrl //初始路由
    NProgress.start()
    document.title = getPageTitle(to.meta.title)

    // 是否有token
    if (hasToken) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        } else {
            if (to.path === '/home') {
                // 如果进入首页，产品只有一个的话，直接进入初始url
                isOneProduct && next({ path: initialUrl })
            }
            if (whiteList.indexOf(to.path) !== -1) {
                next()
            } else {
                if (hasMenu(to, from)) {
                    next()
                } else {
                    next(`/404`)
                    NProgress.done()
                }
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach((to, from) => {
    // leaveUpdateCache(to, from)
    NProgress.done()
})