import { mapState, mapGetters } from 'vuex'
import { responseHandler } from '@/utils/responseHandler'
const baseMixin = {
  computed: {
    ...mapGetters(['appInfo', 'userInfo']),

  }
}


const userMixin = {
  computed: {
    ...mapState({
      // activeDirectory: state => state.app.activeDirectory,
      // directory_list: state => state.app.directory_list,
      // menu_list: state => state.app.menu_list,
      // activeMenu: state => state.app.activeMenu,
      ishome: state => state.app.ishome
    })
  },
  methods: {
    responseHandler(code, data, message) {
      return responseHandler(code, data, message)
    },
  }
}


export default Vue => {
  Vue.mixin(baseMixin)
  Vue.mixin(userMixin)
}
