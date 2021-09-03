import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'
import en from './en'
import zh from './zh'


Vue.use(VueI18n)
const messages = {
    en: {
        ...en,
        ...enLocale
    },
    zh: {
        ...zh,
        ...zhLocale
    }
}

const i18n = new VueI18n({
    locale: localStorage.lang || 'zh', // 设置语言
    messages, // 转化配置项
})

ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n