import Loading from './Loading.vue'

let instance = null

export default {
  install(Vue,options) {
    if(!instance) {
      let MyLoading = Vue.extend(Loading)
      instance = new MyLoading({
        el: document.createElement('div')
      })
      document.body.appendChild(instance.$el)
    }

    instance.isShow = false
    let customMethos = {
      show() {
        instance.isShow = true
      },
      hide() {
        instance.isShow = false
      }
    }

    if(!Vue.$iotloading) {
      Vue.$iotloading = customMethos
      Vue.prototype.$iotloading = Vue.$iotloading
    }else {
    }
  }
}
