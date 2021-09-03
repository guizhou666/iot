import request from '@/utils/request'

// 查询所有
export function getTemplage(params) {
    return request({
        url: '/vue-admin-template/template/getTemplate',
        method: 'get',
        params
    })
}
