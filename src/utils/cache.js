import store from '@/store'
import {
    UPDATE_CACHECOMPONENTS
} from '@/store/mutation-types'
export const enterUpdateCache = (to, from, next) => {
    const cacleList = ['/roleManagement/add', '/roleManagement/edit', '/roleManagement/detail']
    if (!cacleList.includes(from.path)) {
        next(vm => {
            // 避免第一次缓存的时候失效
            vm.$store.commit(UPDATE_CACHECOMPONENTS, ['roleManagementTable'])
        })
    } else {
        next()
    }
}
export const leaveUpdateCache = (to, from) => {


    const cacleList = ['/roleManagement/add', '/roleManagement/edit', '/roleManagement/detail']
    if (cacleList.includes(to.path)) {


        store.commit(UPDATE_CACHECOMPONENTS, ['roleManagementTable'])
    } else {
        store.commit(UPDATE_CACHECOMPONENTS, [])
    }
}