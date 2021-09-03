import Vue from 'vue'
import store from './store'
import router from './router'
import App from './App'
import i18n from '@/plugins/locale'
import mock from '../mock'
import installDirective from '@/plugins/directive'
import installFilter from '@/plugins/filter'
import installElement from '@/plugins/elementui'
import installQuillEditor from '@/plugins/quillEditor'
import installMixin from '@/store/app-mixin'
import '@/styles/index.scss' // 全局样式
import '@/permission' // 权限控制


installDirective(Vue)
installFilter(Vue)
installElement(Vue)
installQuillEditor(Vue) //富文本
installMixin(Vue)


// mock() // 开启mock

Vue.config.productionTip = false //阻止启动生产消息


new Vue({
    el: '#app',
    router,
    store,
    i18n,
    render: h => h(App)
})
