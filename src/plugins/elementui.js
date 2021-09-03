import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


// 主题换肤
import { initThemeColor } from '@/components/SettingDrawer/themeColor'
initThemeColor()


export default Vue => {
  Vue.use(ElementUI)
}