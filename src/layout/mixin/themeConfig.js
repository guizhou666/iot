import storage from 'store'
import { mapGetters } from 'vuex'
import { themeSetting } from './settings'

// let theme = storage.get('theme')
export default {
    computed: {
        ...mapGetters(['directorys', 'menus', 'activeDirectory', 'activeMenu', 'theme']),
        showNavMenu() {
            return themeSetting[this.theme].showNavMenu //展示侧边菜单
        },
        showSubNavMenu() {
            return themeSetting[this.theme].showSubNavMenu //展示侧边菜单
        },
        styleKey() {
            return themeSetting[this.theme].styleKey //展示侧边菜单
        },
    }
}