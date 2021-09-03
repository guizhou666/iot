import { login, logout } from '@/api/user'
import { getUser } from '@/api/userManage'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

import jwt from 'jsonwebtoken'
import storage from 'store'
import { UPDATE_USERINFO,UPDATE_MENUS,INITIAL_URL, UPDATE_RELEVANCERESOURCE, UPDATE_APPINFO, UPDATE_PRODUCTLIST } from '../mutation-types'
import router from '@/router'
import store from '../index'

const resetState = () => {
    removeToken()
    resetRouter()
    store.commit(`user/${UPDATE_USERINFO}`, {
        userInfo: {}
    })
    store.commit(UPDATE_APPINFO, {})
    store.commit(UPDATE_RELEVANCERESOURCE, [])
    store.commit(UPDATE_PRODUCTLIST, [])
    store.commit(INITIAL_URL, '')
    store.commit(UPDATE_MENUS, [])
}

const user = {
    // 当namespaced=true 时， vuex, 将会自动给各自module 添加访问路径名。 方便区分moduel
    namespaced: true,

    state: {
        token: {},
        userInfo: storage.get('userInfo') || {},
    },

    mutations: {
        // 更新用户信息
        [UPDATE_USERINFO]: (state, { userInfo, needParse }) => {
            // 判断用户类型
            if (needParse) {
                userInfo.user = userInfo.user && JSON.parse(userInfo.user)
            }
            if (userInfo.userId) {
                const { tenantId, orgId } = userInfo.user
                if (tenantId == -1) {
                    userInfo.userType = '平台'
                } else if (orgId == -1) {
                    userInfo.userType = '租户'
                } else {
                    userInfo.userType = '机构'
                }
            }
            state.userInfo = userInfo
            storage.set('userInfo', userInfo)
        },
    },

    actions: {
        login({ commit }, payload) {
            return new Promise((resolve, reject) => {
                const { userAccount, password } = payload
                login({ userAccount, password })
                    .then(res => {
                        if (res.code == '200') {
                            const userInfo = jwt.decode(res.data)
                            // 在cookie中设置token
                            setToken(res.data)
                            // 更新用户信息  needParse: token中 user字段需要 parse
                            commit(UPDATE_USERINFO, { userInfo, needParse: true })
                            resolve(res)
                        } else {
                            reject(res)
                        }
                    })
                    .catch(error => {
                        reject(error)
                    })
            })
        },

        logout({ commit }) {
            logout().then(res => {
                resetState()
                router.push('/login')
            }).catch(err => {
                resetState()
                router.push('/login')
            })
        },

        // 获取用户信息
        getUserInfo({ commit }, userId) {
            return new Promise((resolve, reject) => {

                getUser({ id: userId }).then(res => {
                    if (res.code == 200) {
                        const userInfo = store.state.user.userInfo
                        commit(UPDATE_USERINFO, { userInfo: Object.assign(userInfo, res.data), needParse: false })
                        resolve()
                    }
                })
            })
        }
    }

}
export default user