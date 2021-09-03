import axios from 'axios'
import { MessageBox, Message, Notification } from 'element-ui'
import store from '@/store'
import storage from 'store'
import { getToken } from '@/utils/auth'

const qs = require('qs')


const service = axios.create({
    withCredentials: true,
    // timeout: 5000
})


service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            config.headers['Authorization'] = getToken()
            const userInfo = storage.get('userInfo') || ''
            config.headers['CURRENT_USER_ID'] = userInfo.userId
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 错误处理
const errorHandler = (error) => {

    if (error.response) {
        Notification({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
    }
    return Promise.reject(error)
}


service.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code && res.code == '9527') {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
            store.dispatch('user/logout')

        } else if (res.code && res.code !== '200') {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })
        }
        return res
    }, errorHandler
)

export default service
